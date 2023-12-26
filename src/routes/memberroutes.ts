import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Create a member
router.post('/', async (req: Request, res: Response) => {
  const { first_name, last_name, email, phone_number, departmentName } = req.body;
 //@ts-ignore
 const user = req.user;
  try {
    let department = await prisma.department.findUnique({
        where: { name: departmentName },
      });
  
      if (!department) {
        department = await prisma.department.create({
          data: { name: departmentName },
        });
      }
  
    const member = await prisma.member.create({
      data: {
        user_id:2,
        first_name,
        last_name,
        email,
        phone_number,
        department_name: department.name,
        
    },
      include:{user:true}
    });

    res.status(201).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all members
router.get('/', async (_req: Request, res: Response) => {
  try {
    const members = await prisma.member.findMany();
    res.json(members);
    console.log(members)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific member by ID
router.get('/:id', async (req: Request, res: Response) => {
  const memberId = parseInt(req.params.id, 10);

  try {
    const member = await prisma.member.findUnique({
      where: { member_id: memberId },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a member by ID
router.put('/:id', async (req: Request, res: Response) => {
  const memberId = parseInt(req.params.id, 10);
  const { first_name, last_name, email, phone_number, department_name } = req.body;

  try {
    const updatedMember = await prisma.member.update({
      where: { member_id: memberId },
      data: {
        first_name,
        last_name,
        email,
        phone_number,
        department_name,
      },
    });

    res.json(updatedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a member by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const memberId = parseInt(req.params.id, 10);

  try {
    await prisma.member.delete({
      where: { member_id: memberId },
    });

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
