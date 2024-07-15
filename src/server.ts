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
    const { title, release_data, genre_id, language_id, oscar } = req.body;

    // Validação de exitencia do filme
    const movieWithSameTitle = await prisma.movie.findFirst({
      where: {
        title: {
          equals: title, mode: "insensitive"
        }
      }
    });

    if (movieWithSameTitle) {
      res.status(409).send({message: "Já existe um filme cadastrado com este titulo."});
      return;
    }

    await prisma.movie.create({
      data: {
        title,
        release_data: new Date(release_data),
        genre_id,
        language_id,
        oscar,
      },
    });

    res.status(200);
    res.send("Filme cadastrado com sucesso.");
    
  } catch (e) {
    res.status(500).send({ message: "Falha ao cadastrar um filme." + e });
  }
});

app.listen(port, () => {
  console.log("Servidor em execução");
});
