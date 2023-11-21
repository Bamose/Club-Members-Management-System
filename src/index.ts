import express from 'express';
import cors from 'cors';
import authroutes from './routes/authroutes';
import eventroutes from './routes/eventroutes';
import userroutes from './routes/userroutes';



const app = express();


app.use(express.json());


app.use(cors());

app.use('/user', userroutes );
app.use('/events', eventroutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server ready at localhost:3000');
});
