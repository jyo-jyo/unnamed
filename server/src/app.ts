// import "dotenv/config";
import express from "express";
import Loader from "./loader";
import http from "http";

const PORT = 5000; // constant

const app = express();
const server = http.createServer(app);
app.set("port", PORT);

Loader({ server, app });

// app.use('/api', apiRouter);

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  console.log(bind);
}

server.listen(PORT);
server.on("listening", onListening);
