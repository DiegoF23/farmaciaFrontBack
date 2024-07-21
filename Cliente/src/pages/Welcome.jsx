import React from 'react';
import { useParams, Link, Routes, Route } from 'react-router-dom';
import Clientes from '../components/Clientes';
import Ventas from '../components/Ventas';
import '../css/Welcome.css';

const Welcome = () => {
    const { userID } = useParams();

    return (
        <div className="welcome-container">
            <div className='sidebar'>
                <h2>Menu</h2> 
                <ul>
                    <li><Link to={`/welcome/${userID}/clients`} >Clientes</Link></li>
                    <li><Link to={`/welcome/${userID}/products`} >Productos</Link></li>
                    <li><Link to={`/welcome/${userID}/sales`} >Ventas</Link></li>
                    <li><Link to={`/welcome/${userID}/orders`} >Pedidos</Link></li>
                </ul>
            </div>
            <div className='content'>
                <h1>Bienvenido, Usuario ID: {userID}</h1>
                <Routes>
                    <Route path="clients" element={<Clientes />} />
                    <Route path="products" element={<div>Productos Component</div>} />
                    <Route path="sales" element={<Ventas/>} />
                    <Route path="orders" element={<div>Pedidos Component</div>} />
                </Routes>
            </div>
        </div>
    );
};

export default Welcome;