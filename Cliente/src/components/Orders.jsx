import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Pedidos.css";

const Orders = () => {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteID, setClienteID] = useState("");
  const [searchCliente, setSearchCliente] = useState("");
  const [productoID, setProductoID] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [showOrdersHistory, setShowOrdersHistory] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchClientes();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/productos");
      setProductos(response.data);
    } catch (err) {
      setError("Error al obtener los productos: " + err.message);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/clientes");
      setClientes(response.data);
    } catch (err) {
      setError("Error al obtener los clientes: " + err.message);
    }
  };

  const fetchOrdersHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pedidos");
      setOrdersHistory(response.data);
    } catch (err) {
      setError("Error al obtener el historial de pedidos: " + err.message);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/pedido/${orderId}`
      );
      setSelectedOrder(response.data.productos);
    } catch (err) {
      setError("Error al obtener los detalles del pedido: " + err.message);
    }
  };

  const handleAddProduct = () => {
    const producto = productos.find((p) => p.id === parseInt(productoID));
    if (producto) {
      const newProduct = { ...producto, cantidad: parseInt(cantidad) };
      setSelectedProducts([...selectedProducts, newProduct]);
      setSubtotal(subtotal + newProduct.cantidad * newProduct.precio);
    }
  };

  const handleCreateOrder = async () => {
    setError("");
    setSuccess("");
    const pedido = {
      cliente_id: clienteID,
      productos: selectedProducts.map((p) => ({
        producto_id: p.id,
        cantidad: p.cantidad,
        precio: p.precio,
      })),
    };
    try {
      const response = await axios.post("http://localhost:5000/pedido", pedido);
      setSuccess("Pedido creado exitosamente.");
      setSelectedProducts([]);
      setSubtotal(0);
      setClienteID("");
      setSearchCliente("");
    } catch (err) {
      setError("Error al crear el pedido: " + err.message);
    }
  };

  const handleMarkAsSale = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:5000/pedido/${orderId}`);
      const orderDetails = response.data.productos;
      const cliente_id = response.data.cliente_id;
      const saleResponse = await axios.post("http://localhost:5000/venta", {
        cliente_id,
        productos: orderDetails,
      });

      setSuccess("Pedido marcado como venta.");
      fetchOrdersHistory();
    } catch (err) {
      setError("Error al marcar el pedido como venta: " + err.message);
    }
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(searchCliente.toLowerCase())
  );

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="orders-container">
      <h1>Pedidos</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div className="orders-buttons">
        <button
          onClick={() => {
            setShowOrdersHistory(!showOrdersHistory);
            fetchOrdersHistory();
          }}
        >
          {showOrdersHistory ? "Volver a Pedidos" : "Historial de Pedidos"}
        </button>
      </div>
      {showOrdersHistory ? (
        <div className="orders-history">
          <h2>Historial de Pedidos</h2>
          <table className="orders-history-table">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {ordersHistory.map((order) => (
                <tr key={order.id} onClick={() => fetchOrderDetails(order.id)}>
                  <td>{order.id}</td>
                  <td>{order.cliente}</td>
                  <td>
                    <input
                      type="date"
                      value={formatDateForInput(order.fecha)}
                      disabled
                    />
                  </td>
                  <td>${order.total}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsSale(order.id);
                      }}
                    >
                      Generar Venta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedOrder ? (
            <div className="order-details">
              <h3>Detalles del Pedido</h3>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.map((producto, index) => (
                    <tr key={index}>
                      <td>{producto.nombre}</td>
                      <td>{producto.cantidad}</td>
                      <td>${producto.precio}</td>
                      <td>${producto.cantidad * producto.precio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h3>Seleccione un Pedido...</h3>
          )}
        </div>
      ) : (
        <div>
          <div className="orders-form">
            <div>
              <label>Cliente:</label>
              <input
                type="text"
                value={searchCliente}
                onChange={(e) => setSearchCliente(e.target.value)}
                placeholder="Buscar cliente"
              />
              <select
                value={clienteID}
                onChange={(e) => setClienteID(e.target.value)}
              >
                <option value="">Seleccione un cliente</option>
                {filteredClientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Producto:</label>
              <select
                value={productoID}
                onChange={(e) => setProductoID(e.target.value)}
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Cantidad:</label>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
            <button onClick={handleAddProduct}>Agregar Producto</button>
          </div>
          <div className="orders-list">
            <h2>Carrito</h2>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto.nombre}</td>
                    <td>{producto.cantidad}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.cantidad * producto.precio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>SubTotal: ${subtotal.toFixed(2)}</h3>
            <button className="crear-pedido" onClick={handleCreateOrder}>
              Crear Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;