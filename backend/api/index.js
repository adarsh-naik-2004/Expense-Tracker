import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import app from '../server.js';

const server = express();

// CORS configuration
server.use(cors({
  origin: ['https://expense-tracker-nhjd.vercel.app', 'https://expense-tracker-nhjd-dfzfcxg62-adarsh-naik-2004s-projects.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
server.options('*', cors());

// Forward all requests to your main app
server.use((req, res) => {
  app(req, res);
});

// Handle serverless environment
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
    return res.status(200).end();
  }
  
  await server(req, res);
}