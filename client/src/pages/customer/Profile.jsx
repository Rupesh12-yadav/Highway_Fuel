import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', form);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/change-password', pwForm);
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="card mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Personal Information</h2>
        <form onSubmit={handleProfile} className="space-y-4">
          <div><label className="label">Full Name</label>
            <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label className="label">Email</label>
            <input className="input" value={user?.email} disabled className="input bg-gray-50 cursor-not-allowed" /></div>
          <div><label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          <div><label className="label">Role</label>
            <span className="inline-block bg-primary-light text-primary text-sm px-3 py-1 rounded-full capitalize">{user?.role}</span></div>
          <Button type="submit" loading={loading}>Update Profile</Button>
        </form>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-4">Change Password</h2>
        <form onSubmit={handlePassword} className="space-y-4">
          <div><label className="label">Current Password</label>
            <input type="password" className="input" required value={pwForm.currentPassword}
              onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} /></div>
          <div><label className="label">New Password</label>
            <input type="password" className="input" required value={pwForm.newPassword}
              onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} /></div>
          <Button type="submit" loading={loading} variant="secondary">Change Password</Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
