import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/docs-api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/movies", async (req, res) => {
  try {
    const { sort, language } = req.query;
    const languageName = language as string;

    let where = {};

    if (languageName) {
      where = {
        languages: {
          name: {
            equals: languageName,
            mode: "insensitive",
          },
        },
      };
    }

    let orderBy:
      | Prisma.MovieOrderByWithRelationInput
      | Prisma.MovieOrderByWithRelationInput[]
      | undefined;

    if (sort === "id") {
      orderBy = {
        id: "asc",
      };
    } else if (sort === "title") {
      orderBy = {
        title: "asc",
      };
    } else if (sort === "director_name") {
      orderBy = {
        director_name: "asc",
      };
    } else if (sort === "date_release") {
      orderBy = {
        date_release: "asc",
      };
    } else if (sort === "oscar") {
      orderBy = {
        oscar: "asc",
      };
    }

    const movies = await prisma.movie.findMany({
      orderBy,
      where: where,
      include: {
        genre: true,
        languages: true,
      },
    });

    const quantityFilm = movies.length;

    const averageDuration = Math.round(
      movies.reduce((acc, movie) => acc + movie.duration, 0) / quantityFilm
    );

    res.json({ quantityFilm, averageDuration, movies });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Falha ao listar filmes." });
  }
});
app.post("/movies", async (req, res) => {
  try {
    const {
      title,
      date_release,
      director_name,
      duration,
      oscar,
      language_id,
      genre_id,
    } = req.body;

    const movieWithSameTitle = await prisma.movie.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
    });

    if (movieWithSameTitle) {
      return res
        .status(409)
        .send({ message: "Já existe um filme cadastrado com este titulo." });
    }

    await prisma.movie.create({
      data: {
        title,
        date_release: new Date(date_release),
        director_name,
        duration,
        oscar,
        genre_id,
        language_id,
      },
    });

    res.status(201).send({ message: "Filme cadastrado com sucesso!" });
    
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Falha ao cadastrar filme." });
  }
});
app.put("/movies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const movieExist = await prisma.movie.findUnique({
      where: {
        id,
      },
    });

    if (!movieExist) {
      return res.status(404).send({ message: "Filme não encontrado." });
    }

    const newData = { ...req.body };

    //Ajuste e data de validade. Se houver data atualize, se não ignore.
    newData.date_release = newData.date_release
      ? new Date(newData.date_release)
      : undefined;

    await prisma.movie.update({
      where: {
        id,
      },
      data: newData,
    });
    res.status(200).send({ message: "Filme atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Falha ao atualizar filme" });
  }
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
      return res.status(404).send({ message: "Filme não cadastrado." });
    }

    await prisma.movie.delete({
      where: {
        id,
      },
    });
    res.status(200).send({ message: "Filme deletado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Falha ao deletar filme" });
  }
});

app.get("/genres", async (_, res) => {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: {
        name: "asc",
      },
    });
    if (!genres) {
      return res.status(404).send({ message: "Não há generos cadastrados" });
    }
    res.json(genres);

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Falha ao listar generos"});
  }
});
app.post("/genres", async (req, res) => {
  try {
    const { name } = req.body;

    const genreExist = await prisma.genre.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (genreExist) {
      return res.status(409).send({ message: "Genero já cadastrado" });
    }

    await prisma.genre.create({
      data: {
        name,
      },
    });
    res
      .status(200)
      .send({ message: "Cadastro de genero realizado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Falha ao cadastrar novo genero" });
  }
});
app.put("/genres/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    console.log(id);

    const genreExist = await prisma.genre.findUnique({
      where: {
        id,
      },
    });

    if (!genreExist) {
      return res.status(404).send({ message: "Genero não encontrado." });
    }

    const newData = { ...req.body };

    await prisma.genre.update({
      where: {
        id,
      },
      data: newData,
    });
    res.status(200).send({ message: "Genero atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Falha ao atualizar genero" });
  }
});
app.delete("/genres/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const genreExist = await prisma.genre.findUnique({
      where: {
        id,
      },
    });

    if (!genreExist) {
      return res.status(404).send({ message: "Genero não cadastrado." });
    }

    await prisma.genre.delete({
      where: {
        id,
      },
    });

    res.status(200).send({ message: "Genero excluído com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Falha ao deletar genero." });
  }
});

app.get("/languages", async (_, res) => {
  try {
    const data = await prisma.language.findMany({
      orderBy: {
        name: "asc",
      },
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Falha ao listar idiomas" });
  }
});
app.post("/languages", async (req, res) => {
  try {
    const { name } = req.body;

    const nameExist = await prisma.language.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (nameExist) {
      return res.status(409).send({ message: "Idioma já cadastrado." });
    }

    await prisma.language.create({
      data: {
        name,
      },
    });
    res.status(201).send({ message: "Idioma cadastrado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Falha ao cadastrar novo idioma." });
  }
});
app.put("/languages/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const languageExist = await prisma.language.findUnique({
      where: {
        id,
      },
    });

    if (!languageExist) {
      return res.status(404).send({ message: "Idioma não cadastrado." });
    }

    const newData = { ...req.body };

    await prisma.language.update({
      where: {
        id,
      },
      data: newData,
    });
    res.status(200).send({ message: "Idioma atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Falha ao atualizar idioma." });
  }
});
app.delete("/languages/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const languageExist = await prisma.language.findUnique({
      where: {
        id,
      },
    });

    if (!languageExist) {
      return res.status(404).send({ message: "Idioma não cadastrado." });
    }

    await prisma.language.delete({
      where: {
        id,
      },
    });

    res.status(200).send({ message: "Idioma removido com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Falha ao remover idioma." });
  }
});

// MIX DE FILTROS
app.get("/move/genre", async (req, res) => {
  try {
    const { genre } = req.query;
    const genreName = genre as string;

    let where = {};

    if (genreName) {
      where = {
        genre: {
          name: {
            equals: genreName,
            mode: "insensitive",
          },
        },
      };
    }

    const movies = await prisma.movie.findMany({
      where: where,
      include: {
        languages: true,
        genre: true,
      },
    });

    res.json(movies);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Falha ao buscar filme pelo genero informado" });
  }
});
app.get("/move/language", async (req, res) => {
  try {
    const { language } = req.query;
    const languageName = language as string;

    let where = {};
    if (languageName) {
      where = {
        languages: {
          name: {
            equals: languageName,
            mode: "insensitive",
          },
        },
      };
    }

    const movies = await prisma.movie.findMany({
      where: where,
      include: {
        languages: true,
        genre: true,
      },
    });

    res.json(movies);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Falha ao buscar filme com o idioma selecionado" });
  }
});

app.listen(port, () => {
  try {
    console.log("Server online");
  } catch (error) {
    console.error(error);
  }
});
