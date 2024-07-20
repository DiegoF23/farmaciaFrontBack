import React from 'react';
import { useParams, Link,Routes,Route } from 'react-router-dom';
import Clientes from '../components/Clientes';
import '../css/Welcome.css';

const Welcome = () => {
    const { userID } = useParams();

    return (
        <div className="welcome-container">
            <div className='sidebar'>
                <h2>Menu</h2>
                <ul>
                    <li><Link to={`/welcome/${userID}/clients`} >Clientes</Link></li>
                    <li><Link to={'/products'} >Productos</Link></li>
                    <li><Link to={'/sales'} >Ventas</Link></li>
                    <li><Link to={'/orders'} >Pedidos</Link></li>
                </ul>
            </div>
        <div className='content'>
            <h1>Bienvenido, Usuario ID: {userID}</h1>
            <Routes>
            <Route path={`/welcome/${userID}/clients`} element={<Clientes/>} />
            </Routes>
        </div>
        </div>
    );
};

export default Welcome;