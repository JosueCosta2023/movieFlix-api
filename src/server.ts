import express from "express";
const port = 3000;
const app = express();

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/movies", (req, res) => {
  res.send("Listagem de filmes");
});


app.listen(port, () => {
  console.log("Servidor em execução");
});