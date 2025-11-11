import React, { useState, useEffect, useRef } from 'react';
import { User, UserProfileUpdateData } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';

interface ProfileSettingsProps {
    user: User | null;
    onSave: (data: UserProfileUpdateData) => Promise<boolean>;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onSave }) => {
    const [username, setUsername] = useState('');
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    const [currentPassVisible, setCurrentPassVisible] = useState(false);
    const [newPassVisible, setNewPassVisible] = useState(false);
    const [confirmPassVisible, setConfirmPassVisible] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setProfileImagePreview(user.profileImageUrl || null);
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        
        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: "New passwords do not match." });
            return;
        }

        if (newPassword && !currentPassword) {
            setMessage({ type: 'error', text: "Please enter your current password to set a new one."});
            return;
        }

        setIsSaving(true);
        const success = await onSave({
            username,
            profileImageFile,
            currentPassword: currentPassword || undefined,
            newPassword: newPassword || undefined,
        });
        setIsSaving(false);

        if (success) {
            setMessage({ type: 'success', text: "Profile updated successfully!" });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setProfileImageFile(null);
            setTimeout(() => setMessage(null), 3000);
        } else {
            // Error message is handled in the App component via an alert
            setMessage({ type: 'error', text: "Failed to update profile. Please check your current password." });
        }
    }
    
  return (
    <form onSubmit={handleSave} className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
                <img 
                    src={profileImagePreview || `https://i.pravatar.cc/150?u=${user?.email}`} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-300 dark:border-slate-600"
                />
                <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Change profile picture"
                >
                    <CameraIcon className="w-8 h-8 text-white"/>
                </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
        <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Username</label>
            <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                className="mt-1 block w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-slate-900 dark:text-white" 
            />
        </div>

        <fieldset className="space-y-4 border-t border-slate-300 dark:border-slate-700 pt-4">
            <legend className="text-sm font-medium text-slate-600 dark:text-slate-300">Change Password</legend>
            <div className="relative">
                <label htmlFor="current-password" className="sr-only">Current Password</label>
                <input 
                    type={currentPassVisible ? 'text' : 'password'} 
                    id="current-password" 
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="block w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-slate-900 dark:text-white" 
                />
                <button type="button" onClick={() => setCurrentPassVisible(!currentPassVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200" aria-label="Toggle current password visibility">
                    {currentPassVisible ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                </button>
            </div>
             <div className="relative">
                <label htmlFor="new-password" className="sr-only">New Password</label>
                <input 
                    type={newPassVisible ? 'text' : 'password'} 
                    id="new-password" 
                    placeholder="New Password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="block w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-slate-900 dark:text-white" 
                />
                 <button type="button" onClick={() => setNewPassVisible(!newPassVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200" aria-label="Toggle new password visibility">
                    {newPassVisible ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                </button>
            </div>
             <div className="relative">
                <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
                <input 
                    type={confirmPassVisible ? 'text' : 'password'} 
                    id="confirm-password" 
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="block w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-slate-900 dark:text-white" 
                />
                 <button type="button" onClick={() => setConfirmPassVisible(!confirmPassVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200" aria-label="Toggle confirm password visibility">
                    {confirmPassVisible ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                </button>
            </div>
        </fieldset>
        
        {message && (
            <p className={`text-sm text-center ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {message.text}
            </p>
        )}

        <button 
            type="submit" 
            disabled={isSaving}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-400/50 disabled:cursor-not-allowed transition-colors duration-200"
        >
           {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
    </form>
  );
};