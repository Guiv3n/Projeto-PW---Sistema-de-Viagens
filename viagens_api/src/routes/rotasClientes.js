import { Router } from 'express';
import {
  getClientes,
  getClientePorId,
  addCliente,
  updateCliente,
  deleteCliente
} from '../controllers/clienteController.js';

export const rotasClientes = new Router();

rotasClientes.route('/clientes')
  .get(getClientes)
  .post(addCliente)
  .put(updateCliente);

rotasClientes.route('/clientes/:id')
  .get(getClientePorId)
  .delete(deleteCliente);