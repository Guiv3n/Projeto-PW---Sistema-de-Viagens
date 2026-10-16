import { db } from '../config/db.js';
import { destinos } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Listar todos os destinos
export const getDestinos = async (req, res) => {
  try {
    const lista = await db.select().from(destinos);
    return res.status(200).json(lista);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Buscar destino por ID
export const getDestinoPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [destino] = await db.select().from(destinos).where(eq(destinos.id, id));
    if (!destino) {
      return res.status(404).json({ status: 'error', message: 'Destino não encontrado' });
    }
    return res.status(200).json(destino);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Inserir novo destino
export const addDestino = async (req, res) => {
  try {
    const { cidade, pais, clima } = req.body;
    const [novoDestino] = await db.insert(destinos).values({ cidade, pais, clima }).returning();
    return res.status(201).json({ status: 'success', message: 'Destino criado com sucesso', objeto: novoDestino });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Atualizar destino existente
export const updateDestino = async (req, res) => {
  try {
    const { id, cidade, pais, clima } = req.body;
    const [destinoAtualizado] = await db
      .update(destinos)
      .set({ cidade, pais, clima })
      .where(eq(destinos.id, parseInt(id)))
      .returning();
    return res.status(200).json({ status: 'success', message: 'Destino atualizado com sucesso', objeto: destinoAtualizado });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Remover destino por ID
export const deleteDestino = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(destinos).where(eq(destinos.id, id));
    return res.status(200).json({ status: 'success', message: 'Destino removido com sucesso' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};