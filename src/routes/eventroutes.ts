// routes/eventRoutes.js
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
const router = Router();

// Route to create a new event
 router.post('/', async (req, res) => {
    //@ts-ignore

   //@ts-ignore
   const user = req.user;
  try {
    const { event_name, description, date, location, organisedby } = req.body;

    const newEvent = await prisma.event.create({
      data: {
        event_name,
        user_id:1,
        description,
        date,
        location,
        organisedby,
      },
      include: { user: true },
    });

    res.json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
// Route to get all events
 router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
        include: {
            user: { select: { id: true } },
            registrations: true
          
        } 
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
// Route to get a specific event by ID
router.get('/:eventId', async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);

    const event = await prisma.event.findMany({
      where: {
        event_id: eventId,
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update a specific event by ID
router.put('/:eventId', async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const { event_name, description, date, location, organisedby } = req.body;

    const updatedEvent = await prisma.event.update({
      where: {
        event_id: eventId,
      },
      data: {
        event_name,
        description,
        date,
        location,
        organisedby,
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a specific event by ID
router.delete('/:eventId', async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);

    const deletedEvent = await prisma.event.delete({
      where: {
        event_id: eventId,
      },
    });

    res.json(deletedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
