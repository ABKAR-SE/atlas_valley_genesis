import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { env } from './config/env.js';
import { initDb, db } from './storage/db.js';
import { initBlockchain } from './services/blockchainService.js';
import { createApiRouter } from './routes/api.js';
import { setupSocket } from './realtime/socket.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

await initDb();
const { atlasCore, arkvToken } = await initBlockchain();

const nonces = new Map();
const socketsByUser = new Map();

app.use(
  '/',
  createApiRouter({ db, io, nonces, socketsByUser, atlasCore, arkvToken })
);

setupSocket(io, { db, socketsByUser });

httpServer.listen(env.port, () => {
  console.log(`Atlas backend listening on ${env.port}`);
});
