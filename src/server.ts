import express from "express";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/docs-api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/movies", async (req, res) => {
  try {
    const moviesCount = await prisma.movie.count();

    const movies = await prisma.movie.findMany({
      orderBy: {
        title: "asc",
      },
      include: {
        genre: true,
        languages: true,
      },
    });

    res.json(movies);
  } catch (error) {
    return res.status(500).send({ message: "Falha ao listar filmes." });
  }
});

app.listen(port, () => {
  console.log("Server online");
});
