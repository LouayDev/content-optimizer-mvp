require('dotenv').config()
const express = require('express')
const app = express()
const userSchema = require('../shared/schemas/user.js')
const z = require('zod')
const db = require('./db.js')
const fs = require('fs').promises


//middleware
app.use(express.json())

//checking for express syntax error when invalid json body
app.use((err, req, res, next) => {
  if(err instanceof SyntaxError && err.status === 400 && 'body' in err ) {
    res.status(400).json({message: "ivalid json in the body"})
  }
  next()
})


app.get('/', (req, res) => {
  res.send('hello there')
})

app.post('/signup', async (req, res) => {
  const {username, password} = req.body
  const result = userSchema.safeParse({username, password})

  if(!result.success){ 
    return res.status(400).json({message: result.error.issues[0].message})
  }

  try {
    const createUserSql = await fs.readFile('./sql/createUser.sql', {encoding: 'UTF-8'})
    const response = await db.query(createUserSql, [username, password])

    res.status(201).json({message: "user created sucessfully"})
  } catch(err){
    console.log(err)
    res.status(500).json({message: "we dont know what the fuck is going on wait"})
  }

})

const PORT = 4000
app.listen(PORT, () => {
  console.log('server running at port:', PORT)
})