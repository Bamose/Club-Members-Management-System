import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super secret';
const JWT_EXPIRATION = 12;

// Helper function to generate SMS token
function generateEmailToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to generate JWT token
function generateAuthToken(tokenid:number,userId:number, role:string) {
  const payload = { tokenid,userId, role };
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
    noTimestamp: true,
  });
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
          roleAccess: true,
          tokens: true,
        },
      });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if the user has the required role for authentication
   
    // Generate JWT token
    const authToken = generateAuthToken(user.tokens[0].id,user.id, user.role);

    res.json({ authToken, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Generate 6-digit email token
      const emailToken = generateEmailToken();
      const expiration = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minutes expiration
        console.log(emailToken)
      // Create and store the token in the database
      const createdToken = await prisma.token.create({
        data: {
          type: 'EMAIL',
          emailToken:emailToken,
          expiration,
          user: {
            create: {
              username,
              email,
              password: hashedPassword,
           
              // Assign a default role during registration, modify as needed
              role: 'user',
            },
          },
        },
      });
  
      // Send the email token to the user
   /*    await sendEmailToken(email, emailToken); */ // Implement this function to send the email
  
      // Generate JWT token

      console.log(createdToken)
      res.json( createdToken);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.post('/authenticate', async (req, res) => {
    const { email, emailToken } = req.body;
  
    try {
      const dbEmailToken = await prisma.token.findUnique({
        where: {
          emailToken,
        },
        include: {
          user: true,
        },
      });
  
      if (!dbEmailToken || !dbEmailToken.valid) {
        return res.sendStatus(401);
      }
  
      if (dbEmailToken.expiration < new Date()) {
        return res.status(401).json({ error: 'Token expired' });
      }
  
      if (dbEmailToken?.user?.email !== email) {
        return res.status(401).json({ error: "Email doesn't match" });
      }
  
      // Fetch the user's role from the database
      const user = await prisma.user.findUnique({
        where: {
          id: dbEmailToken.userId,
        },
      });
  
      if (!user) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      const expiration = new Date(
        new Date().getTime() + JWT_EXPIRATION * 60 * 60 * 100000
      );
  
      // Create a new API token for the user
      const apiToken = await prisma.token.create({
        data: {
          type: 'API',
          expiration,
          user: {
            connect: {
              email,
            },
          },
        },
      });
  
      // Update the email token to mark it as used
      await prisma.token.update({
        where: {
          id: dbEmailToken.id,
        },
        data: { valid: false },
      });
  
      // Generate and send the authentication token
      const authToken = generateAuthToken(apiToken.id,user.id,user.role);
      console.log(authToken)
      res.json({ authToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
export default router;
