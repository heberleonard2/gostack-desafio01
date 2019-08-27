const express = require("express");

const server = express();

server.use(express.json());
let contagemrequisicoes = 0;
const projetos = [];

function checkArrayEmpty(req, res, next) {
  if (projetos.length == 0) {
    return res.status(400).json({ message: "Não existe nenhum projeto ainda" });
  }
  return next();
}

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projetos.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}
function checkTitleExists(req, res, next) {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title not found" });
  }

  return next();
}
function checkIdExists(req, res, next) {
  const { id } = req.body;
  const project = projetos.find(p => p.id == id);

  if (project) {
    return res.status(400).json({ error: "Id ja existe" });
  }

  return next();
}
function CountRequests(req, res, next) {
  contagemrequisicoes++;

  console.log(`Número de Requisições: ${contagemrequisicoes}`);
  return next();
}
server.use(CountRequests);
server.get("/projects", checkArrayEmpty, (req, res) => {
  return res.json(projetos);
});
server.post("/projects", checkIdExists, checkTitleExists, (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projetos.push(project);
  return res.json(project);
});
server.put(
  "/projects/:id",
  checkProjectExists,
  checkTitleExists,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const project = projetos.find(p => p.id == id);

    project.title = title;

    return res.json(project);
  }
);
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projetos.findIndex(p => p.id == id);

  projetos.splice(projectIndex, 1);

  return res.send();
});
server.post(
  "/projects/:id/tasks",
  checkProjectExists,
  checkTitleExists,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const project = projetos.find(p => p.id == id);
    project.tasks.push(title);

    return res.json(project);
  }
);

server.listen(3333);
