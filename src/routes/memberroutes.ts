import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Create a member
router.post('/members', async (req: Request, res: Response) => {
  const { first_name, last_name, email, phone_number, department_id } = req.body;

  try {
    const member = await prisma.member.create({
      data: {
        user_id:1,
        first_name,
        last_name,
        email,
        phone_number,
        department_id,
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
router.get('/members', async (_req: Request, res: Response) => {
  try {
    const members = await prisma.member.findMany();
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific member by ID
router.get('/members/:id', async (req: Request, res: Response) => {
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
router.put('/members/:id', async (req: Request, res: Response) => {
  const memberId = parseInt(req.params.id, 10);
  const { first_name, last_name, email, phone_number, department_id } = req.body;

  try {
    const updatedMember = await prisma.member.update({
      where: { member_id: memberId },
      data: {
        first_name,
        last_name,
        email,
        phone_number,
        department_id,
      },
    });

    res.json(updatedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a member by ID
router.delete('/members/:id', async (req: Request, res: Response) => {
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
