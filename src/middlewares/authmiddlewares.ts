import { Request, Response, NextFunction} from "express";
import { PrismaClient, User } from '@prisma/client'
import  jwt  from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "super secret";

const prisma = new PrismaClient();

export type AuthRequest = Request & { user?: User};

export async function authenticateToken(
    req: AuthRequest,
    res:Response,
    next:NextFunction
){
       //authentication
       const authHeader = req.headers['authorization'];
       const jwttoken = authHeader?.split(' ')[1];

       if(!jwttoken){
           return res.sendStatus(401);
       }
      try{
           const payload = (await jwt.verify(jwttoken, JWT_SECRET)) as {tokenid:number};
            console.log(payload)
           const dbToken = await prisma.token.findUnique({
               where: { id: payload.tokenid},
               include: {user: true}
           });
           console.log(dbToken)

           if (!dbToken?.valid || dbToken.expiration < new Date()){
               return res.status(401).json({error: "API token"});
           }

           if (dbToken.expiration < new Date()){
               return res.status(401).json({ error: "APi token expired "})
           }
           
           req.user = dbToken.user;
      }catch(e){
        console.log(e)
       return res.sendStatus(401);
      }

      next();
    
}