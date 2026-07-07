const express = require('express')
const sequelize = require('./util/database') // Twoje połączenie
const Post = require('./models/post') // Importujesz JUŻ ZDEFINIOWANY model
const bodyParser = require('body-parser')

const blogRoutes = require('./routes/blog')

const app = express()

// ... reszta middleware (express.json() itp.)

app.use(bodyParser.json())
// app.use(cors())

// app.use((req, res, next) => {
//   res.set({
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//   })
// //   res.setHeader('Access-Control-Allow-Origin', 'localhost')
//   //   res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
//   //   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//   next()
// })

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*'])
  res.append('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.append('Access-Control-Allow-Headers', '*')
  next()
})

app.use('/blog', blogRoutes)

sequelize
  // .sync({ alter: true }) // Synchronizuj modele z bazą danych (tworzy tabele, jeśli nie istnieją)
  .sync() // Synchronizuj modele z bazą danych (tworzy tabele, jeśli nie istnieją)
  .then(() => {
    console.log('Baza zsynchronizowana!')
    app.listen(9090)
  })
  .catch((err) => console.log('Błąd synchronizacji:', err))

// const express = require('express')
// const bodyParser = require('body-parser')
// const mongoose = require('mongoose')
// const { Client } = require('pg')
// const cors = require('cors')

// const blogRoutes = require('./routes/blog')

// const app = express()

// app.use(bodyParser.json())
// // app.use(cors())

// // app.use((req, res, next) => {
// //   res.set({
// //     'Access-Control-Allow-Origin': '*',
// //     'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
// //     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// //   })
// // //   res.setHeader('Access-Control-Allow-Origin', 'localhost')
// //   //   res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
// //   //   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
// //   next()
// // })

// app.use((req, res, next) => {
//   res.append('Access-Control-Allow-Origin', ['*'])
//   res.append('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//   res.append('Access-Control-Allow-Headers', '*')
//   next()
// })

// app.use('/blog', blogRoutes)

// const connectionString = 'postgresql://postgres:root@localhost:5432/blog_app'

// const client = new Client({
//   connectionString: connectionString,
// })

// client
//   .connect()
//   .then(() => {
//     app.listen(9090, () => {
//       console.log('DB connnected! Server running on localhost:9090...')
//     })
//   })
//   .catch((err) => console.log(err))

// mongoose
//   .connect(
//     'mongodb://gregor:Blazini83!!@cluster0-shard-00-00.xy06z.mongodb.net:27017,cluster0-shard-00-01.xy06z.mongodb.net:27017,cluster0-shard-00-02.xy06z.mongodb.net:27017/?ssl=true&replicaSet=atlas-bvmlek-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0',
//   )
//   .then(() => {
//     app.listen(9090, () => {
//       console.log('DB connnected! Server running on localhost:9090...')
//     })
//   })
//   .catch((err) => console.log(err))
