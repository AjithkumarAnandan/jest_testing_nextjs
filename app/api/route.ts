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

export const PUT = async (req: Request) => {
    try {
        const { id, name } = await req.json();

        if (!id || !name) {
            return NextResponse.json({
                status: 400,
                message: "id and name are required",
            });
        }

        await ensureTable();

        const findExisted = await pool.query(
            `SELECT * FROM jestlib."users" WHERE id = $1`,
            [id]
        );

        if (findExisted.rows.length === 0) {
            return NextResponse.json({
                status: 404,
                message: "User not found",
            });
        }

        await pool.query(
            `UPDATE jestlib."users" SET name = $1 WHERE id = $2`,
            [name, id]
        );

        return NextResponse.json({
            status: 201,
            message: "Updated successfully",
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            status: 500,
            message: "Something went wrong",
        });
    }
};

export const DELETE = async (req: Request) => {
    const { id } = await req.json();
    try {

        if (!id) {
            return NextResponse.json({
                status: 400,
                message: "id is required",
            });
        }

        await ensureTable();

        const findExisted = await pool.query(
            `SELECT * FROM jestlib."users" WHERE id = $1`,
            [id]
        );

        if (findExisted.rows.length === 0) {
            return NextResponse.json({
                status: 404,
                message: "User not found",
            });
        }

        await pool.query(
            `DELETE FROM jestlib."users" WHERE id = $1`,
            [id]
        );

        return NextResponse.json({
            status: 201,
            message: "Deleted successfully",
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            status: 500,
            message: "Something went wrong",
        });
    }
};