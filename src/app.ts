import express from "express";

const app = express();
app.use(express.json()); // permite receber JSON no corpo da requisição.

export { app };
