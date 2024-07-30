import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../Navbar';
import '../..//App.css'
import Agrumes from '../img/fond.jpg'
import { Link } from 'react-router-dom';
import Bouton from "../Bouton"

const Connexion = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');

    const navigate = useNavigate();

    function handleEmail(e) {
        setEmail(e.target.value);
    }

    function handlePassword(e) {
        setPassword(e.target.value);
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);

        const formData = {
            email,
            password,
        };
        try {
            const response = await fetch('http://localhost:8000/connection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('BINGOOO:', data);
            localStorage.setItem('userData', JSON.stringify(data));
            navigate('/', { state: { ...data } });
        } catch (error) {
            console.error('Erreur survenue à la réception de la data côté client:', error);
            setError('Une erreur est survenue lors de l\'inscription.');
        }
    }

    return (
        <>
            <Navbar />
            <div className="connection">
            <img id="logo" className="agrumes" src={Agrumes} alt="Agrumes"/>
                <div className="form-co">
                <h2 className='Titre'>Connection</h2>
                    <form method="POST" onSubmit={handleLoginSubmit}>
                        <div className="Email formu">
                            <input type="email" id="mail" name="mail" value={email} onChange={handleEmail} placeholder='Adresse Email' required />
                        </div>

                        <div className="Mdp formu">
                            <input type="password" id="mdp" name="mdp" minLength={9} value={password} onChange={handlePassword} placeholder='Mot de passe' required />
                        </div>

                        <div className='btn btn-Connection'>
                            <button type="submit">Se connecter</button>
                        </div>
                    </form>
                    <div className='btn-Inscription'>
                        <p>Pas encore de compte?</p>
                        <Bouton className="button"><Link to="/Inscription" style={{ textDecoration: 'none',color: 'white' }}>Inscription</Link></Bouton>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Connexion;