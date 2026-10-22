import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Container, Alert } from 'react-bootstrap';
import { API_URL } from '../services/api';
import { validarNomeCompleto, validarEmail, mascaraTelefoneBR, validarTelefone } from '../utils/validacoes';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

export const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [alerta, setAlerta] = useState<{ tipo: string; texto: string } | null>(null);

  const [form, setForm] = useState({
    id: 0,
    nome: '',
    email: '',
    telefone: ''
  });

  const [erros, setErros] = useState({
    nome: '',
    email: '',
    telefone: ''
  });

  const carregarClientes = async () => {
    try {
      const res = await fetch(`${API_URL}/clientes`);
      const dados = await res.json();
      setClientes(dados);
    } catch {
      setAlerta({ tipo: 'danger', texto: 'Erro ao carregar clientes do servidor.' });
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const abrirModalNovo = () => {
    setEditando(false);
    setForm({ id: 0, nome: '', email: '', telefone: '' });
    setErros({ nome: '', email: '', telefone: '' });
    setShowModal(true);
  };

  const abrirModalEditar = (item: Cliente) => {
    setEditando(true);
    setForm(item);
    setErros({ nome: '', email: '', telefone: '' });
    setShowModal(true);
  };

  const validarFormulario = (): boolean => {
    const novosErros = { nome: '', email: '', telefone: '' };
    let valido = true;

    if (!validarNomeCompleto(form.nome)) {
      novosErros.nome = 'Informe nome e sobrenome (mínimo 3 letras cada).';
      valido = false;
    }

    if (!validarEmail(form.email)) {
      novosErros.email = 'Informe um email válido (exemplo: usuario@email.com).';
      valido = false;
    }

    if (!validarTelefone(form.telefone)) {
      novosErros.telefone = 'Informe um telefone válido com DDD (10 ou 11 dígitos).';
      valido = false;
    }

    setErros(novosErros);
    return valido;
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const metodo = editando ? 'PUT' : 'POST';

    try {
      const res = await fetch(`${API_URL}/clientes`, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Falha na operação');

      setShowModal(false);
      setAlerta({ tipo: 'success', texto: `Cliente ${editando ? 'atualizado' : 'cadastrado'} com sucesso!` });
      carregarClientes();
    } catch {
      setAlerta({ tipo: 'danger', texto: 'Erro ao salvar cliente.' });
    }
  };

  const excluir = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja remover este cliente?')) return;

    try {
      const res = await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir');

      setAlerta({ tipo: 'success', texto: 'Cliente removido com sucesso!' });
      carregarClientes();
    } catch {
      setAlerta({ tipo: 'danger', texto: 'Erro ao excluir cliente.' });
    }
  };

  return (
    <Container>
      <div className="content-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="page-title">Gestão de Clientes</h2>
          <Button variant="primary" onClick={abrirModalNovo}>
            <i className="bi bi-person-plus me-1"></i> Novo Cliente
          </Button>
        </div>

        {alerta && (
          <Alert variant={alerta.tipo} dismissible onClose={() => setAlerta(null)}>
            {alerta.texto}
          </Alert>
        )}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th style={{ width: '150px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.email}</td>
                <td>{c.telefone}</td>
                <td>
                  <Button variant="light" size="sm" className="btn-action-edit" onClick={() => abrirModalEditar(c)}>
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button variant="light" size="sm" className="btn-action-delete" onClick={() => excluir(c.id)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">Nenhum cliente cadastrado.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={salvar} noValidate>
          <Modal.Header closeButton>
            <Modal.Title>{editando ? 'Editar Cliente' : 'Novo Cliente'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome Completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: João da Silva"
                value={form.nome}
                isInvalid={!!erros.nome}
                onChange={(e) => {
                  setForm({ ...form, nome: e.target.value });
                  if (erros.nome) setErros({ ...erros, nome: '' });
                }}
              />
              <Form.Control.Feedback type="invalid">
                {erros.nome}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ex: joao.silva@exemplo.com"
                value={form.email}
                isInvalid={!!erros.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (erros.email) setErros({ ...erros, email: '' });
                }}
              />
              <Form.Control.Feedback type="invalid">
                {erros.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefone / WhatsApp</Form.Label>
              <Form.Control
                type="text"
                placeholder="(54) 99172-2982"
                value={form.telefone}
                isInvalid={!!erros.telefone}
                onChange={(e) => {
                  const formatado = mascaraTelefoneBR(e.target.value);
                  setForm({ ...form, telefone: formatado });
                  if (erros.telefone) setErros({ ...erros, telefone: '' });
                }}
              />
              <Form.Control.Feedback type="invalid">
                {erros.telefone}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};