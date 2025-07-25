import express from 'express'
import routes from './routes/index.js'

const server = express()

server.use(express.json())
server.use(routes)

server.listen(3000, () => {
    console.log(`server is running on port 3000`);
})