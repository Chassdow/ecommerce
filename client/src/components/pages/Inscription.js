import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../Navbar';
import '../../App.css';

import Agrumes from '../img/fond.jpg';

const Inscription = () => {
    const [civilite, setCivilite] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [adresse, setAdresse] = useState('');
    const [password, setPassword] = useState('');
    const [selectedAddress, setSelectedAddress] = useState({ address: '', postcode: '', city: '' });

    const [verifyemail, setVerifyEmail] = useState('');
    const [verifypassword, setVerifyPassword] = useState('');

    const [suggestions, setSuggestions] = useState([]);

    const [error, setError] = useState('');

    const navigate = useNavigate();

    function handleCivilite(e){
        setCivilite(e.target.value);
    }

    function handleFirstname(e){
        setFirstname(e.target.value);
    }

    function handleLastname(e){
        setLastname(e.target.value);
    }

    function handleEmail(e){
        setEmail(e.target.value);
    }

    function handleVerifyEmail(e){
        setVerifyEmail(e.target.value);
    }

    function handlePhone(e){
        setPhone(e.target.value);
    }

    function handleDate(e){
        setDate(e.target.value);
    }

    function handleAdresse(e){
        setAdresse(e.target.value);
        autocompleteAdresse(e.target.value);
    }

    function handlePassword(e){
        setPassword(e.target.value);
    }

    function handleVerifyPassword(e){
        setVerifyPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        var verif = true;

        //Si l'email et le verifyemail sont les mêmes
            if(email !== verifyemail){
                verif = false;
                console.log("verifEmail");
                setError('Attention, vos deux email ne correspondent pas.');
            }
        //Si le telephone est français
            const regexFrancais = /^(?:\+33|0)\d{9}$/;
            if(! regexFrancais.test(phone)){
                verif = false;
                setError('Attention, vous devez nous fournir un numéro français. French Number per favor');
                console.log("phone");
            }

        //Si le user a 12 >= ans
            var currentdate = new Date();
            var date_value = new Date(date);
            var jours = parseInt((currentdate-date_value) / (1000 * 60 * 60 * 24));
            var ans = jours/365;
        
            if(ans < 12){
                console.log("age");
                verif = false;
                setError('Attention, vous devez avoir au moins 12 ans pour avoir un compte, revenez quand vous aurez plus de dents !');
            }

        //Si le mdp et le verifympassword sont au bons format (<= 9)
        const regex_Password = "^(?=.*[a-z])(?=.*[A-Z]).{8,}$";
            //at least 9 characters length, at least one lowercase letter, at least one uppercase letter

        if(password < 9 | verifypassword < 9 |! password.match(regex_Password)){
            console.log("fake");
            if(password < 9 | verifypassword < 9){
                console.log('taille');
                setError('Attention, le mot de passe doit contenir au moins 9 charactères.');
            }
            if(! password.match(regex_Password)){
                console.log('regex');
                setError(
                    'Attention, vous devez avoir un mot de passe qui respecte le format, évitez le nom de votre chat et son âge! -Minimum 9, 1 Maj, 1 minus!'
                );
            }
            verif = false;
        }

        //Si le mdp et le verifypassword sont identique =>
            if(password !== verifypassword){
                console.log("password");
                verif = false;
                setError('Attention, vous devez avoir mis les deux même mots de passes, vous n\'avez pas deux clées différentes chez vous, si ?');
            }
       
        if(verif === true){
            const formData = {
                civilite,
                firstname,
                lastname,
                email,
                phone,
                date,
                selectedAddress,
                password,
            };
            try {
                const response = await fetch('http://localhost:8000/inscription', {
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
    };

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

    return (
        <>
            <Navbar />
            <div className="container_inscription">
                <div className='image_agrumes_inscrire'>
                    <img id="logo" className="agrumes" src={Agrumes} alt="Agrumes"/>
                </div>
                <div className="form-inscription">
                    <div className='titre-inscrire'>
                        <h2>S'Inscrire</h2>
                    </div>

                    <form method="POST" onSubmit={handleSubmit}>
                        <div className="Civilite">
                            <label htmlFor="monsieur">Monsieur</label>
                            <input type="radio" id="monsieur" value="homme" name="genre" onChange={handleCivilite} required />
                            <label htmlFor="madame">Madame</label>
                            <input type="radio" id="madame" value="femme" name="genre" onChange={handleCivilite} required />
                        </div>

                        <div className="Prenom">
                          <input type="text" id="prenom" value={firstname} pattern='^[a-zA-Z]{2,130}$' name="prenom" onChange={handleFirstname} placeholder='Prénom' required/>
                        </div>

                        <div className="Nom">
                          <input type="text" id="nom" value={lastname} pattern='^[a-zA-Z]{2,130}$' onChange={handleLastname} name="nom" placeholder='Nom' required/>
                        </div>

                        <div className="Email">
                          <input type="email" id="mail" value={email} pattern='^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,300}$' onChange={handleEmail} name="mail" placeholder='E-mail' required/>
                        </div>

                        <div className="Email">
                            <input type="email" id="courrier" value={verifyemail} onChange={handleVerifyEmail} name="courrier" placeholder='Confirmation E-mail' required/>
                        </div>

                        <div className="Phone">
                          <input type="tel" id="phone" value={phone} onChange={handlePhone} name="phone" placeholder='Téléphone' required/>
                        </div>

                        <div className="Date">
                            <input type="date" id="date" value={date} onChange={handleDate} name="date" max="2024-12-31" placeholder='Date de naissance' required />
                        </div>

                        <div className="Adresse">
                            <input type="text" id="adresse" value={adresse} onChange={handleAdresse} name="adresse" placeholder='Adresse' required />
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

                        <label htmlFor="resAdresse">Adresse :</label>
                        <input type="text" id="resAdresse" value={selectedAddress.address} disabled />
                        <label htmlFor="CP">Code Postal :</label>
                        <input type="text" id="CP" value={selectedAddress.postcode} disabled />
                        <label htmlFor="Ville">Ville :</label>
                        <input type="text" id="Ville" value={selectedAddress.city} disabled />

                        <div className="Mdp">
                            <input type="password" id="mdp" value={password} onChange={handlePassword} name="mdp" placeholder='Mot de passe' required />
                        </div>

                        <div className="Mdp">
                            <input type="password" id="pass" value={verifypassword} onChange={handleVerifyPassword} name="pass" placeholder='Confirmation Mot de passe' required />
                        </div>

                            {error && <div className="error">{error}</div>}

                        <div className='btn'>
                            <button type="submit">S'Inscrire</button>
                        </div>
                    </form>

                    <div className='redirection_pageconnection'>
                        <span>Déjà inscrit ?</span>
                        <a href="/Connection">Se Connecter</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Inscription;
