import express from 'express';
import cors from 'cors';
import app from '../server.js';

const server = express();

// CORS configuration with dynamic origin handling
server.use(cors({
  origin: function(origin, callback) {
    if(!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://expense-tracker-nhjd.vercel.app',
      'https://expense-tracker-nhjd-git-main-adarsh-naik-2004s-projects.vercel.app',
      'http://localhost:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
    const origin = req.headers.origin;
    if (origin?.endsWith('vercel.app') || origin === 'http://localhost:3000') {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
      );
      return res.status(200).end();
    }
  }
  
  await server(req, res);
}