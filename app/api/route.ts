import { pool } from "@/Database/db";
import { NextResponse } from "next/server";

const ensureTable = async () => {
    await pool.query(`CREATE SCHEMA IF NOT EXISTS jestlib`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jestlib."users" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(150) UNIQUE,
        age INT
      );
    `);
}
export const POST = async (req: any) => {
    try {
        const { name, email, age } = await req.json();
        // Create table if not present
        ensureTable()
        const findExisted = await pool.query(
            `SELECT * FROM jestlib."users" WHERE email= $1`, [email]
        );
        if (findExisted.rows.length > 0) {
            return NextResponse.json({
                data: [],
                status: 409,
                message: "Email already exists",
            });
        }

        // Insert user
        const result = await pool.query(
            `INSERT INTO jestlib."users" (name, email, age)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [name, email, age]
        );

        return NextResponse.json({
            data: result.rows[0],
            status: 200,
            message: "Successfully done",
        });
    } catch (error) {
        return NextResponse.json(
            { status: 500, error: "Database error", message: error },
            { status: 500 }
        );
    }
};


export const GET = async () => {
    try {
        // Create table if not present
        ensureTable()
        // Fetch user
        const result = await pool.query(
            `SELECT * FROM jestlib."users"`
        );
        return NextResponse.json({
            data: result.rows,
            status: 200,
            message: "Successfully done",
        });
    } catch (error) {
        return NextResponse.json(
            { status: 500, error: "Database error", message: error },
            { status: 500 }
        );
    }
};