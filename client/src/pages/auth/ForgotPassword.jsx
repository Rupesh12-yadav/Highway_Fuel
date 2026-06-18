import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('Reset instructions sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h1>
          <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send reset instructions.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="Your email" required
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <Button className="w-full justify-center" loading={loading} type="submit">Send Reset Link</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
