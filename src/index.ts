import express from 'express';
import cors from 'cors';
import authroutes from './routes/authroutes';

const app = express();


app.use(express.json());


app.use(cors());
app.use('/user', authroutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server ready at localhost:3000');
});
