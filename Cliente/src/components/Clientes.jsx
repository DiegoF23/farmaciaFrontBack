import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Clientes.css";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [editingClient, setEditingClient] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchClientes();
  }, []);
  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/clientes");
      setClientes(response.data);
      console.log(clientes);
    } catch (err) {
      setError("Error al obtener los clientes: " + err.message);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:5000/cliente", {
        nombre,
        direccion,
        telefono,
        email,
      });
      setSuccess("Cliente creado exitosamente.");
      fetchClientes();
      setNombre("");
      setEmail("");
      setDireccion("");
      setTelefono("");
    } catch (err) {
      setError("Error al Crear el cliente: " + err.message);
    }
  };
  const handleEditClient = async (id) => {
    setEditingClient(id);
    const client = clientes.find((c) => c.id === id);
    setNombre(client.nombre);
    setEmail(client.email);
    setDireccion(client.direccion);
    setTelefono(client.telefono);
  };
  const handleUpdateClient = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.put(`http://localhost:5000/cliente/${editingClient}`, {
        nombre,
        direccion,
        telefono,
        email,
      });
      setSuccess("Cliente Actualizado exitosamente.");
      fetchClientes();
      setEditingClient(null);
      setNombre("");
      setEmail("");
      setDireccion("");
      setTelefono("");
    } catch (err) {
      setError("Error al actualizar el cliente: " + err.message);
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/cliente/${id}`);
      setSuccess("Cliente Elimino exitosamente.");
      fetchClientes();
    } catch (err) {
      setError("Error al Eliminar el cliente: " + err.message);
    }
  };

  return (
    <div className="clientes-container">
      <h1>Clientes</h1>
      {error && <p className="error">{erorr}</p>}
      {success && <p className="success">{success}</p>}
      <form
        className="clientes-form"
        onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
      >
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Direccion:</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>
        <div>
          <label>Telefono:</label>
          <input
            type="number"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <button type="submit">
          {editingClient ? "Actualizar Cliente" : "Crear Cliente"}
        </button>
      </form>
      <div className="clientes-list">
        <h2>Lista de Clientes</h2>

        <ul>
          {clientes.map((cliente) => (
            <li key={cliente.id}>
            Nombre: {cliente.nombre}
            <br />
            Email: {cliente.email}
            <br />
            Direccion: {cliente.direccion}
            <br />
            Telefono: {cliente.telefono}
            <button onClick={()=>handleEditClient(cliente.id)} >Editar</button>
            <button onClick={()=>handleDeleteClient(cliente.id)} >Eliminar</button>
             </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Clientes;
