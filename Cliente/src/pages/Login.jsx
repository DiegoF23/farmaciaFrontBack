import React, {useState} from 'react';
import axios from 'axios';

const Login = () => {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleLogin = async (e) =>{
        e.preventDefault();
        setError('');
        if (!email || !password){
            setError('Todos los campos son obligatorios');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/login',
                {
                    email,
                    password
                }
            );
            console.log('Login Exitoso', response.data)
        } catch (err) {
            setError('Error en el login: '+ err.response.data.message)
        }
    }

  return (
    <>
        <h1>Login</h1>
        {error && <p style={{color:'red'}}>{error}</p>}
        <form onSubmit={handleLogin}>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <button type='submit'>Login</button>
        </form>
    </>
  )
}

export default Login