import React, { useState } from 'react';
import axios from 'axios';
import '../css/Register.css';

const Register = () => {
  const [nombre, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');

      if (!nombre || !email || !password || !confirmPassword) {
          setError('Todos los campos son obligatorios.');
          return;
      }

      if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden.');
          return;
      }

      try {
          const response = await axios.post('http://localhost:5000/register', { nombre, email, password });
          setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
      } catch (err) {
          setError('Error en el registro: ' + err.response.data.message);
      }
  };

  return (
      <div className="register-container">
          <h1>Registro</h1>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <form className="register-form" onSubmit={handleRegister}>
              <div>
                  <label>Nombre:</label>
                  <input type="text" value={nombre} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                  <label>Email:</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                  <label>Password:</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                  <label>Confirmar Password:</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <button type="submit">Registrarse</button>
          </form>
      </div>
  );
};

export default Register;