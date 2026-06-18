import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Registered successfully!');
      const role = result.payload.user.role;
      navigate(role === 'dealer' ? '/dealer' : '/');
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card shadow-lg">
          <div className="text-center mb-6">
            <span className="text-4xl">⛽</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join HighwayFuel today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="Your name" required value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="Email address" required value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" placeholder="10-digit phone" value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="Min. 6 characters" required value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div>
              <label className="label">Register As</label>
              <select className="input" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="customer">Customer</option>
                <option value="dealer">Dealer (Petrol Pump Owner)</option>
              </select>
            </div>
            <Button className="w-full justify-center" loading={loading} type="submit">Create Account</Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
