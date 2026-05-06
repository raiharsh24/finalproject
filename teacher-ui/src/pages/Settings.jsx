import React, { useState } from 'react';
import Button from '../components/Button';
import Switch from '../components/Switch';
import Modal from '../components/Modal';
import { toast } from '../components/Toast';

export default function Settings() {
  const [profile, setProfile] = useState({ name: 'Anastasiia K', email: 'ana@example.com', subject: '', bio: '' });
  const [notifications, setNotifications] = useState({ email: true, push: false });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const handleProfileSave = () => {
    toast('Profile updated');
  };

  const handlePasswordSave = () => {
    if (password.new !== password.confirm) {
      toast('Passwords do not match');
      return;
    }
    toast('Password changed');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile */}
        <div className="bg-card-bg rounded-lg shadow p-6">
          <h2 className="text-xl font-medium mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <input placeholder="Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full border rounded p-2" />
            <input placeholder="Email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="w-full border rounded p-2" />
            <input placeholder="Subject" value={profile.subject} onChange={e => setProfile({ ...profile, subject: e.target.value })} className="w-full border rounded p-2" />
            <textarea placeholder="Bio" value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} className="w-full border rounded p-2" rows={4} />
            {/* Avatar upload placeholder */}
            <div className="flex items-center space-x-2">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white">{profile.name.split(' ')[0][0]}</div>
              <Button variant="secondary">Upload Avatar</Button>
            </div>
            <Button variant="primary" onClick={handleProfileSave}>Save Profile</Button>
          </div>
        </div>
        {/* Notifications & Password */}
        <div className="space-y-8">
          <div className="bg-card-bg rounded-lg shadow p-6">
            <h2 className="text-xl font-medium mb-4">Notification Preferences</h2>
            <div className="flex items-center justify-between mb-2">
              <span>Email notifications</span>
              <Switch checked={notifications.email} onChange={val => setNotifications({ ...notifications, email: val })} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Push notifications</span>
              <Switch checked={notifications.push} onChange={val => setNotifications({ ...notifications, push: val })} />
            </div>
          </div>
          <div className="bg-card-bg rounded-lg shadow p-6">
            <h2 className="text-xl font-medium mb-4">Change Password</h2>
            <div className="space-y-3">
              <input type="password" placeholder="Current password" value={password.current} onChange={e => setPassword({ ...password, current: e.target.value })} className="w-full border rounded p-2" />
              <input type="password" placeholder="New password" value={password.new} onChange={e => setPassword({ ...password, new: e.target.value })} className="w-full border rounded p-2" />
              <input type="password" placeholder="Confirm new password" value={password.confirm} onChange={e => setPassword({ ...password, confirm: e.target.value })} className="w-full border rounded p-2" />
              <Button variant="primary" onClick={handlePasswordSave}>Change Password</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
