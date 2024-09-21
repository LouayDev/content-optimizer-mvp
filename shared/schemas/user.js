const z = require('zod')

const User = z.object({
  username: z.string({required_error: "username is required", invalid_type_error: "username must be a type of string"}).min(3, {message: "username must contain a minimum of 3 characters"})
  .max(15, {message: "username must have a maximum of 15 characters"}),
  password: z.string({required_error: "username is required", invalid_type_error: "password must be a type of string"}).min(8, {message: "password must contain a minimum of 8 characters"})
  .max(50, {message: "password must have a maximum of 50 characters"})
})

module.exports = User