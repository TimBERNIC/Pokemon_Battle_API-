import {
  getAllPokemons,
  getPokemonById,
  getPokemonByType,
  createNewPokemon,
  updatePokemon,
  deletePokemon,
  getPokemonByName,
} from "./pokemons-controllers.js";
import type { Request, Response } from "express";
import { pool } from "../../config/db.js";

describe("getAllPokemons routes test", () => {
  test("getAllpokemons resquest should be defined", () => {
    expect(getAllPokemons).toBeDefined();
  });
  test("getAllPokemons should have a response status 200", async () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    await getAllPokemons(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("getAllPokemons should return 500 and call json with error when DB is down", async () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockRejectedValue(new Error("DB down"));

    await getAllPokemons(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database Error" });
  });
  test("getPokemonByName should return a Pokemon array when request is good", async () => {
    const req = {
      query: { name: "pikachu" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockResolvedValue({ rows: [] });

    await getPokemonByName(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: [] });
  });
  test("getPokemonByName should return a status 400 when name parameter is missing", async () => {
    const req = {
      query: { name: "" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockResolvedValue({ rows: [] });
    await getPokemonByName(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing name parameter" });
  });

  test("getPokemonByName should return s status 500 when server down", async () => {
    const req = {
      query: { name: "pikachu" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockRejectedValue(new Error(" API Down"));

    await getPokemonByName(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database Error" });
  });
  test("getPokemonByType should return a Pokemon Arrays with good request", async () => {
    const req = {
      query: { type: ["fire", "water"] },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockResolvedValue({ rows: [] });

    await getPokemonByType(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: [] });
  });
  test("getPokemonByType should return a status 500 if BDD/API down", async () => {
    const req = {
      query: { type: ["fire", "water"] },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockRejectedValue(new Error(" API Down"));

    await getPokemonByType(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database Error" });
  });
});

describe("getSpecificsPokemon routes test", () => {
  test("getPokemonById should return a Pokemon array when request is good", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockResolvedValue({
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
  test("getPokemonById should return status 404 when pokemon doesnt exist", async () => {
    const req = {
      params: { id: "1665498" },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockResolvedValue({ rows: [] });

    await getPokemonById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({ message: "no pokemon found" });
  });
  test("getPokemonById should return status 500 when API down", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockRejectedValue(new Error(" API Down"));

    await getPokemonById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({ error: "Database Error" });
  });
});

describe("create Pokemon route test", () => {
  test("createNewPokemon return status 201", async () => {
    const req = {
      body: {
        name: "Dracaufeu",
        type: "fire",
        hp: 150,
        att: 130,
        def: 110,
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest
      .spyOn(pool, "query" as any)
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            name: "Dracaufeu",
            type: "fire",
            hp: 150,
            att: 130,
            def: 110,
          },
        ],
      });

    await createNewPokemon(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "pokemon created",
      pokemon: {
        name: "Dracaufeu",
        type: "fire",
        hp: 150,
        att: 130,
        def: 110,
      },
    });
  });
  test("createNewPokemon return status 400 when pokemon name already exist", async () => {
    const req = {
      body: {
        name: "Dracaufeu",
        type: "fire",
        hp: 150,
        att: 130,
        def: 110,
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockResolvedValue({
      rows: [
        {
          name: "Dracaufeu",
          type: "fire",
          hp: 150,
          att: 130,
          def: 110,
        },
      ],
    });

    await createNewPokemon(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Dracaufeu already exist",
    });
  });

  test("createNewPokemon return status 500 when server down", async () => {
    const req = {
      body: {
        name: "Dracaufeu",
        type: "fire",
        hp: 150,
        att: 130,
        def: 110,
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest
      .spyOn(pool, "query" as any)
      .mockRejectedValue(new Error("DataBase Error"));

    await createNewPokemon(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error since creation process",
    });
  });
});

describe("update Pokemon route test", () => {
  test("updatePokemon return Status 200", async () => {
    const req = {
      params: { id: "1" },
      body: {
        name: "Pikachu",
        type: "stone",
        hp: 35,
        att: 55,
        def: 40,
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockResolvedValue({
      rows: [
        {
          name: "Pikachu",
          type: "stone",
          hp: 35,
          att: 55,
          def: 40,
        },
      ],
    });

    await updatePokemon(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "pokemon updated",
      pokemon: {
        name: "Pikachu",
        type: "stone",
        hp: 35,
        att: 55,
        def: 40,
      },
    });
  });
  test("updatePokemon return Status 404 if pokemon not found", async () => {
    const req = {
      params: { id: "165461" },
      body: {
        name: "Pikachu",
        type: "stone",
        hp: 35,
        att: 55,
        def: 40,
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockResolvedValue({ rows: [] });

    await updatePokemon(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "cannot delete : pokemon not found",
    });
  });
  test("updatePokemon return status 500 if server not available", async () => {
    const req = {
      params: { id: "1" },
      body: {
        name: "Pikachu",
        type: "stone",
        hp: 35,
        att: 55,
        def: 40,
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest
      .spyOn(pool, "query" as any)
      .mockRejectedValue(new Error("DataBase or API Error"));

    await updatePokemon(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DataBase or API Error" });
  });
});

describe("delete Pokemon route test", () => {
  test("deletePokemon should return status 200", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockResolvedValue({
      rows: [
        { id: "1", name: "Pikachu", type: "stone", hp: 35, att: 55, def: 40 },
      ],
    });

    await deletePokemon(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "pokemon deleted" });
  });

  test("deletePokemon return status 404 if pokemon not found", async () => {
    const req = {
      params: { id: "1651651" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pool, "query" as any).mockResolvedValue({
      rows: [],
    });
    await deletePokemon(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "cannot delete : pokemon not found",
    });
  });

  test("detelePokemon resturn status 500 server down", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest
      .spyOn(pool, "query" as any)
      .mockRejectedValue(new Error("DataBase Error"));

    await deletePokemon(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "DataBase Error",
    });
  });
});
