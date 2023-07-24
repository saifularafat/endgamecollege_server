const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const admissionCollection = client.db('endGameColleges').collection('admissions');

        //users api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query)
            if (existingUser) {
                return (res.send({ message: 'Already Your account exist.' }))
            }
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });
        app.patch('/users/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: new ObjectId(email) };
            const options = { upsert: true };
            const usersUpdate = req.body;
            const info = {
              $set: {
                name: usersUpdate.name,
                email: usersUpdate.email,
                address: usersUpdate.address,
                university: usersUpdate.university
              }
            }
            const result = await usersCollection.updateOne( filter, info, options);
            res.send(result)
          })

        // colleges api 
        app.get('/colleges', async (req, res) => {
            const result = await collegesCollection.find().toArray();
            res.send(result)
        })

        // testimonials api 
        app.get('/testimonials', async (req, res) => {
            const result = await testimonialCollection.find().toArray();
            res.send(result)
        })

        //admissions api
        app.post("/admissions", async (req, res) => {
            const admission = req.body;
            const result = await admissionCollection.insertOne(admission);
            res.send(result);
        });

        app.get('/admissions', async (req, res) => {
            const result = await admissionCollection.find().toArray();
            res.send(result)
        })

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
