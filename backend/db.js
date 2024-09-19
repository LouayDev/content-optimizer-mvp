const {Pool} = require('pg')

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  max: 10,
})

const query = (text, params callback) => {
  return pool.query(text, params, callback)
}

module.exports = {query}