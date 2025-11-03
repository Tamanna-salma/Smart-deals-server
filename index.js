const express= require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT || 3000;
 //moddleware
 app.use(cors());
 app .use(express.json())

 app.get('/',(req,res)=>{
    res.send('smart server is running')
 })

 const uri = "mongodb+srv://smartDBuser:Z2XV5qA6hdYylwHH@cluster0.nlnjuiz.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
const db=client.db('smart_db');
const productsCollection=db.collection('products');

app.get('/products',async(req,res)=>{
    const cursor= productsCollection.find();
    const result= await cursor.toArray();
    res.send(result)
});

//  get a single data

app.get('/products/:id',async(req,res)=>{
    const id=req.params.id;
    const query= {_id: new ObjectId(id)}
    const result= await productsCollection.findOne(query)
    res.send(result)
})


app.post('/products',async(req,res)=>{
    const newproduct=req.body;
    const result=await productsCollection .insertOne(newproduct);
    res.send(result)
})
app.patch('/products/:id',async(req,res)=>{
    const id=req.params.id;
    const updatedproduct=req.body ;
    const query={_id: new ObjectId(id)}
    const update={
        $set:{
            name: updatedproduct.name,
          price: updatedproduct.price,
          color:updatedproduct.color
        }
    }
    const result=await productsCollection .updateOne(query,update)
    res.send(result)

})

app.delete('/products/:id',async(req,res)=>{
   const id=req.params.id; 
   const query={_id:new ObjectId(id)}
   const result=await productsCollection.deleteOne(query);
   res.send(result)
})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  
  }
}
run().catch(console.dir);

 app.listen(port,()=>{
 console.log(`smart server is running on port ${port}`);
 })