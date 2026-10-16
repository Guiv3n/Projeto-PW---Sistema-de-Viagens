import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rotas from './routes/rotas.js';

dotenv.config();

const app = express();
const porta = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Permite chamadas de qualquer origem local
app.use(cors({ origin: '*' }));

app.use(rotas);

app.listen(porta, () => {
  console.log(`Servidor rodando em: http://localhost:${porta}`);
});