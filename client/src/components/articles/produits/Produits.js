import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Card from './Card';
import Navbar from '../../Navbar';
import prep from '../../img/preparer.jpg';
import Bouton from '../../Bouton';

const Product = () => {
    const location = useLocation();
    const { state } = location;
    const [userData, setUserData] = useState(state || JSON.parse(localStorage.getItem('userData')));
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [productsSearch, setProductsSearch] = useState([]);
    const [categorie, setCategorie] = useState([]);
    const [queryProduct, setQueryProduct] = useState('');
    const [queryCategorie, setQueryCategorie] = useState('');

    const getProductQuery = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/produitRecherche?query=${queryProduct}`, {
                method: 'GET'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProductsSearch(data.data);
        } catch (error) {
            console.error('Erreur survenue à la réception de la data côté client:', error);
            setError('Une erreur est survenue lors de la récupération des articles.');
        }
    };

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await fetch('http://localhost:8000/produit', {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data.data);
            } catch (error) {
                console.error('Erreur survenue à la réception de la data côté client:', error);
                setError('Une erreur est survenue lors de la récupération des produits.');
            }
        };
        getProduct();
    }, []);

    const getCategorie = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/categorie?query=${queryCategorie}`, {
                method: 'GET'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCategorie(data.data);
        } catch (error) {
            console.error('Erreur survenue à la réception de la data côté client:', error);
            setError('Une erreur est survenue lors de la récupération des catégories.');
        }
    };

    return (
        <>
            <Navbar userData={userData} />
            <h1>Nos produits</h1>
            <h4>Facile à préparer, difficile à oublier.</h4>

            <h2>Rechercher Un Produit</h2>
            <div className="card-body">
                <form onSubmit={getProductQuery}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            value={queryProduct}
                            onChange={(e) => setQueryProduct(e.target.value)}
                            placeholder="Rechercher par nom"
                            required
                        />
                    </div>
                    <Bouton>Rechercher</Bouton>
                </form>
            </div>

            <h2>Rechercher Une Catégorie</h2>
            <div className="card-body">
                <form onSubmit={getCategorie}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            value={queryCategorie}
                            onChange={(e) => setQueryCategorie(e.target.value)}
                            placeholder="Rechercher par catégorie"
                            required
                        />
                    </div>
                    <Bouton>Rechercher</Bouton>
                </form>
            </div>

            <div className="result">
                {productsSearch.length > 0 ? (
                    productsSearch.map((product, index) => (
                        <Card
                            key={index}
                            title={product.name}
                            categorie={product.categorie.name}
                            content={product.description}
                            price={product.price}
                        />
                    ))
                ) : (
                    <p>Aucun produit trouvé</p>
                )}
            </div>
            <div className="result-categorie">
                {categorie.length > 0 ? (
                    categorie.map((cat, index) => (
                        <div key={index} className="category">
                            <h2>{cat.name}</h2>
                        </div>
                    ))
                ) : (
                    <p>Aucune catégorie trouvée</p>
                )}
            </div>
            <div className="container-product">
                {products.map(product => (
                    <Link to={`/detail/${product.id}`} key={product.id}>
                        <div className="first-row">
                            <Card 
                                key={product.id} 
                                title={product.name}
                                categorie={product.categorie.name}
                                image={<img id="prep" className="img-card" src={prep} alt="Prepa Foodie" />}
                                content={product.description}
                                price={`À compter de ${product.price}€ par repas`}
                            />
                        </div>
                    </Link>
                ))}
            </div>

        </>
    );
};

export default Product;
