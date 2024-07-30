import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "../../App.css";
import Navbar from '../Navbar';
import Bouton from "../Bouton";

const Admin = () => {
    const location = useLocation();
    const { state } = location;
    const [userData, setUserData] = useState(state || JSON.parse(localStorage.getItem('userData')));
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
        }
    }, [userData]);

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/admin?query=${query}`);
            if (!response.ok) {
                const message = `Erreur lors de la recherche des utilisateurs: ${response.status} ${response.statusText}`;
                throw new Error(message);
            }
            const data = await response.json();
            setUsers(data.data);
            setError('');
        } catch (err) {
            console.error('Erreur lors de la recherche:', err);
            setError(err.message);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/admin/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const message = `Erreur lors de la suppression de l'utilisateur: ${response.status} ${response.statusText}`;
                throw new Error(message);
            }
            // Remove deleted user from the state
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8000/admin/categories');
            if (!response.ok) {
                const message = `Erreur lors de la récupération des catégories: ${response.status} ${response.statusText}`;
                throw new Error(message);
            }
            const data = await response.json();
            setCategories(data.data);
        } catch (err) {
            console.error('Erreur lors de la récupération des catégories:', err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/admin/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: categoryName }),
            });
            if (!response.ok) {
                const message = `Erreur lors de l'ajout de la catégorie: ${response.status} ${response.statusText}`;
                throw new Error(message);
            }
            const data = await response.json();
            setCategories([...categories, data.data]);
            setCategoryName('');
        } catch (err) {
            console.error('Erreur lors de l\'ajout de la catégorie:', err);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/admin/categories/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const message = `Erreur lors de la suppression de la catégorie: ${response.status} ${response.statusText}`;
                throw new Error(message);
            }
            setCategories(categories.filter(category => category.id !== id));
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
        }
    };

    return (
        <>
          <Navbar userData={userData} />
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card test">
                            <div className="card-header">
                                <h2>Rechercher Utilisateur</h2>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <form onSubmit={handleSearch} className="mb-3">
                                            <div className="form-group barrerecherch">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={query}
                                                    onChange={(e) => setQuery(e.target.value)}
                                                    placeholder="Rechercher par nom ou email"
                                                    required
                                                />
                                            </div>
                                            <Bouton>Rechercher</Bouton>
                                        </form>
                                        {error && <div className="alert alert-danger">{error}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <h2>Résultats</h2>
                                        <ul className="list-group">
                                            {users.map(user => (
                                                <li key={user.id} className="list-group-item">
                                                    Prénom: {user.firstname} <br />
                                                    Nom: {user.lastname} <br />
                                                    Email: {user.email} <br />
                                                    Numéro: {user.phone} <br />
                                                    Rôle: {user.roles} <br />
                                                    <Bouton
                                                        onClick={() => handleDeleteUser(user.id)} className="btn btn-danger">Supprimer
                                                    </Bouton>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h2>Ajouter une Catégorie</h2>
                                        <form onSubmit={handleAddCategory}>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={categoryName}
                                                    onChange={(e) => setCategoryName(e.target.value)}
                                                    placeholder="Nom de la catégorie"
                                                    required
                                                />
                                            </div>
                                            <Bouton type="submit">Ajouter</Bouton>
                                        </form>
                                    </div>
                                    <div className="col-md-6">
                                        <h2>Catégories</h2>
                                        <ul className="list-group">
                                            {categories.map(category => (
                                                <li key={category.id} className="list-group-item">
                                                    {category.name}
                                                    <Bouton
                                                        onClick={() => handleDeleteCategory(category.id)} className="btn btn-danger">Supprimer
                                                    </Bouton>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Admin;








