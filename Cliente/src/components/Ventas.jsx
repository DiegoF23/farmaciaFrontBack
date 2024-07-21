import React, {useState, useEffect} from 'react'
import axios from 'axios'
import '../css/Ventas.css'

const Ventas = () => {
const [ventas, setVentas] = useState([]);
const [cliente_id, setCliente_id] = useState('');
const [productos,setProductos]=useState([]);
const [producto_id, setProducto_id]=useState('');
const [cantidad, setCantidad]=useState('');
const [precio, setPrecio] = useState('');
const [editingVenta,setEditingVenta] = useState(null);
const [error,setError]= useState('');
const [success,setSuccess] = useState('');
const [subTotal,setSubtotal]= useState(0);
const url = 'http://localhost:5000';
useEffect(()=>{
    fetchVentas();
},[]);

const fetchVentas = async () =>{
    try {
        const response = await axios.get(url+'/ventas');
        setVentas(response.data);
    } catch (err) {
        setError('Error al obtener las ventas '+ err.message )
    }
} 
const handleCreateVenta = async (e) =>{
    e.preventDefault();
    setError('');
    setSuccess('');


    if (!cliente_id || productos.length === 0 ){
        setError('Debe seleccionar un cliente y agregar al menos un producto.');
        return;
    }

    try {
        await axios.post(url+'/venta', {cliente_id,productos});
        setSuccess('Venta crada exitosamente.');
        fetchVentas();
        setCliente_id('');
        setProductos([]);
    } catch (err) {
        setError('Error al Crear la venta: '+ err.message )
    }
}

const handleAddProduct = () =>{
    if (!producto_id || !cantidad || !precio){
        setError('Todos los campos del producto son obligatorios');
        return;
    }
    setProductos([...productos,{producto_id, cantidad, precio}]);
    setProducto_id('');
    setCantidad('');
    setPrecio('');
    setError('');
}

const handleEditVenta = async (id) =>{
    setEditingVenta(id);
    const venta = ventas.find(v => v.id === id);
    setCliente_id(venta.cliente_id);
    setProductos(venta.productos);
}
const handleUpdateVenta = ()=>{
    setSuccess('Editando la venta')
}

return (
    <div className='ventas-container'>
        <h1>Ventas</h1>
        {error && <p className='error'>{error}</p>}
        {success && <p className='success'>{success}</p>}
        <form className='ventas-form' onSubmit={editingVenta ? handleUpdateVenta : handleCreateVenta}>
        <div>
            <label>Cliente ID:</label>
            <input type="number" value={cliente_id} onChange={(e)=>setCliente_id(e.target.value)} />
        </div>
        <div>
            <label >Agregar Producto</label>
            <input type="number" placeholder='Producto ID' value={producto_id} onChange={(e)=>setProducto_id(e.target.value)} />
            <input type="number" placeholder='Cantidad' value={cantidad} onChange={(e)=>setCantidad(e.target.value)} />
            <input type="number" placeholder='Precio' value={precio} onChange={(e)=>setPrecio(e.target.value)} />
            <button type='button' onClick={handleAddProduct}>Agregar Producto</button>
            <h2>Lista Productos</h2>
                    <ul>
                    {productos.map(producto=>(
                        <li>
                            {producto.producto_id}
                            <br />
                            {producto.cantidad}
                            <br />
                            {producto.precio}
                            <br />
                            Subtotal: {producto.cantidad*producto.precio}
                           
                        </li>
                    ))}
                    </ul>
                    <h3>
                        Subtotal = $ {}
                    </h3>
                    
        </div>
        <button type='submit'>{editingVenta ? 'Actualizar Venta': 'Crear Venta'}</button>
        </form>
        <div className='ventas-list'>
            <h2>Lista de Ventas</h2>
            <ul>
                {ventas.map(venta =>(
                    <li key={venta.id}>
                        Cliente ID: {venta.cliente_id}
                        <br />
                        Fecha: {venta.fecha}
                        <br />
                        Total: {venta.total}
                    </li>
                ))}
            </ul>
        </div>
    </div>
  )
}

export default Ventas