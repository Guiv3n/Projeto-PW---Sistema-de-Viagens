import { Router } from 'express';
import {
  getDestinos,
  getDestinoPorId,
  addDestino,
  updateDestino,
  deleteDestino
} from '../controllers/destinoController.js';

export const rotasDestinos = new Router();

rotasDestinos.route('/destinos')
  .get(getDestinos)
  .post(addDestino)
  .put(updateDestino);

rotasDestinos.route('/destinos/:id')
  .get(getDestinoPorId)
  .delete(deleteDestino);