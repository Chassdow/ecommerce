import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profil from './components/pages/Profil';
import Accueil from './components/pages/Accueil';
import Connection from './components/pages/Connection'
import Inscription from './components/pages/Inscription';
import Product from './components/articles/produits/Produits';
import Admin from './components/pages/admin';
import Detail from './components/articles/produits/Detail';


function App() {
  return (
    
    <Router>
      <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/Profil" element={<Profil />} />
      <Route path="/Connection" element={<Connection />} />
      <Route path= "/Inscription" element ={<Inscription />} />
      <Route path= "/Product" element={<Product />} />
      <Route path= "/Admin" element={<Admin/>} />
      <Route path= "/Detail/:id" element={<Detail/>} />
     
      </Routes>
    </Router>
  );
}

export default App;