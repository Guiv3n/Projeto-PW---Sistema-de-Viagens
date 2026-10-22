import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Container, Alert, Badge } from 'react-bootstrap';
import { API_URL } from '../services/api';
import { 
  validarTituloPacote, 
  validarPreco, 
  validarDataEmbarque, 
  validarVagas, 
  obterDataMinimaHoje 
} from '../utils/validacoes';

interface Pacote {
  id: number;
  titulo: string;
  preco: string;
  dataEmbarque: string;
  vagas: number;
  ativo: boolean;
  destinoId: number;
  cidadeDestino?: string;
  paisDestino?: string;
}

interface DestinoOption {
  id: number;
  cidade: string;
  pais: string;
}

export const Pacotes = () => {
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [destinos, setDestinos] = useState<DestinoOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [alerta, setAlerta] = useState<{ tipo: string; texto: string } | null>(null);

  const [form, setForm] = useState({
    id: 0,
    titulo: '',
    preco: '',
    dataEmbarque: '',
    vagas: 1,
    ativo: true,
    destinoId: ''
  });

  const [erros, setErros] = useState({
    titulo: '',
    preco: '',
    dataEmbarque: '',
    vagas: '',
    destinoId: ''
  });

  const carregarDados = async () => {
    try {
      const [resPacotes, resDestinos] = await Promise.all([
        fetch(`${API_URL}/pacotes`),
        fetch(`${API_URL}/destinos`)
      ]);
      const dadosPacotes = await resPacotes.json();
      const dadosDestinos = await resDestinos.json();
      setPacotes(dadosPacotes);
      setDestinos(dadosDestinos);
    } catch {
      setAlerta({ tipo: 'danger', texto: 'Erro ao carregar dados do servidor.' });
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const abrirModalNovo = () => {
    setEditando(false);
    setForm({
      id: 0,
      titulo: '',
      preco: '',
      dataEmbarque: obterDataMinimaHoje(),
      vagas: 1,
      ativo: true,
      destinoId: destinos.length > 0 ? String(destinos[0].id) : ''
    });
    setErros({ titulo: '', preco: '', dataEmbarque: '', vagas: '', destinoId: '' });
    setShowModal(true);
  };

  const abrirModalEditar = (item: Pacote) => {
    setEditando(true);
    setForm({
      id: item.id,
      titulo: item.titulo,
      preco: item.preco,
      dataEmbarque: item.dataEmbarque.split('T')[0],
      vagas: item.vagas,
      ativo: item.ativo,
      destinoId: String(item.destinoId)
    });
    setErros({ titulo: '', preco: '', dataEmbarque: '', vagas: '', destinoId: '' });
    setShowModal(true);
  };

  const validarFormulario = (): boolean => {
    const novosErros = { titulo: '', preco: '', dataEmbarque: '', vagas: '', destinoId: '' };
    let valido = true;

    if (!validarTituloPacote(form.titulo)) {
      novosErros.titulo = 'O título do pacote deve ter pelo menos 5 caracteres.';
      valido = false;
    }

    if (!validarPreco(form.preco)) {
      novosErros.preco = 'Informe um preço válido maior que zero.';
      valido = false;
    }

    if (!validarDataEmbarque(form.dataEmbarque)) {
      novosErros.dataEmbarque = 'A data de embarque deve ser uma data presente ou futura.';
      valido = false;
    }

    if (!validarVagas(form.vagas)) {
      novosErros.vagas = 'O pacote deve oferecer pelo menos 1 vaga.';
      valido = false;
    }

    if (!form.destinoId) {
      novosErros.destinoId = 'Selecione um destino válido para o pacote.';
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
      const res = await fetch(`${API_URL}/pacotes`, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Falha na operação');

      setShowModal(false);
      setAlerta({ tipo: 'success', texto: `Pacote ${editando ? 'atualizado' : 'cadastrado'} com sucesso!` });
      carregarDados();
    } catch {
      setAlerta({ tipo: 'danger', texto: 'Erro ao salvar pacote.' });
    }
  };

  const excluir = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja remover este pacote de viagem?')) return;

    try {
      const res = await fetch(`${API_URL}/pacotes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir');

      setAlerta({ tipo: 'success', texto: 'Pacote removido com sucesso!' });
      carregarDados();
    } catch {
      setAlerta({ tipo: 'danger', texto: 'Erro ao excluir pacote.' });
    }
  };

  return (
    <Container>
      <div className="content-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="page-title">Gestão de Pacotes de Viagem</h2>
          <Button variant="primary" onClick={abrirModalNovo} disabled={destinos.length === 0}>
            <i className="bi bi-box-seam me-1"></i> Novo Pacote
          </Button>
        </div>

        {destinos.length === 0 && (
          <Alert variant="warning">
            É necessário cadastrar pelo menos um destino antes de criar um pacote.
          </Alert>
        )}

        {alerta && (
          <Alert variant={alerta.tipo} dismissible onClose={() => setAlerta(null)}>
            {alerta.texto}
          </Alert>
        )}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Destino</th>
              <th>Preço</th>
              <th>Embarque</th>
              <th>Vagas</th>
              <th>Status</th>
              <th style={{ width: '150px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pacotes.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.titulo}</td>
                <td>{p.cidadeDestino} - {p.paisDestino}</td>
                <td>R$ {Number(p.preco).toFixed(2)}</td>
                <td>{new Date(p.dataEmbarque).toLocaleDateString('pt-BR')}</td>
                <td>{p.vagas}</td>
                <td>
                  {p.ativo ? (
                    <Badge bg="success">Disponível</Badge>
                  ) : (
                    <Badge bg="secondary">Esgotado</Badge>
                  )}
                </td>
                <td>
                  <Button variant="light" size="sm" className="btn-action-edit" onClick={() => abrirModalEditar(p)}>
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button variant="light" size="sm" className="btn-action-delete" onClick={() => excluir(p.id)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
            {pacotes.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center">Nenhum pacote cadastrado.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={salvar} noValidate>
          <Modal.Header closeButton>
            <Modal.Title>{editando ? 'Editar Pacote' : 'Novo Pacote'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Título do Pacote</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Fim de Semana na Serra Gaúcha"
                value={form.titulo}
                isInvalid={!!erros.titulo}
                onChange={(e) => {
                  setForm({ ...form, titulo: e.target.value });
                  if (erros.titulo) setErros({ ...erros, titulo: '' });
                }}
              />
              <Form.Control.Feedback type="invalid">
                {erros.titulo}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Destino Associado</Form.Label>
              <Form.Select
                value={form.destinoId}
                isInvalid={!!erros.destinoId}
                onChange={(e) => {
                  setForm({ ...form, destinoId: e.target.value });
                  if (erros.destinoId) setErros({ ...erros, destinoId: '' });
                }}
              >
                {destinos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.cidade} ({d.pais})
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {erros.destinoId}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Preço (R$)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Ex: 1250.00"
                value={form.preco}
                isInvalid={!!erros.preco}
                onChange={(e) => {
                  setForm({ ...form, preco: e.target.value });
                  if (erros.preco) setErros({ ...erros, preco: '' });
                }}
              />
              <Form.Control.Feedback type="invalid">
                {erros.preco}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Data de Embarque</Form.Label>
              <Form.Control
                type="date"
                min={obterDataMinimaHoje()}
                value={form.dataEmbarque}
                isInvalid={!!erros.dataEmbarque}
                onChange={(e) => {
                  setForm({ ...form, dataEmbarque: e.target.value });
                  if (erros.dataEmbarque) setErros({ ...erros, dataEmbarque: '' });
                }}
              />
              <Form.Control.Feedback type="invalid">
                {erros.dataEmbarque}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vagas Disponíveis</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={form.vagas}
                isInvalid={!!erros.vagas}
                onChange={(e) => {
                  setForm({ ...form, vagas: parseInt(e.target.value) || 0 });
                  if (erros.vagas) setErros({ ...erros, vagas: '' });
                }}
              />
              <Form.Control.Feedback type="invalid">
                {erros.vagas}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Pacote Ativo para Vendas"
                checked={form.ativo}
                onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
              />
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