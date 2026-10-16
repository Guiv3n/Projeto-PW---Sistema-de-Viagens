import { db } from '../config/db.js';
import { pacotes, destinos } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Listar pacotes com JOIN trazendo o nome da cidade e do país de destinos
export const getPacotes = async (req, res) => {
  try {
    const lista = await db
      .select({
        id: pacotes.id,
        titulo: pacotes.titulo,
        preco: pacotes.preco,
        dataEmbarque: pacotes.dataEmbarque,
        vagas: pacotes.vagas,
        ativo: pacotes.ativo,
        destinoId: pacotes.destinoId,
        cidadeDestino: destinos.cidade,
        paisDestino: destinos.pais
      })
      .from(pacotes)
      .innerJoin(destinos, eq(pacotes.destinoId, destinos.id));

    return res.status(200).json(lista);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Buscar pacote por ID
export const getPacotePorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [pacote] = await db.select().from(pacotes).where(eq(pacotes.id, id));
    if (!pacote) {
      return res.status(404).json({ status: 'error', message: 'Pacote não encontrado' });
    }
    return res.status(200).json(pacote);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Inserir novo pacote
export const addPacote = async (req, res) => {
  try {
    const { titulo, preco, dataEmbarque, vagas, ativo, destinoId } = req.body;
    const [novoPacote] = await db.insert(pacotes).values({
      titulo,
      preco: String(preco),
      dataEmbarque,
      vagas: parseInt(vagas),
      ativo: Boolean(ativo),
      destinoId: parseInt(destinoId)
    }).returning();

    return res.status(201).json({ status: 'success', message: 'Pacote criado com sucesso', objeto: novoPacote });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Atualizar pacote existente
export const updatePacote = async (req, res) => {
  try {
    const { id, titulo, preco, dataEmbarque, vagas, ativo, destinoId } = req.body;
    const [pacoteAtualizado] = await db
      .update(pacotes)
      .set({
        titulo,
        preco: String(preco),
        dataEmbarque,
        vagas: parseInt(vagas),
        ativo: Boolean(ativo),
        destinoId: parseInt(destinoId)
      })
      .where(eq(pacotes.id, parseInt(id)))
      .returning();

    return res.status(200).json({ status: 'success', message: 'Pacote atualizado com sucesso', objeto: pacoteAtualizado });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// Remover pacote por ID
export const deletePacote = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(pacotes).where(eq(pacotes.id, id));
    return res.status(200).json({ status: 'success', message: 'Pacote removido com sucesso' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};