const express = require("express");
const path = require("path");
const fs = require("fs/promises");

const app = express();

app.use(express.json());

const jsonPath = path.resolve("./files/todos.json")

app.get("/tasks", async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, "utf8");
  res.send(jsonFile)
});

app.post("/tasks", async (req, res) => {
  const toDo = req.body;
  const toDoArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  const lastIndex = toDoArray.length - 1;
  const newId = toDoArray[lastIndex].id + 1;
  toDoArray.push({ ...toDo, id: newId });
  await fs.writeFile(jsonPath, JSON.stringify(toDoArray));
  res.end();
});

app.put("/tasks", async (req, res) => {
  const toDoArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  const { id, status } = req.body;
  const toDoIndex = toDoArray.findIndex(toDo => toDo.id === id);
  if(toDoIndex >= 0) {
    toDoArray[toDoIndex].status = status;
  }
  await fs.writeFile(jsonPath, JSON.stringify(toDoArray))
  res.end();
});

app.delete("/tasks", async (req, res) => {
  const toDoArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  const { id } = req.body;
  const toDoIndex = toDoArray.findIndex(toDo => toDo.id === id);
  toDoArray.splice(toDoIndex, 1);
  await fs.writeFile(jsonPath, JSON.stringify(toDoArray));
  res.end();
})

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
});