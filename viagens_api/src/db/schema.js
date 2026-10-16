// Onde o Drizzle mapeia as tabelas do PostgreSQL

import { pgTable, serial, varchar, numeric, integer, boolean, date } from 'drizzle-orm/pg-core';

// 1. Tabela de Destinos
export const destinos = pgTable('destinos', {
  id: serial('id').primaryKey(),
  cidade: varchar('cidade', { length: 100 }).notNull(),
  pais: varchar('pais', { length: 60 }).notNull(),
  clima: varchar('clima', { length: 30 })
});

// 2. Tabela de Clientes
export const clientes = pgTable('clientes', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  telefone: varchar('telefone', { length: 20 })
});

// 3. Tabela de Pacotes (com Foreign Key a apontar para destinos)
export const pacotes = pgTable('pacotes', {
  id: serial('id').primaryKey(),
  titulo: varchar('titulo', { length: 120 }).notNull(),
  preco: numeric('preco', { precision: 10, scale: 2 }).notNull(),
  dataEmbarque: date('data_embarque').notNull(),
  vagas: integer('vagas').notNull(),
  ativo: boolean('ativo').default(true).notNull(),
  destinoId: integer('destino_id')
    .notNull()
    .references(() => destinos.id, { onDelete: 'cascade' })
});