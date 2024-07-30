import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Logo from './img/logo.png';
import "../App.css";
import Bouton from "./Bouton.js";

function BasicExample({ userData }) {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    try {
      const response = await fetch('http://localhost:8000/deconnection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('HEYY:', data);
    } catch (error) {
      console.error('Erreur survenue à la réception de la data côté client:', error);
    }
    localStorage.removeItem('userData');
    navigate('/');
  };

  console.log('User Data:', userData);
  const isAdmin = userData && userData.data && Array.isArray(userData.data[4]) && userData.data[4].includes('ROLE_ADMIN');
  console.log('Is Admin:', isAdmin);

  const handleProfile = () => {
    navigate('/Profil', { state: userData });
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand href="/" className="position-relative start-0">
          <img id="logo" className="imgnavbar" src={Logo} alt="Logo Foodie" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto w-100 flex-column flex-lg-row align-items-stretch">
            <div className='d-flex flex-column flex-lg-row gap-3 w-100'>
              {userData ? (
                <>  
                  <Bouton className="button-custom" onClick={handleProfile}>Mon profil</Bouton>
                  <Link to="/" style={{ textDecoration: 'none' }}>
                    <Bouton className="button-custom">Voir nos Menus</Bouton>
                  </Link>
                  <Bouton className="button-custom" onClick={handleLogout}>Déconnexion</Bouton>
                  <Link to="/Panier" style={{ textDecoration: 'none' }}>
                    <Bouton className="button-custom">Mon panier</Bouton>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" style={{ textDecoration: 'none' }}>
                      <Bouton className="button-custom">Admin</Bouton>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/Inscription" style={{ textDecoration: 'none' }}>
                    <Bouton className="button-custom w-100">Inscription</Bouton>
                  </Link>
                  <Link to="/Connection" style={{ textDecoration: 'none' }}>
                    <Bouton className="button-custom w-100">Connection</Bouton>
                  </Link>
                  <Link to="/Panier" style={{ textDecoration: 'none' }}>
                    <Bouton className="button-custom w-100">Mon panier</Bouton>
                  </Link>
                </>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;

