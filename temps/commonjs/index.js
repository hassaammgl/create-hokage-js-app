const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDb } = require('./utils/connectDb.js');
const router = require('./routes/route.js');

const app = express()

dotenv.config();

const port = process.env.PORT || 3000

app.use(express.json());
app.use(cors());
app.use('/api', router);


const initializeDb = async () => {
    try {
        await connectDb();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

initializeDb();


app.get('/', (req, res) => {
    res.send('hello World!')
});

app.listen(port, () => {
    console.log('Server is listening on http://localhost:' + port);
});