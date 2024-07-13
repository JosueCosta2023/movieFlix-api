import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.get("/movies", async (_, res) => {
  const movies = await prisma.movie.findMany({
    orderBy: {
      release_data: "desc",
    },
    include: {
      genres: true,
      languages: true,
    },
  });

  res.json(movies);
});

app.post("/movies", async (req, res) => {
  try {
    console.log(`Dados a serem cadastrados na api. ${req.body}`);
    const { title, release_data, genre_id, language_id, oscar } = req.body;

    await prisma.movie.create({
      data: {
        title,
        release_data: new Date(release_data),
        genre_id,
        language_id,
        oscar,
      },
    });

    res.status(201).send("Filme cadastrado com sucesso.");
  } catch (e) {
    res.status(500).send({ message: "Falha ao cadastrar um filme." + e });
  }
});

app.listen(port, () => {
  console.log("Servidor em execução");
});
