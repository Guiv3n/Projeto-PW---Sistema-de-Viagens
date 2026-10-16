import { Router } from 'express';
import {
  getPacotes,
  getPacotePorId,
  addPacote,
  updatePacote,
  deletePacote
} from '../controllers/pacoteController.js';

export const rotasPacotes = new Router();

rotasPacotes.route('/pacotes')
  .get(getPacotes)
  .post(addPacote)
  .put(updatePacote);

rotasPacotes.route('/pacotes/:id')
  .get(getPacotePorId)
  .delete(deletePacote);