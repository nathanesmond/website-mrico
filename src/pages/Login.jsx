import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase/supabaseClient';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setErrorMsg(error.message);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
                <h2 className="text-2xl font-bold text-center text-gray-800">Admin Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border rounded px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border rounded px-3 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                <button type="submit" className="w-full bg-red-600 text-black py-2 rounded hover:bg-blue-700">
                    Login
                </button>
            </form>
        </div>
    );
}
