import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Login successful!');
      const role = result.payload.user.role;
      navigate(role === 'admin' ? '/admin' : role === 'dealer' ? '/dealer' : '/');
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card shadow-lg">
          <div className="text-center mb-6">
            <span className="text-4xl">⛽</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="Enter email" required
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="Enter password" required
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link>
            </div>
            <Button className="w-full justify-center" loading={loading} type="submit">Sign In</Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
