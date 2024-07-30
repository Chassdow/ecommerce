import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import "../../profil.css";

import { useNavigate } from 'react-router-dom';

const Profil = () => {
    const location = useLocation();
    const userData = location.state || {};

    const navigate = useNavigate();

    const [adresse, setAdresse] = useState(userData.selectedAddress?.address || '');
    const [selectedAddress, setSelectedAddress] = useState({
        address: userData.selectedAddress?.address || '',
        postcode: userData.selectedAddress?.postcode || '',
        city: userData.selectedAddress?.city || ''
    });
    const [suggestions, setSuggestions] = useState([]);

    const [firstname, setFirstname] = useState(userData.firstname || '');
    const [lastname, setLastname] = useState(userData.lastname || '');
    const [email, setEmail] = useState(userData.email || '');
    const [password, setPassword] = useState('');
    const [verifypassword, setVerifyPassword] = useState('');

    const [verifyemail, setVerifyEmail] = useState('');
    const [error, setError] = useState('');

    const handleEmail = (e) => setEmail(e.target.value);
    const handleVerifyEmail = (e) => setVerifyEmail(e.target.value);
    const handleFirstname = (e) => setFirstname(e.target.value);
    const handleLastname = (e) => setLastname(e.target.value);
    const handleAdresse = (e) => {
        setAdresse(e.target.value);
        autocompleteAdresse(e.target.value);
    };
    const handlePassword = (e) => setPassword(e.target.value);
    const handleVerifyPassword = (e) => setVerifyPassword(e.target.value);


    const autocompleteAdresse = async (inputValue) => {
        if (inputValue) {
            try {
                const encodedValue = encodeURIComponent(inputValue);
                const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodedValue}&type=housenumber&autocomplete=1`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.features) {
                    setSuggestions(data.features);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error('Failed to fetch address suggestions:', error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    const selectAdresse = (element) => {
        setAdresse(element.properties.name);
        setSelectedAddress({
            address: element.properties.name,
            postcode: element.properties.postcode,
            city: element.properties.city
        });
        setSuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let verif = true;

        // Vérification des emails
        if (email !== verifyemail) {
            verif = false;
            setError('Attention, vos deux emails ne correspondent pas.');
        }

        // Vérification des mots de passe
        const regex_Password = /^(?=.*[a-z])(?=.*[A-Z]).{9,}$/;
        if (!password.match(regex_Password) || password !== verifypassword) {
            verif = false;
            setError('Attention, le mot de passe doit contenir au moins 9 caractères, une majuscule, une minuscule et être identique dans les deux champs.');
        }

        if (verif) {
            const htmlFormData = {
                firstname,
                lastname,
                email,
                selectedAddress,
                password,
                id: userData['data'][0],
            };
            try {
                const response = await fetch('http://localhost:8000/modification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(htmlFormData)
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                localStorage.removeItem('userData');

                const data = await response.json();
                console.log('BINGOOO:', data);
                localStorage.setItem('userData', JSON.stringify(data));
                navigate('/', { state: { ...data } });
            } catch (error) {
                console.error('Erreur survenue à la réception de la data côté client:', error);
                setError('Une erreur est survenue lors de l\'inscription.');
            }
        }
    };

    const suppression = async (e) => {
        e.preventDefault();
        try {
            
            console.log("leuserddaata",userData);
            const response = await fetch( 'http://localhost:8000/suppression', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            }
        );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
                
            localStorage.removeItem('userData');
            navigate('/');

        } catch (error) {
            console.error('Erreur survenue à la réception de la data côté client:', error);
            setError('Une erreur est survenue lors de la suppression.');
        }
    };

    return (
        <>
            <Navbar userData={userData} />

            <h1>Modifier mon profil</h1>

            <div className='box'>
                <div>
                    <form method='get'>
                        <h4>Vos informations actuelles:</h4>
                        <div className="Prenom">
                            <label htmlFor="prenom">Prénom: </label>
                            <span>{userData['data'][1]}</span>
                        </div>
                        <div className="Nom">
                            <label htmlFor="name">Nom: </label>
                            <span>{userData['data'][2]}</span>
                        </div>
                        <div className="Email">
                            <label htmlFor="email">Email:</label>
                            <span>{userData['data'][3]}</span>
                        </div>
                        {/* <div>
                            <label htmlFor="adresse">Adresse: </label>
                            <span>{userData.[]selectedAddress?.address}</span>
                        </div> */}
                    </form>
                </div>

                <div className='formProfil'>
                    <form method="POST" onSubmit={handleSubmit}>
                        <div className="Prenom">
                            <label htmlFor="prenom">Prénom:</label>
                            <input
                                type="text"
                                id="prenom"
                                value={firstname}
                                pattern='^[a-zA-Z]{2,130}$'
                                name="prenom"
                                onChange={handleFirstname}
                                placeholder='Prénom'
                                required
                            />
                        </div>

                        <div className="Nom">
                            <label htmlFor="nom">Nom</label>
                            <input
                                type="text"
                                id="nom"
                                value={lastname}
                                pattern='^[a-zA-Z]{2,130}$'
                                onChange={handleLastname}
                                name="nom"
                                placeholder='Nom'
                                required
                            />
                        </div>

                        <div className="Mdp">
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                id="mdp"
                                value={password}
                                onChange={handlePassword}
                                name="mdp"
                                placeholder='Mot de passe'
                                required
                            />
                        </div>

                        <div className="Mdp">
                            <label htmlFor="password">Confirmer votre nouveau mot de passe:</label>
                            <input
                                type="password"
                                id="pass"
                                value={verifypassword}
                                onChange={handleVerifyPassword}
                                name="pass"
                                placeholder='Confirmation Mot de passe'
                                required
                            />
                        </div>

                        <div className="Email">
                            <label htmlFor="email">Nouveau email:</label>
                            <input
                                type="email"
                                id="mail"
                                value={email}
                                pattern='^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,}$'
                                onChange={handleEmail}
                                name="mail"
                                placeholder='E-mail'
                                required
                            />
                        </div>

                        <div className="Email">
                            <label htmlFor="email">Confirmez votre nouvel email:</label>
                            <input
                                type="email"
                                id="courrier"
                                value={verifyemail}
                                onChange={handleVerifyEmail}
                                name="courrier"
                                placeholder='Confirmation E-mail'
                                required
                            />
                        </div>

                        <div className="Adresse">
                            <label htmlFor="adresse">Votre nouvelle adresse:</label>
                            <input
                                type="text"
                                id="adresse"
                                value={adresse}
                                onChange={handleAdresse}
                                name="adresse"
                                placeholder='Nouvelle adresse'
                                required
                            />
                            {suggestions.length > 0 && (
                                <div className="dropdown">
                                    <ul>
                                        {suggestions.map((suggestion) => (
                                            <li key={suggestion.properties.id} onClick={() => selectAdresse(suggestion)}>
                                                <span>{suggestion.properties.name}</span>
                                                <span>{suggestion.properties.postcode} {suggestion.properties.city}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="Adresse">
                            <label htmlFor="resAdresse">Nouvelle adresse :</label>
                            <input type="text" id="resAdresse" value={selectedAddress.address} disabled />
                            <label htmlFor="CP">Code Postal :</label>
                            <input type="text" id="CP" value={selectedAddress.postcode} disabled />
                            <label htmlFor="Ville">Ville :</label>
                            <input type="text" id="Ville" value={selectedAddress.city} disabled />
                        </div>
                        <button type='submit'>Modifier</button>
                        {error && <div className="error">{error}</div>}
                        <button type='button' onClick={suppression}>Supprimer le compte</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Profil;
