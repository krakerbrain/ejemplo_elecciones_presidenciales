const http = require("http");
const url = require("url");
const fs = require("fs");
const { guardarCandidato, getCandidatos, eliminarCandidato, editCandidato, registrarVotos, getHistorial } = require("./conexion");

http
  .createServer((req, res) => {
    if (req.url == "/" && req.method == "GET") {
      fs.readFile("index.html", (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end();
        } else {
          res.setHeader("Content-type", "text/html");
          res.end(data);
        }
      });
    }

    if (req.url == "/candidato" && req.method == "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        const candidato = JSON.parse(body);
        const result = await guardarCandidato(candidato);
        console.log(result);
        res.end(JSON.stringify(result));
      });
    }

    if (req.url == "/candidatos" && req.method == "GET") {
      (async () => {
        const candidatos = await getCandidatos();
        res.end(JSON.stringify(candidatos));
      })();
    }

    if (req.url.startsWith("/candidato?id") && req.method == "DELETE") {
      (async () => {
        let { id } = url.parse(req.url, true).query;
        await eliminarCandidato(id);
        res.end("Candidato eliminado");
      })();
    }

    if (req.url == "/candidato" && req.method == "PUT") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        const candidato = JSON.parse(body);
        console.log(candidato);
        const result = await editCandidato(candidato);
        res.end(JSON.stringify(result));
      });
    }

    if (req.url == "/votos" && req.method == "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        const voto = JSON.parse(body);
        const result = await registrarVotos(voto);
        if (result) {
          res.statusCode = 201;
          res.end(JSON.stringify(result));
        } else {
          res.statusCode = 500;
          res.end("");
        }
      });
    }

    if (req.url == "/historial" && req.method == "GET") {
      (async () => {
        const historial = await getHistorial();
        res.end(JSON.stringify(historial));
      })();
    }
  })
  .listen(3000, console.log("Servidor ON"));
