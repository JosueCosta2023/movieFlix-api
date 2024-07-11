import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.get("/", async (req, res) => {
  const movies = await prisma.movie.findMany();
  res.json(movies);
});

app.get("/movies", (req, res) => {
  res.send("Listagem de filmes");
});

app.listen(port, () => {
  console.log("Servidor em execução");
});
