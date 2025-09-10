import { getAllPokemons, getPokemonById, getPokemonByType, } from "./pokemons-controllers.js";
import { pool } from "../../config/db.js";
describe("getAllPokemons routes test", () => {
    test("getAllpokemons resquest should be defined", () => {
        expect(getAllPokemons).toBeDefined();
    });
    test("getAllPokemons should have a response status 200", async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        await getAllPokemons(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    });
    test("get AllPokemons should return 500 and call json with error when DB is down", async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.spyOn(pool, "query").mockRejectedValue(new Error("DB down"));
        await getAllPokemons(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database Error" });
    });
    test("getPokemonByType should return a Pokemon Arrays with good request", async () => {
        const req = {
            query: { type: ["fire", "water"] },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.spyOn(pool, "query").mockResolvedValue({ rows: [] });
        await getPokemonByType(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: [] });
    });
    test("getPokemonByType should return a status 500 if BDD/API down", async () => {
        const req = {
            query: { type: ["fire", "water"] },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.spyOn(pool, "query").mockRejectedValue(new Error(" API Down"));
        await getPokemonByType(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database Error" });
    });
});
describe("getSpecificsPokemon routes test", () => {
    test("getPokemonById should return a Pokemon array when request is good", async () => {
        const req = {
            params: { id: "1" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.spyOn(pool, "query").mockResolvedValue({
            rows: [
                {
                    name: "Pikachu",
                    type: "electrick",
                    hp: 35,
                    att: 55,
                    def: 40,
                },
            ],
        });
        await getPokemonById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        // 🔹 Ici, on vérifie juste le tableau renvoyé
        expect(res.json).toHaveBeenCalledWith({
            message: [
                {
                    name: "Pikachu",
                    type: "electrick",
                    hp: 35,
                    att: 55,
                    def: 40,
                },
            ],
        });
    });
});
