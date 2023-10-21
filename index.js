const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.dokkyfc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const carCollection = client.db("automobile").collection("cars");
    const cartCollection = client.db("automobile").collection("cart");

    app.get("/cars", async (req, res) => {
      const cursor = await carCollection.find({}).toArray();
      // const cars =  cursor;
      res.send(cursor);
    });

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const car = await carCollection.findOne(query);
      res.send(car);
    });

    app.get("/singleUpdate/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const car = await carCollection.findOne(query);
      res.send(car);
    });

    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const updatedCar = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedCar.name,
          price: updatedCar.price,
          image: updatedCar.image,
          shortDescription: updatedCar.shortDescription,
          type: updatedCar.type,
          rating: updatedCar.rating,
          brandName: updatedCar.brandName,
        },
      };
      const result = await carCollection.updateOne(query, updateDoc, options);
      console.log(result);
      res.send(result);
    });

    app.post("/addCar", async (req, res) => {
      const newCar = req.body;
      const result = await carCollection.insertOne(newCar);
      console.log(result);
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const newCart = req.body;
      console.log(newCart);
      const result = await cartCollection.insertOne(newCart);
      console.log(result);
      res.send(result);
    });

    app.get('/cart/:email', async(req,res)=>{
      console.log(req.params.email);
      const result = await cartCollection.find({email: req.params.email}).toArray();
      res.send(result);
    });

    app.delete("/cart/:itemId", async (req, res) => {
      const itemId = req.params.itemId;
      const query = { _id: new ObjectId(itemId) };
      const result = await cartCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
    

    

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
