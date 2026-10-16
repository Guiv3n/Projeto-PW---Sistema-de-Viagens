import { Router } from 'express';
import { rotasDestinos } from './rotasDestinos.js';
import { rotasClientes } from './rotasClientes.js';
import { rotasPacotes } from './rotasPacotes.js';

const rotas = new Router();

rotas.use(rotasDestinos);
rotas.use(rotasClientes);
rotas.use(rotasPacotes);

export default rotas;