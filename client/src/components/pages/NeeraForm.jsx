import { useState } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle, AlertCircle, Droplet } from 'lucide-react';

export default function NeeraForm() {
  const [form, setForm] = useState({
    supplierName: '',
    collectionDate: new Date().toISOString().split('T')[0],
    batchId: '',
    quantityLiters: '',
    collectionMethod: '',
    storageTank: '',
    temperatureCelsius: '',
    notes: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!form.supplierName.trim()) {
      setError('Supplier name is required');
      return false;
    }
    if (!form.batchId.trim()) {
      setError('Batch ID is required');
      return false;
    }
    if (!form.quantityLiters || isNaN(form.quantityLiters) || form.quantityLiters <= 0) {
      setError('Valid quantity is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting neera data:', form);
      const response = await axios.post('/neera', form);
      console.log('Server response:', response.data);
      
      setSuccess(true);
      setForm({
        supplierName: '',
        collectionDate: new Date().toISOString().split('T')[0],
        batchId: '',
        quantityLiters: '',
        collectionMethod: '',
        storageTank: '',
        temperatureCelsius: '',
        notes: ''
      });

      setTimeout(() => {
        setSuccess(false);
        navigate('/neera/list');
      }, 2000);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.details || err.response?.data?.error || 'Failed to submit entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="md:w-3/5 p-8 border-r border-gray-100">
          <div className="flex items-center mb-6">
            <Droplet className="text-gray-700 mr-2" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Neera Collection</h2>
          </div>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gray-50 border-l-4 border-green-500 p-4 rounded-md mb-6"
              >
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  <p className="text-green-700">Neera submitted successfully! Redirecting...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 border-l-4 border-red-500 p-4 rounded-md mb-6"
            >
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-2" size={20} />
                <p className="text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all"
                  name="supplierName"
                  placeholder="Enter supplier name"
                  value={form.supplierName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection Date *</label>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all"
                  type="date"
                  name="collectionDate"
                  value={form.collectionDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID *</label>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all"
                  name="batchId"
                  placeholder="Enter batch ID"
                  value={form.batchId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Liters) *</label>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all"
                  type="number"
                  name="quantityLiters"
                  placeholder="Enter quantity in liters"
                  value={form.quantityLiters}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection Method</label>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all"
                  name="collectionMethod"
                  placeholder="Enter collection method"
                  value={form.collectionMethod}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Tank</label>
                <input
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all"
                  name="storageTank"
                  placeholder="Enter storage tank"
                  value={form.storageTank}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
              <input
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all"
                type="number"
                name="temperatureCelsius"
                placeholder="Enter temperature in Celsius"
                value={form.temperatureCelsius}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all"
                name="notes"
                placeholder="Enter any additional notes"
                value={form.notes}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <button 
              type="submit" 
              className={`w-full mt-6 px-6 py-3 rounded-md bg-gray-800 text-white font-medium shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Neera Collection'}
            </button>
          </form>
        </div>

        {/* Instructions Panel */}
        <div className="md:w-2/5 bg-gray-50 p-8">
          <div className="flex items-center mb-6">
            <Info className="text-gray-700 mr-2" size={24} />
            <h3 className="text-xl font-semibold text-gray-800">Collection Guidelines</h3>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-gray-300 pl-4">
              <h4 className="font-medium text-gray-800 mb-2">Required Information</h4>
              <p className="text-gray-600 text-sm">
                Fields marked with an asterisk (*) are mandatory. Ensure the supplier name, batch ID, and quantity 
                are accurately recorded.
              </p>
            </div>

            <div className="border-l-4 border-gray-300 pl-4">
              <h4 className="font-medium text-gray-800 mb-2">Batch ID Format</h4>
              <p className="text-gray-600 text-sm">
                Use the format YYYY-MM-DD-XX where XX is the sequential number of collection for that day.
                Example: 2025-04-17-01
              </p>
            </div>

            <div className="border-l-4 border-gray-300 pl-4">
              <h4 className="font-medium text-gray-800 mb-2">Collection Methods</h4>
              <p className="text-gray-600 text-sm">
                Common methods include: Traditional tapping, Mechanized collection, or Hybrid approach. Specify any 
                special techniques used.
              </p>
            </div>

            <div className="border-l-4 border-gray-300 pl-4">
              <h4 className="font-medium text-gray-800 mb-2">Temperature Guidelines</h4>
              <p className="text-gray-600 text-sm">
                Record the temperature at the time of collection. Optimal temperature for neera is between 
                4°C - 8°C to prevent fermentation.
              </p>
            </div>

            <div className="border-l-4 border-gray-300 pl-4">
              <h4 className="font-medium text-gray-800 mb-2">Notes Suggestions</h4>
              <p className="text-gray-600 text-sm">
                Include information about weather conditions, tree health, collection anomalies, or any 
                other relevant observations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}