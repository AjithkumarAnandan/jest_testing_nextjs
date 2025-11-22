

const express=require("express");
const { Pool } = require("pg");
require("dotenv").config();

const dbapi=express();
dbapi.use(express.json());

export const pool=new Pool({
    host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
})

// Test DB connection
pool
  .connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch((err:Error) => console.error("PostgreSQL connection error:", err));