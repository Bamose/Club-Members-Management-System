import express from 'express';
import cors from 'cors';
import authroutes from './routes/authroutes';
import eventroutes from './routes/eventroutes';
import userroutes from './routes/userroutes';
import { authenticateToken } from './middlewares/authmiddlewares';



const app = express();


app.use(express.json());


app.use(cors());
app.use('/auth', authroutes);
app.use('/user',authenticateToken, userroutes );
app.use('/events',authenticateToken, eventroutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server ready at localhost:3000');
});
