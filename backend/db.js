const {Pool} = require('pg')

const pool = new Pool({
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  user: process.env.USER,
  host: process.env.HOST,
  port: process.env.PORT,
  max: 10,
})

const query = (text, params, callback) => {
  return pool.query(text, params, callback)
}

module.exports = {query}