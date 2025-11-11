import React, { useState } from 'react';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { XIcon } from './icons/XIcon';

interface AuthModalProps {
    onClose: () => void;
    onUserLogin: (email: string, pass: string) => boolean;
    onUserSignup: (username: string, email: string, pass: string) => boolean;
    onShowAdminLogin: () => void;
}

type View = 'login' | 'signup' | 'forgot-password';

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onUserLogin, onUserSignup, onShowAdminLogin }) => {
    const [view, setView] = useState<View>('login');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginPassVisible, setLoginPassVisible] = useState(false);
    
    const [signupUsername, setSignupUsername] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [signupPassVisible, setSignupPassVisible] = useState(false);
    const [signupConfirmPassVisible, setSignupConfirmPassVisible] = useState(false);

    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotMessage, setForgotMessage] = useState('');

    const [error, setError] = useState('');

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!onUserLogin(loginEmail, loginPassword)) {
            setError('Invalid email or password.');
        }
    };
    
    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!signupUsername || !signupEmail || !signupPassword) {
            setError('Please fill all fields.');
            return;
        }
        if (signupPassword !== signupConfirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!onUserSignup(signupUsername, signupEmail, signupPassword)) {
            setError('Could not create account. Email may already be in use.');
        }
    };

    const handleForgotSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setForgotMessage('');
        if (!forgotEmail) {
            setError('Please enter your email address.');
            return;
        }
        // Simulate sending a reset link
        setTimeout(() => {
            setForgotMessage(`If an account with ${forgotEmail} exists, a password reset link has been sent.`);
        }, 1000);
    }

    const renderContent = () => {
        if(view === 'forgot-password') {
            return (
                <div>
                     <h1 className="text-2xl font-bold text-center text-white mb-2">Reset Password</h1>
                     <p className="text-center text-slate-300 mb-6">Enter your email to receive a reset link.</p>
                     {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
                     {forgotMessage && <p className="text-green-400 text-center text-sm mb-4">{forgotMessage}</p>}
                     <form onSubmit={handleForgotSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="forgot-email" className="sr-only">Email</label>
                            <input id="forgot-email" type="email" placeholder="Email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                        </div>
                        <button type="submit" className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg text-lg hover:bg-yellow-400 transition-colors">Send Reset Link</button>
                    </form>
                    <div className="text-center mt-6">
                        <button onClick={() => { setView('login'); setError(''); setForgotMessage('') }} className="text-xs text-slate-400 hover:text-yellow-400 transition-colors">
                            Back to Login
                        </button>
                    </div>
                </div>
            )
        }
        return (
            <div>
                 <h2 className="text-2xl font-bold text-center text-white mb-2">Login to Continue</h2>
                 <p className="text-sm text-center text-slate-400 mb-6">You need an account to access this feature.</p>

                <div className="flex justify-center bg-slate-800/50 p-1 rounded-full mb-6">
                    <button onClick={() => { setView('login'); setError('')}} className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${view === 'login' ? 'bg-yellow-500 text-black' : 'text-slate-300'}`}>Login</button>
                    <button onClick={() => { setView('signup'); setError('')}} className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${view === 'signup' ? 'bg-yellow-500 text-black' : 'text-slate-300'}`}>Sign Up</button>
                </div>
                
                {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
                
                {view === 'login' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="login-email" className="sr-only">Email</label>
                            <input id="login-email" type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                        </div>
                        <div className="relative">
                            <label htmlFor="login-password" className="sr-only">Password</label>
                            <input id="login-password" type={loginPassVisible ? 'text' : 'password'} placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <button type="button" onClick={() => setLoginPassVisible(!loginPassVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200" aria-label="Toggle password visibility">
                                {loginPassVisible ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                            </button>
                        </div>
                        <div className="text-right">
                             <button type="button" onClick={() => { setView('forgot-password'); setError(''); }} className="text-xs text-slate-400 hover:text-yellow-400 transition-colors">
                                Forgot Password?
                            </button>
                        </div>
                        <button type="submit" className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg text-lg hover:bg-yellow-400 transition-colors">Login</button>
                    </form>
                ) : (
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="signup-username" className="sr-only">Username</label>
                            <input id="signup-username" type="text" placeholder="Username" value={signupUsername} onChange={e => setSignupUsername(e.target.value)} className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                        </div>
                        <div>
                            <label htmlFor="signup-email" className="sr-only">Email</label>
                            <input id="signup-email" type="email" placeholder="Email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                        </div>
                        <div className="relative">
                            <label htmlFor="signup-password" className="sr-only">Password</label>
                            <input id="signup-password" type={signupPassVisible ? 'text' : 'password'} placeholder="Password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <button type="button" onClick={() => setSignupPassVisible(!signupPassVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200" aria-label="Toggle password visibility">
                                {signupPassVisible ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                            </button>
                        </div>
                         <div className="relative">
                            <label htmlFor="signup-confirm-password" className="sr-only">Confirm Password</label>
                            <input id="signup-confirm-password" type={signupConfirmPassVisible ? 'text' : 'password'} placeholder="Confirm Password" value={signupConfirmPassword} onChange={e => setSignupConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-800/70 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                             <button type="button" onClick={() => setSignupConfirmPassVisible(!signupConfirmPassVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200" aria-label="Toggle confirm password visibility">
                                {signupConfirmPassVisible ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                            </button>
                        </div>
                        <button type="submit" className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg text-lg hover:bg-yellow-400 transition-colors">Sign Up</button>
                    </form>
                )}
                 <div className="text-center mt-6">
                    <button onClick={onShowAdminLogin} className="text-xs text-slate-400 hover:text-yellow-400 transition-colors">
                        Login as Administrator
                    </button>
                </div>
            </div>
        )
    }


    return (
        <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in px-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="relative z-10 w-full max-w-md p-8 bg-[#1F222A]/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full transition-colors">
                    <XIcon className="w-6 h-6" />
                </button>
                {renderContent()}
            </div>
        </div>
    );
};

export default AuthModal;
