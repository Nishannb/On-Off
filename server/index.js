require('dotenv').config()

const express = require('express');
const app = express();
const { v4:uuidv4 } = require('uuid')
const bcrypt= require('bcrypt')

const jwt = require('jsonwebtoken');
const cors = require('cors')

const PORT = 8000;

const { MongoClient } = require('mongodb')


const uri = process.env.URI


app.use(cors())
app.use(express.json())

app.get('/', (req,res)=>{
    res.json("Hello")
})


app.post('/signup', async(req,res)=>{
    const client = new MongoClient(uri);
    const {email, password} = req.body;

    const generatedUserId =  uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        await client.connect();
        const db = client.db('app-data');
        const users = db.collection('users');

        const existingUser = await users.findOne({ email });

        if(existingUser){
            return res.status(409).send("User already exist")
        }

        const sanitizedEmail = email.toLowerCase();

        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hash_password: hashedPassword
        }
        const insertedUser = await users.insertOne(data);

        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24,
        })
        
        res.status(201).json({ token, UserId: generatedUserId })
    } catch (e){
        console.log(e)
    }
})

app.get('/gendered-users', async(req,res)=>{
    const client = new MongoClient(uri);
    const gender = req.query.gender

    try{
        await client.connect();
        const db = client.db('app-data');
        const users = db.collection('users');
        const query = {gender_identity: gender}
        
        const returnedUser = await users.find(query).toArray()
        res.send(returnedUser)
    } catch(e){
        console.log(e)
    } finally{
        await client.close()
    }
});

app.get('/user', async(req,res)=>{
    const client = new MongoClient(uri);
    const userId = req.query.userId;

    try{
        await client.connect();
        const db = client.db('app-data')
        const users = db.collection('users');

        const query = {user_id: userId};
        const user = await users.findOne(query);
        res.send(user)
    } finally{
        await client.close();
    }
})

// Get all Users by userIds in the Database
app.get('/users', async (req, res) => {
    const client = new MongoClient(uri)
    const userIds = JSON.parse(req.query.userIds)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const pipeline =
            [
                {
                    "$match": {
                        "user_id": {
                            "$in": userIds
                        }
                    }
                }
            ]

        const foundUsers = await users.aggregate(pipeline).toArray()

        res.json(foundUsers)

    } finally {
        await client.close()
    }
})


app.post('/login', async(req,res)=>{
    const client = new MongoClient(uri);
    const {email, password} = req.body;

    try{
        await client.connect();
        const db = client.db('app-data');
        const users = db.collection('users');

        const user = await users.findOne({ email });

        const comparePassword = await bcrypt.compare(password, user.hash_password);
        if(user && comparePassword){
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24
            })
            return res.status(201).json({ token, UserId: user.user_id })
        }
        res.status(400).send('Invalid Credentials');
    } catch(e){
        console.log(e)
    }
})

app.put('/user', async(req,res)=>{
    const client = new MongoClient(uri);
    const formData = req.body.formData;

    try{
        await client.connect();
        const db = client.db('app-data');
        const users = db.collection('users');

        const query = { user_id: formData.user_id}
        const updateDocument = {
            $set: {
                first_name: formData.firstname,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                url:formData.url,
                about:formData.about,
                matches: formData.matches,
                show_gender: formData.show_gender
            }
        }
        const insertedUser = await users.updateOne(query, updateDocument);
        res.send(insertedUser);
        } finally{
        await client.close();
    }
})

app.put('/addmatch', async(req, res)=>{
    const client = new MongoClient(uri);
    const { userId, matchedUserId } = req.body;

    try{
        await client.connect();
        const db = client.db('app-data');
        const users = db.collection('users');

        const query = { user_id: userId}

        const updateDocument = {
            $push: {matches: {user_id: matchedUserId}}
        }
        const user = await users.updateOne(query, updateDocument)
        res.send(user)
    } finally{
        await client.close()
    }
})

app.get("/messages", async(req,res)=>{
    const client = new MongoClient(uri);
    const {userId, correspondingUserId} = req.query

    try{
        await client.connect()
        const database = client.db("app-data");
        const messages = database.collection('messages');

        const query = {
            from_userId: userId, to_userId: correspondingUserId
        }
        const foundMessages = await messages.find(query).toArray()
        res.send(foundMessages)
    } catch(e){
        console.log(e)
    } finally {
        await client.close()
    }
})

app.post('/message', async(req,res)=>{
    const client = new MongoClient(uri);
    const message = req.body.message

    try{
        await client.connect()
        const database = client.db("app-data");
        const messages = database.collection('messages');
        const insertedMessage = await messages.insertOne(message)
        res.send(insertedMessage)
    } finally{
        await client.close()
    }
})



app.listen(PORT, ()=>{
    console.log('Server running on Port ',+PORT);
})