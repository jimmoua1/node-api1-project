const express = require('express')
const db = require('./database')
const server = express();

server.use(express.json());

