import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './utils/connectDb.js';
import router from './routes/route.js';

const app = express()

dotenv.config();

const port = process.env.PORT || 3000

app.use(express.json());
app.use(cors());
app.use('/api', router);

await connectDb();

app.get('/', (req, res) => {
    res.send('hello World!')
});

app.listen(port, () => {
    console.log('Server is listening on http://localhost:' + port);
});
