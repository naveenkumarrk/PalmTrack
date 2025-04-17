import { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';

export default function ProcessingStageUpdate() {
  const [form, setForm] = useState({
    batchId: '',
    stage: 'Boiling',
    startTime: '',
    endTime: '',
    temperatureCelsius: '',
    outputLiters: '',
    wastageLiters: '',
    notes: ''
  });

  const [message, setMessage] = useState('');
  const [availableBatches, setAvailableBatches] = useState([]);

  // Fetch uncompleted batches on load
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get('/processing/all');
        const uncompleted = res.data.filter(batch => !batch.stageCompleted && !batch.isCompleted);
        setAvailableBatches(uncompleted);
      } catch (err) {
        console.error('Failed to fetch batches:', err);
      }
    };
    fetchBatches();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/processing/${form.batchId}/stage`, form);
      setMessage('✅ Stage updated successfully!');

      // Remove the updated batch from dropdown
      setAvailableBatches(prev =>
        prev.filter(batch => batch.batchId !== form.batchId)
      );

      // Reset form
      setForm({
        batchId: '',
        stage: 'Boiling',
        startTime: '',
        endTime: '',
        temperatureCelsius: '',
        outputLiters: '',
        wastageLiters: '',
        notes: ''
      });
    } catch (err) {
      setMessage('Error: ' + err.response?.data?.error);
    }
  };

  return (
    <div className="flex bg-gray-50">
      {/* Form Panel */}
      <div className="mt-10 p-5">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-200 pb-3">
          <span className="mr-2">🧪</span>
          Update Processing Stage
        </h2>
        
        {message && (
          <div className={`p-3 mb-4 rounded text-sm font-medium ${
            message.includes('Error') 
              ? 'bg-red-50 text-red-700' 
              : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Batch Selection
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-800"
              name="batchId"
              value={form.batchId}
              onChange={handleChange}
              required
            >
              <option value="">Select Batch ID</option>
              {availableBatches.map((batch) => (
                <option key={batch._id} value={batch.batchId}>
                  {batch.batchId} - {batch.neeraRef?.supplierName || 'Unknown Supplier'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Processing Stage
            </label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-800"
              name="stage" 
              value={form.stage} 
              onChange={handleChange}
            >
              <option>Boiling</option>
              <option>Crystallization</option>
              <option>Drying</option>
              <option>Packing</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-800" 
                type="datetime-local" 
                name="startTime" 
                value={form.startTime} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-800" 
                type="datetime-local" 
                name="endTime" 
                value={form.endTime} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Temperature (°C)
              </label>
              <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-800" 
                type="number" 
                name="temperatureCelsius" 
                placeholder="e.g. 95" 
                value={form.temperatureCelsius} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Output (L)
              </label>
              <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-800" 
                type="number" 
                name="outputLiters" 
                placeholder="e.g. 75" 
                value={form.outputLiters} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Wastage (L)
              </label>
              <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-800" 
                type="number" 
                name="wastageLiters" 
                placeholder="e.g. 5" 
                value={form.wastageLiters} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Process Notes
            </label>
            <textarea 
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-800 h-24" 
              name="notes" 
              placeholder="Enter any observations or special notes about this process stage" 
              value={form.notes} 
              onChange={handleChange}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
          >
            Submit Stage Update
          </button>
        </form>
      </div>
      
      {/* Instructions Panel */}
     
    </div>
  );
}