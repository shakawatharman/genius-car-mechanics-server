const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId
require("dotenv").config();

app.use(cors());
app.use(express.json());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.a0htp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("mechanics-db");
    const servicesCollection = database.collection("mechanics-db-1");

    // Post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log('data hited',service)
      const result = await servicesCollection.insertOne(service)
      res.json(result)
    });
    // get api 
    app.get("/services",async (req,res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      console.log(services)
      res.send(services)
    })

    // get single service 
app.get("/services/:id",async (req,res)=>{
  const id = req.params.id;
  const query = { _id:ObjectId(id) };
  const service = await servicesCollection.findOne(query);
  res.json(service)
})

// delete api
app.delete('/services/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id:ObjectId(id)}
  const result = await servicesCollection.deleteOne(query)
  res.json(result)
})


  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is connected");
});
app.listen(port, () => {
  console.log("listening to the port", port);
});
