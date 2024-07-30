import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../Navbar';
import '../../../../src/App.css';
import prep from '../../img/preparer.jpg';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Detail = ({ title, image, categorie, introduction, price, stock, ingredient }) => {
  const location = useLocation();
  const { state } = location;
  const [userData, setUserData] = useState(state || JSON.parse(localStorage.getItem('userData')));
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8000/detail/${id}`, {
          method: 'GET'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.data);
        
        // Vérification du stock après avoir mis à jour les produits
        if (data.data.stocks.every(stockItem => stockItem.number === 0)) {
          alert('Ce produit est en rupture de stock!');
        }
      } catch (error) {
        console.error('Erreur survenue à la réception de la data côté client:', error);
        setError('Une erreur est survenue lors de la récupération des données.');
      }
    }
    getDetail();
  }, [id]);

  console.log(products);
  return (
    <>
      <Navbar userData={userData} />
      <div className="card">
        {products ? (
          <>
            <h2>{products.name}</h2>
            <p>{products.introduction}</p>
            <h4>{products.categorie}</h4>
            <img src={prep} alt="Préparation" />
            <p>{products.price}€</p>
            <ul>
              {products.ingredients.map((ingredient, index) => (
                <li key={index}>
                  <strong>{ingredient.name}</strong> <h6>Quantité: {ingredient.piece}</h6>
                </li>
              ))}
            </ul>
            <ul>
              {products.stocks && products.stocks.length > 0 ? (
                products.stocks.map((stockItem, index) => (
                  <li key={index}>
                    <strong>Encore disponible :</strong> 
                    <p className={stockItem.number === 0 ? 'warning' : 'validate'}>{stockItem.number}</p>
                  </li>
                ))
              ) : (
                <li className="warning">Aucun stock disponible</li>
              )}
            </ul>
          </>
        ) : (
          <p>Chargement...</p>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
};

export default Detail;