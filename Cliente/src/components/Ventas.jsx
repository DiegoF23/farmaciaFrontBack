import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Ventas.css";

const Sales = () => {
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
  const [salesHistory, setSalesHistory] = useState([]);
  const [showSalesHistory, setShowSalesHistory] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

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

  const fetchSalesHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ventas");
      setSalesHistory(response.data);
    } catch (err) {
      setError("Error al obtener el historial de ventas: " + err.message);
    }
  };

  const fetchSaleDetails = async (saleId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/detalle-venta/${saleId}`
      );
      setSelectedSale(response.data[0]);
    } catch (err) {
      setError("Error al obtener los detalles de la venta: " + err.message);
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

  const handleCreateSale = async () => {
    setError("");
    setSuccess("");
    const venta = {
      cliente_id: clienteID,
      productos: selectedProducts.map((p) => ({
        producto_id: p.id,
        cantidad: p.cantidad,
        precio: p.precio,
      })),
    };
    try {
      const response = await axios.post("http://localhost:5000/venta", venta);
      setSuccess("Venta creada exitosamente.");
      setSelectedProducts([]);
      setSubtotal(0);
      setClienteID("");
      setSearchCliente("");
    } catch (err) {
      setError("Error al crear la venta: " + err.message);
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
    <div className="sales-container">
      <h1>Ventas</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div className="sales-buttons">
        <button
          onClick={() => {
            setShowSalesHistory(!showSalesHistory);
            fetchSalesHistory();
          }}
        >
          {showSalesHistory ? "Volver a Ventas" : "Historial de Ventas"}
        </button>
      </div>
      {showSalesHistory ? (
        <div className="sales-history">
          <h2>Historial de Ventas</h2>
          <table className="sales-history-table">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody onClick={() => fetchSaleDetails(sale.id)}>
            {salesHistory.map(sale => (
                                    <tr key={sale.id} onClick={() => fetchSaleDetails(sale.id)}>
                                        <td>{sale.id}</td>
                                        <td>{sale.cliente}</td>
                                        <td>
                                            <input
                                                type="date"
                                                value={formatDateForInput(sale.fecha)}
                                                disabled
                                            />
                                        </td>
                                        <td>${sale.total}</td>
                                    </tr>
                                ))}
            </tbody>
          </table>
          {selectedSale ? (
            <div className="sale-details">
              <h3>Detalles de la Venta</h3>
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
                  {selectedSale.map((producto, index) => (
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
            <h3>Seleccione una Venta...</h3>
          )}
        </div>
      ) : (
        <div>
          <div className="sales-form">
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
          <div className="sales-list">
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
            <button className="crear-venta" onClick={handleCreateSale}>Crear Venta</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
