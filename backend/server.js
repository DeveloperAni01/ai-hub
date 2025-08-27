import dotenv from 'dotenv'
dotenv.config();
import app from './src/app.js';
import connectToDB from './src/db/db.js';
import initSocketServer from './src/sockets/socket.server.js';
import http from 'http';


const httpServer = http.createServer(app);

initSocketServer(httpServer);
connectToDB();
const port = process.env.PORT || 4000;


httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
