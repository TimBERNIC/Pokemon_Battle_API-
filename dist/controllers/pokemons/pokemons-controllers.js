import { pool } from "../../config/db.js";
export const getAllPokemons = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM pokemons");
        res.status(200).json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: "Database Error" });
    }
};
export const getPokemonByType = async (req, res) => {
    try {
        const type = req.query.type;
        const result = await pool.query("SELECT * FROM pokemons WHERE type = $1 UNION SELECT * FROM pokemons WHERE type = $2", [type[0], type[1]]);
        res.status(200).json({ message: result.rows });
    }
    catch (error) {
        res.status(500).json({ error: "Database Error" });
    }
};
export const getPokemonById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT * FROM pokemons WHERE id = $1`, [
            id,
        ]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "no pokemon found" });
            return;
        }
        res.status(200).json({ message: result.rows });
    }
    catch (error) {
        res.status(500).json({ error: "Database Error" });
    }
};
export const createNewPokemon = async (req, res) => {
    try {
        const { name, type, hp, att, def } = req.body;
        // recherche si existant
        const foundPokemon = await pool.query(`SELECT * FROM pokemons WHERE name = $1`, [name]);
        if (foundPokemon.rows.length > 0) {
            return res.status(400).json({ message: name + " already exist" });
        }
        const result = await pool.query("INSERT INTO pokemons (name, type, hp, att, def) VALUES ($1, $2, $3, $4, $5)", [name, type, hp, att, def]);
        res
            .status(201)
            .json({ message: "pokemon created", pokemon: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ error: "Error since creation process" });
    }
};
export const updatePokemon = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, hp, att, def } = req.body;
        const result = await pool.query("UPDATE pokemons SET name=$1, type=$2, hp=$3, att=$4, def=$5 WHERE id=$6  RETURNING *", [name, type, hp, att, def, id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "cannot delete : pokemon not found" });
            return;
        }
        res
            .status(200)
            .json({ message: "pokemon updated", pokemon: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deletePokemon = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM pokemons WHERE id=$1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "cannot delete : pokemon not found" });
            return;
        }
        res.status(200).json({ message: "pokemon deleted" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
