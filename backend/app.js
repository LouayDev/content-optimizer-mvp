require('dotenv').config()
const express = require('express')
const app = express()


const userSchema = require('../shared/schemas/user.js')
const z = require('zod')

//middleware
app.use(express.json())

app.get('/', (req, res) => {
  res.send('hello there')
})

app.post('/signup', async (req, res) => {
  const {username, password} = req.body
  const result = userSchema.safeParse({username, password})

  if(!result.success){ 
    return res.status(400).json({message: result.error.issues[0].message})
  }

})

const PORT = 4000
app.listen(PORT, () => {
  console.log('server running at port:', PORT)
})