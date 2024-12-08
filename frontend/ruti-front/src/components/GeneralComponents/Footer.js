import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../styles/GeneralStyles/Footer.css'; // Importa el archivo de estilos

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Row className="justify-content-center align-items-center">
          <Col md={6} className="footer-section about text-center">
            <h1 className="footer-title">Ruti</h1>
            <p>Your fitness and wellness app.</p>
            <p>&copy; {new Date().getFullYear()} Ruti. All rights reserved.</p>
          </Col>
          <Col md={6} className="footer-section social text-center">
            <h1 className="footer-title">Follow us</h1>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;
