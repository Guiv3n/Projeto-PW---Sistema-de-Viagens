import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Container, Alert } from 'react-bootstrap';
import { API_URL } from '../services/api';

interface Destino {
  id: number;
  cidade: string;
  pais: string;
  clima: string;
}

// Lista padronizada dos principais países (em ordem alfabética)
const LISTA_PAISES = [
  "África do Sul", "Alemanha", "Argentina", "Austrália", "Áustria", "Bélgica",
  "Bolívia", "Brasil", "Canadá", "Chile", "China", "Colômbia", "Coreia do Sul",
  "Costa Rica", "Croácia", "Cuba", "Dinamarca", "Egito", "Emirados Árabes Unidos",
  "Espanha", "Estados Unidos", "França", "Grécia", "Holanda", "Irlanda",
  "Itália", "Japão", "México", "Noruega", "Nova Zelândia", "Paraguai",
  "Peru", "Portugal", "Reino Unido", "República Tcheca", "Suíça", "Turquia", "Uruguai"
];

// Categorias climáticas pré-definidas
const LISTA_CLIMAS = [
  "Tropical",
  "Subtropical",
  "Temperado",
  "Mediterrâneo",
  "Semiárido",
  "Árido / Desértico",
  "Frio / Polar"
];

export const Destinos = () => {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [alerta, setAlerta] = useState<{ tipo: string; texto: string } | null>(null);

  const [form, setForm] = useState({
    id: 0,
    cidade: '',
    pais: LISTA_PAISES[0],
    clima: LISTA_CLIMAS[0]
  });

  const carregarDestinos = async () => {
    try {
      const res = await fetch(`${API_URL}/destinos`);
      const dados = await res.json();
      setDestinos(dados);
    } catch {
      setAlerta({ tipo: 'danger', texto: 'Erro ao carregar destinos do servidor.' });
    }
  };

  useEffect(() => {
    carregarDestinos();
  }, []);

  const abrirModalNovo = () => {
    setEditando(false);
    setForm({
      id: 0,
      cidade: '',
      pais: 'Brasil',
      clima: 'Tropical'
    });
    setShowModal(true);
  };

  const abrirModalEditar = (item: Destino) => {
    setEditando(true);
    setForm(item);
    setShowModal(true);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const metodo = editando ? 'PUT' : 'POST';

    try {
      const res = await fetch(`${API_URL}/destinos`, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Falha na operação');

      setShowModal(false);
      setAlerta({ tipo: 'success', texto: `Destino ${editando ? 'atualizado' : 'cadastrado'} com sucesso!` });
      carregarDestinos();
    } catch {
      setAlerta({ tipo: 'danger', texto: 'Erro ao salvar destino.' });
    }
  };

  const excluir = async (id: number) => {
    if (!window.confirm('Tem a certeza de que deseja remover este destino?')) return;

    try {
      const res = await fetch(`${API_URL}/destinos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir');

      setAlerta({ tipo: 'success', texto: 'Destino removido com sucesso!' });
      carregarDestinos();
    } catch {
      setAlerta({ tipo: 'danger', texto: 'Erro ao excluir destino.' });
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gerenciamento de Destinos</h2>
        <Button variant="primary" onClick={abrirModalNovo}>
          <i className="bi bi-plus-circle me-1"></i> Novo Destino
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
            <th>Cidade</th>
            <th>País</th>
            <th>Clima</th>
            <th style={{ width: '150px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {destinos.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.cidade}</td>
              <td>{d.pais}</td>
              <td>{d.clima}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => abrirModalEditar(d)}>
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button variant="danger" size="sm" onClick={() => excluir(d.id)}>
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
          {destinos.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center">Nenhum destino cadastrado.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={salvar}>
          <Modal.Header closeButton>
            <Modal.Title>{editando ? 'Editar Destino' : 'Novo Destino'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                type="text"
                required
                value={form.cidade}
                onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                placeholder="Ex: Rio de Janeiro, Tóquio, Roma..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>País</Form.Label>
              <Form.Select
                required
                value={form.pais}
                onChange={(e) => setForm({ ...form, pais: e.target.value })}
              >
                {LISTA_PAISES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Clima</Form.Label>
              <Form.Select
                required
                value={form.clima}
                onChange={(e) => setForm({ ...form, clima: e.target.value })}
              >
                {LISTA_CLIMAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
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