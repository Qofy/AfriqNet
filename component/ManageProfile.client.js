"use client"

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Camera, Save, Lock, Mail, UserCircle, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ManageProfileClient({ user }) {
  const router = useRouter();
  const [profileUrl, setProfileUrl] = useState(user?.profileImage || null);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const inputRef = useRef(null);

  async function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload/profile", { method: "POST", body: fd });
      const json = await res.json();
      
      if (res.ok && json.url) {
        setProfileUrl(json.url);
        
        // Persist to user record
        await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileUrl: json.url })
        });
        
        setMessage({ type: 'success', text: 'Profile image updated successfully!' });
        setTimeout(() => router.refresh(), 500);
      } else {
        setMessage({ type: 'error', text: json.error || 'Upload failed' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Upload error occurred' });
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });

      const json = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => router.refresh(), 500);
      } else {
        setMessage({ type: 'error', text: json.error || 'Update failed' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const json = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: json.error || 'Password change failed' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE'
      });

      const json = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Account deleted. Redirecting...' });
        setTimeout(() => router.push('/'), 1500);
      } else {
        setMessage({ type: 'error', text: json.error || 'Deletion failed' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 mt-8">
          <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Manage Profile</h1>
          <p className="text-gray-400 mt-2">Update your personal information and settings</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-300' : 'bg-red-500/20 border border-red-500/50 text-red-300'}`}>
            {message.text}
          </div>
        )}

        {/* Profile Image Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Camera size={20} className="text-blue-400" />
            Profile Picture
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="relative h-32 w-32 flex items-center bg-blue-500  justify-center rounded-full overflow-hidden border-4 border-gray-700">
                {profileUrl ? (
                  <Image src={profileUrl} alt="profile" fill className="object-cover" />
                ) : (
                  <User size={64} />
                )}
              </div>
              
              <input 
                ref={inputRef} 
                type="file" 
                accept="image/*" 
                className="sr-only" 
                onChange={handleFileChange}
                disabled={loading}
              />
              
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={loading}
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 p-3 rounded-full transition-colors shadow-lg"
              >
                <Camera size={18} />
              </button>
            </div>
            
            <div className="text-center sm:text-left">
              <h3 className="font-medium mb-1">Change Profile Picture</h3>
              <p className="text-sm text-gray-400 mb-3">Upload a new profile picture (JPG, PNG, GIF)</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
              >
                {loading ? 'Uploading...' : 'Choose File'}
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UserCircle size={20} className="text-blue-400" />
            Personal Information
          </h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <div className="relative">
                <UserCircle size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 transition-all"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lock size={20} className="text-blue-400" />
            Change Password
          </h2>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 transition-all"
                  placeholder="Enter current password"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 transition-all"
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 transition-all"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Lock size={18} />
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Account Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">User ID</span>
              <span className="font-mono">{user.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Member Since</span>
              <span>{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/50">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-400">
            <Trash2 size={20} />
            Danger Zone
          </h2>
          
          <p className="text-gray-300 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <Trash2 size={18} />
            {loading ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
