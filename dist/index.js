import express from "express";
import helmet from "helmet";
import { pool } from "./config/db.js";
import cors from "cors";
import { getAllPokemons, getPokemonByType, getPokemonById, createNewPokemon, updatePokemon, deletePokemon, getPokemonByName, } from "./controllers/pokemons/pokemons-controllers.js";
const app = express();
app.use(helmet({
    hidePoweredBy: true,
    frameguard: { action: "deny" },
    xssFilter: true,
    noSniff: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    referrerPolicy: { policy: "same-origin" },
}));
// Configuration CORS
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res
        .status(200)
        .json({ message: "Welcome to Pokemon Battle API 🔥💦⚡🌱 !!!" });
});
app.get("/test-db", async (req, res) => {
    console.log("Route /test-db hit");
    try {
        const result = await pool.query("SELECT NOW()");
        res.status(200).json({ dbTime: result.rows[0].now });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "DataBase Error" });
    }
});
//  READ
app.get("/pokemons", getAllPokemons);
app.get("/pokemons/types", getPokemonByType);
app.get("/pokemon/name", getPokemonByName);
app.get("/pokemon/:id", getPokemonById);
//CREATE
app.post("/pokemon", createNewPokemon);
// UPDATE
app.put("/pokemon/:id", updatePokemon);
//DELETE
app.delete("/pokemon/:id", deletePokemon);
app.all(/.*/, (req, res) => {
    res.status(404).json({ message: "No route found" });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(" Pokemon Battle API 🔥💦⚡🌱 is running!!!");
});
