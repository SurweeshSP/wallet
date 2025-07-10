import { sql } from '../config/db.js';
import express from 'express';

export async function getTransactionByUserId(req,res) {
    try{
        const {userId} = req.params;
        const transactions = await sql`SELECT * FROM transaction WHERE user_id = ${userId}`;
        res.status(200).json(transactions);
    }catch(err){
        console.log("Error in geetin gthe transactions", err);
        res.status(500).json({message:"Internal server error"})
    }
}

export async function createTransaction(req, res){
    try{
        const {title, amount, category, user_id}=req.body;
        if(!title||!amount||!category||!user_id){
            return res.status(400).json({message: 'Missing required fields'});
        }
        const transaction = await sql 
        `INSERT INTO transaction(user_id, title, amount, category)
        VALUES(${user_id}, ${title}, ${amount}, ${category})
        RETURNING *`;
        console.log(transaction)
        res.status(201).json(transaction[0]);
    }catch(error){
        console.log("Error creating transactions", error);
        res.status(500).json({message:"Internal server Error"});
    }
}

export async function deleteTransaction(req,res){
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    try {
        const result = await sql`
            DELETE FROM transaction
            WHERE id = ${id}
            RETURNING *`;
        if (result.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted', deleted: result[0] });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function summaryTransaction(req, res) {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount::NUMERIC), 0) AS balance
      FROM transaction
      WHERE user_id = ${userId}`;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount::NUMERIC), 0)AS income
      FROM transaction
      WHERE user_id = ${userId} AND amount::NUMERIC > 0`;

    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount::NUMERIC), 0) AS expense
      FROM transaction
      WHERE user_id = ${userId} AND amount::NUMERIC < 0`;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });
  } catch (error) {
    console.error("Error displaying transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
