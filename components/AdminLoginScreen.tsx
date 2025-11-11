import React, { useState } from 'react';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';

interface AdminLoginScreenProps {
    onAdminLogin: (user: string, pass: string) => boolean;
    onShowUserLogin: () => void;
}

const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onAdminLogin, onShowUserLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!onAdminLogin(username, password)) {
            setError('Invalid admin credentials.');
        }
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-cover bg-center bg-slate-100 dark:bg-[#1F222A]" style={{backgroundImage: "url('https://images.unsplash.com/photo-1594908900066-3f473175435a?q=80&w=2070&auto=format&fit=crop')"}}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div className="relative z-10 w-full max-w-sm p-8 bg-white/10 dark:bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10">
                <h1 className="text-2xl font-bold text-center text-white mb-2">Admin Login</h1>
                <p className="text-center text-slate-300 mb-6">Enter your administrator credentials.</p>
                
                {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="admin-username" className="sr-only">Username</label>
                        <input
                            id="admin-username" 
                            type="text" 
                            placeholder="Username" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" 
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="admin-password" className="sr-only">Password</label>
                        <input
                            id="admin-password"
                            type={passwordVisible ? 'text' : 'password'} 
                            placeholder="Password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" 
                        />
                        <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200" aria-label="Toggle password visibility">
                            {passwordVisible ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                        </button>
                    </div>
                    <button type="submit" className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg text-lg hover:bg-yellow-400 transition-colors">
                        Login
                    </button>
                </form>
                
                <div className="text-center mt-6">
                    <button onClick={onShowUserLogin} className="text-xs text-slate-400 hover:text-yellow-400 transition-colors">
                        Back to User Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginScreen;