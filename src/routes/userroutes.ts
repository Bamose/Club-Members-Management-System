// userRoutes.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany(
      {
        include: {department:true}
      }
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new user
router.post('/', async (req: Request, res: Response) => {
  const { username, password, email, role, departmentName } = req.body;

  try {
    // Check if the department exists, or create it if not
    let department = await prisma.department.findUnique({
      where: { name: departmentName },
    });

    if (!department) {
      department = await prisma.department.create({
        data: { name: departmentName },
      });
    }

    // Create the user with the associated department
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        email,
        role,
        department: { connect: { id: department.id } },
      },
    });

    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update user by ID
router.put('/:id', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const { username, password, email, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        password,
        email,
        role,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete user by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
