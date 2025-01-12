import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Row, Container, Col, Navbar, Alert, Spinner, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Products from './Products'; // Import the new Products component

function App() {
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const url = 'http://localhost:3001/upload_products';
    const formData = new FormData();
    formData.append('products', file);

    try {
      const response = await axios.post(url, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
      setSuccessMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading file: ", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand>Global Products</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/upload">Home</Nav.Link>
                <Nav.Link href="/products">Products</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container>
          <Routes>
            <Route path="/upload" element={
              <>
                <Row className="justify-content-md-center mt-5">
                  <Col xs={12} sm={8} md={6} lg={4}>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Upload Products CSV</Form.Label>
                        <Form.Control type="file" accept=".csv" onChange={handleChange} required />
                      </Form.Group>
                      <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Upload'}
                      </Button>
                    </Form>
                  </Col>
                </Row>
                <Row className="justify-content-md-center mt-5">
                  <Col xs={12} sm={8} md={6} lg={4}>
                    {successMessage && (
                      <Alert key='success' variant='success'>
                        {successMessage}
                      </Alert>
                    )}
                    {error && (
                      <Alert key='danger' variant='danger'>
                        <p>Error uploading file: {error.message}</p>
                      </Alert>
                    )}
                  </Col>
                </Row>
              </>
            } />
            <Route path="/products" element={<Products />} />
            <Route path="*" element={<Navigate to="/upload" />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;