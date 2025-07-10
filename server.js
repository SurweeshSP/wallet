import express from 'express';
import dotenv from 'dotenv';
import { sql } from './src/config/db.js';
import rateLimiter from './src/middleware/rateLimiter.js';
import transactionsRoute from './src/routes/transactionsRoute.js';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 5001;


const app = express();

app.use(cors());
app.use(rateLimiter);
app.use(express.json());
async function initDB() {
    try{
          await sql`CREATE TABLE IF NOT EXISTS transaction(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        create_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`
        console.log('Databse init successfully');
    }catch(error){
        console.log('error init DB !!!');
        process.exit(1);
    }
}

app.use("/api/transactions", transactionsRoute);

initDB().then(()=>{
    app.listen(PORT, '0.0.0.0' , ()=>{
    console.log(`Server is running on port ${PORT}`);
    });
})

