import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import { Container, Row, Col, Button, Navbar, Nav } from "react-bootstrap";
import LiveMeasurement from "./components/livepowerconsumption";
import Name from "./components/name";


const App = () => (
    <>
      {/* Navigasjonslinje */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Totenvegen 576A</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hovedinnhold */}
      <Container className="mt-5">
        <Row>
          <Col md={6}>
            <div className="App">
                <Name />
              <h1>Strømforbruk akkurat nå</h1>
              <LiveMeasurement homeId="f8b55fa3-1bf4-440f-aa0f-39f8fd2a49ca"/>
            </div>

          </Col>
        </Row>
      </Container>
    </>
);

export default App;
