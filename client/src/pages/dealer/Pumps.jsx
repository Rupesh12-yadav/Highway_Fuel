import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyPumps } from '../../redux/slices/pumpSlice';
import { pumpService } from '../../services/pumpService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { FUEL_TYPES } from '../../utils/constants';

const initialForm = { pumpName: '', highway: '', city: '', address: '', latitude: '', longitude: '',
  fuelTypes: [{ type: 'petrol', pricePerLitre: '', available: true }] };

const DealerPumps = () => {
  const dispatch = useDispatch();
  const { myPumps, loading } = useSelector(s => s.pumps);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(fetchMyPumps()); }, []);

  const addFuelType = () => setForm({ ...form, fuelTypes: [...form.fuelTypes, { type: 'diesel', pricePerLitre: '', available: true }] });
  const updateFuel = (i, key, val) => {
    const fuelTypes = [...form.fuelTypes];
    fuelTypes[i] = { ...fuelTypes[i], [key]: val };
    setForm({ ...form, fuelTypes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await pumpService.create(form);
      toast.success('Pump registered! Pending admin approval.');
      setModal(false);
      setForm(initialForm);
      dispatch(fetchMyPumps());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Pumps</h1>
        <Button onClick={() => setModal(true)}>+ Add Pump</Button>
      </div>

      {loading ? <Loader /> : myPumps.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-3">⛽</span>
          <p>No pumps registered yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myPumps.map(pump => (
            <div key={pump._id} className="card">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">{pump.pumpName}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${pump.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {pump.isApproved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">{pump.city} • {pump.highway}</p>
              <p className="text-gray-600 text-sm mt-1">{pump.address}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {pump.fuelTypes?.map(f => (
                  <span key={f.type} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {f.type.toUpperCase()} ₹{f.pricePerLitre}/L
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Register New Pump">
        <form onSubmit={handleSubmit} className="space-y-3">
          {[['pumpName','Pump Name'],['highway','Highway (e.g. NH48)'],['city','City'],['address','Full Address']].map(([k, l]) => (
            <div key={k}><label className="label">{l}</label>
              <input className="input" required value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})} /></div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Latitude</label>
              <input type="number" step="any" className="input" value={form.latitude} onChange={e => setForm({...form, latitude: e.target.value})} /></div>
            <div><label className="label">Longitude</label>
              <input type="number" step="any" className="input" value={form.longitude} onChange={e => setForm({...form, longitude: e.target.value})} /></div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label mb-0">Fuel Types</label>
              <button type="button" onClick={addFuelType} className="text-xs text-primary hover:underline">+ Add</button>
            </div>
            {form.fuelTypes.map((ft, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <select className="input w-32" value={ft.type} onChange={e => updateFuel(i, 'type', e.target.value)}>
                  {FUEL_TYPES.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                </select>
                <input type="number" className="input flex-1" placeholder="Price/L" value={ft.pricePerLitre}
                  onChange={e => updateFuel(i, 'pricePerLitre', e.target.value)} />
              </div>
            ))}
          </div>
          <Button type="submit" loading={saving} className="w-full justify-center">Submit for Approval</Button>
        </form>
      </Modal>
    </div>
  );
};

export default DealerPumps;
