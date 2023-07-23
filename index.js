const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
    origin: "*",
    Credential: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions))
app.use(express.json())

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.guqonkt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();
        const usersCollection = client.db('endGameColleges').collection('users');
        const testimonialCollection = client.db('endGameColleges').collection('testimonials');
        const collegesCollection = client.db('endGameColleges').collection('colleges');

       
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('End Game Colleges Server site Running')
})
app.listen(port, () => {
    console.log(`A Server is Running and port code ${port} `)
})
