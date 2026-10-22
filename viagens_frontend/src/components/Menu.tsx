import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Menu = () => {
  return (
<Navbar expand="lg" className="custom-navbar">      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-airplane-engines me-2"></i>
          Gestão de Viagens
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/destinos">
              <i className="bi bi-geo-alt me-1"></i> Destinos
            </Nav.Link>
            <Nav.Link as={Link} to="/clientes">
              <i className="bi bi-people me-1"></i> Clientes
            </Nav.Link>
            <Nav.Link as={Link} to="/pacotes">
              <i className="bi bi-box2-heart me-1"></i> Pacotes
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};