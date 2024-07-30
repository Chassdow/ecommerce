import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import "../../App.css";
// import "../../Home.css";
import Navbar from '../Navbar';
 import AgrumesHome from './../img/fond.jpg';

const Home = () => {
    const location = useLocation();
    const { state } = location;
    const [userData, setUserData] = useState(state || JSON.parse(localStorage.getItem('userData')));
    const [error, setError] = useState(null);
    
    console.log("Home=>",userData);
    useEffect(() => {
        if (!userData) {
            const fetchSymfony = async () => {
                try {
                    const response = await fetch('http://localhost:8000');
                    if (!response.ok) {
                        throw new Error('Une erreur est apparue');
                    }
                    const data = await response.json();
                    console.log(data);
                } catch (error) {
                    setError(error);
                }
            };
            fetchSymfony();
        } else {
            localStorage.setItem('userData', JSON.stringify(userData));
        }
    }, [userData]);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else {
        return (
            <>
                <Navbar userData={userData} />
                <div className="div_home">
                    <div className="container_home"> 
                   
                        <div className='titre_home'>
                            <h1 id="title">FOODIE</h1>
                        </div>
                        <div className='container-text'>
                        <div className='slogan_home'>
                            <p>Facile à préparer, difficile à oublier.</p> 
                        </div>   
                        <div className='lien_home'>
                            <Link to={{pathname: "/Product",state: { userData: userData }}} style={{ textDecoration: 'none' }}
                                ><span>Voir nos produits</span>
                            </Link>
                            </div>
                        </div>
                    </div> 
                    <div className='image_home'>
                        <img id="logo" className="agrumes" src={AgrumesHome} alt="Agrumes"/>
                    </div>           
                </div>     
            </>
        );
    }
}

export default Home;
