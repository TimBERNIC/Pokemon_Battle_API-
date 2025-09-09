import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import { REPLCommand } from "repl";
dotenv.config();
const app = express();

app.use(express.json());

//Configurer postgre

const pool = new Pool({
  user: process.env.POSTGRE_USER,
  host: "localhost",
  database: process.env.POSTGRE_DATABASE,
  password: process.env.POSTGRE_PASSWORD,
  port: 5432,
});

interface pokemon {
  name: string;
  type: string;
  hp: number;
  att: number;
  def: number;
}

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "Welcome to Pokemon Battle API 🔥💦⚡🌱 !!!" });
});

app.get("/test-db", async (req: Request, res: Response) => {
  console.log("Route /test-db hit");
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({ dbTime: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DataBase Error" });
  }
});

//  READ

app.get("/pokemons", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM pokemons");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database Error" });
  }
});

app.get("/pokemon/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const result = await pool.query(`SELECT * FROM pokemons WHERE id = $1`, [
      id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "no pokemon found" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database Error" });
  }
});

//CREATE

app.post("/pokemon", async (req: Request, res: Response) => {
  try {
    const { name, type, hp, att, def }: pokemon = req.body;
    // recherche si existant
    const foundPokemon = await pool.query(
      `SELECT * FROM pokemons WHERE name = $1 RETURNING *`,
      [name]
    );

    if (foundPokemon.rows.length > 0) {
      return res.status(400).json({ message: name + " already exist" });
    }

    const result = await pool.query(
      "INSERT INTO pokemons (name, type, hp, att, def) VALUES ($1, $2, $3, $4, $5)",
      [name, type, hp, att, def]
    );

    res.status(201).json({ message: result + "created" });
  } catch (error) {
    res.status(500).json({ error: "Error since creation process" });
  }
});

// UPDATE

app.put("/pokemon/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { name, type, hp, att, def }: pokemon = req.body;
    const result = await pool.query(
      "UPDATE pokemons SET name=$1, type=$2, hp=$3, att=$4, def=$5 WHERE id=$6  RETURNING *",
      [name, type, hp, att, def, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "cannot delete : pokemon not found" });
    }
    res.status(200).json({ message: "pokemon updated" + result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//DELETE

app.delete("/pokemon/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM pokemons WHERE id=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "cannot delete : pokemon not found" });
    }
    res.status(200).json({ message: "pokemon deleted" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
app.all(/.*/, (req: Request, res: Response) => {
  res.status(404).json({ message: "No route found" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(" Pokemon Battle API 🔥💦⚡🌱 is running!!!");
});
