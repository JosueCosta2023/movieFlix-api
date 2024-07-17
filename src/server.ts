import express from "express";
import { PrismaClient } from "@prisma/client";
import swaggerui from "swagger-ui-express";
import swaggerDocument from "../swagger.json";


const port = 3000;
const app = express();
const prisma = new PrismaClient();
app.use(express.json());


app.use("/docs", swaggerui.serve, swaggerui.setup(swaggerDocument));


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
          equals: title,
          mode: "insensitive",
        },
      },
    });

    if (movieWithSameTitle) {
      res
        .status(409)
        .send({ message: "Já existe um filme cadastrado com este titulo." });
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

app.put("/movies/:id", async (req, res) => {
  try {
    // pegar o id do filme
    const id = Number(req.params.id);

    // Validar existencia do cadastro.
    const movieExist = await prisma.movie.findUnique({
      where: {
        id,
      },
    });

    if (!movieExist) {
      return res.status(404).send({ message: "Filme não encontrado!" });
    }

    //Para atualizar qualquer informação do cadastro, precisaremos
    // aplicar o spreed para que qualquer informação que venha seja adicionada no objeto do banco.
    const data = { ...req.body };
    data.release_data = data.release_data
      ? new Date(data.release_data)
      : undefined;

    //buscar os dados do id
    await prisma.movie.update({
      where: {
        id,
      },
      data: data,
    });
  } catch (e) {
    res
      .status(500)
      .send({ message: "Falha ao atualizar registro do filme: " + e });
  }

  res.status(200).send("Filme atualizado com sucesso.");
});

app.delete("/movies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const movieExist = await prisma.movie.findUnique({
      where: {
        id,
      },
    });

    if (!movieExist) {
      return res.status(404).send({
        message: "Este filme não esta cadastrado em nossa base de dados.",
      });
    }

    await prisma.movie.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Falha ao remover um filme." });
  }

  res.status(200).send({ message: "Filmes deletado com sucesso." });
});

app.get("/movies/:genreName", async (req, res) => {
  try {
    //Receber o nome do genero pelo params
    // Filtrar os filmes do banco pelo genero.
    const moviesFilteredByName = await prisma.movie.findMany({
      include: {
        genres: true,
        languages: true,
      },
      where: {
        genres: {
          name: {
            equals: req.params.genreName,
            mode: "insensitive",
          },
        },
      },
    });

    // Retornar filmes filtrados na resposta.
    res.status(200).send(moviesFilteredByName);
  } catch (error) {
    res.status(500).send({ message: "Falha ao filtrar filmes." });
  }
});

app.listen(port, () => {
  console.log("Servidor em execução");
});
