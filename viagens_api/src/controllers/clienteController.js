import { db } from '../config/db.js';
import { clientes } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Listar todos os clientes
export const getClientes = async (req, res) => {
  try {
    const lista = await db.select().from(clientes);
    return res.status(200).json(lista);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Buscar cliente por ID
export const getClientePorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [cliente] = await db.select().from(clientes).where(eq(clientes.id, id));
    if (!cliente) {
      return res.status(404).json({ status: 'error', message: 'Cliente não encontrado' });
    }
    return res.status(200).json(cliente);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Cadastrar cliente
export const addCliente = async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    const [novoCliente] = await db.insert(clientes).values({ nome, email, telefone }).returning();
    return res.status(201).json({ status: 'success', message: 'Cliente cadastrado com sucesso', objeto: novoCliente });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Atualizar cliente
export const updateCliente = async (req, res) => {
  try {
    const { id, nome, email, telefone } = req.body;
    const [clienteAtualizado] = await db
      .update(clientes)
      .set({ nome, email, telefone })
      .where(eq(clientes.id, parseInt(id)))
      .returning();
    return res.status(200).json({ status: 'success', message: 'Cliente atualizado com sucesso', objeto: clienteAtualizado });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Remover cliente
export const deleteCliente = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(clientes).where(eq(clientes.id, id));
    return res.status(200).json({ status: 'success', message: 'Cliente removido com sucesso' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};