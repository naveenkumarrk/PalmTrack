import { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import ProcessingStageUpdate from './ProcessingStageUpdate';

export default function ProcessingForm() {
  const [neeraList, setNeeraList] = useState([]);
  const [usedNeeraIds, setUsedNeeraIds] = useState([]);
  const [form, setForm] = useState({ batchId: '', neeraRef: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNeeraAndBatches = async () => {
      try {
        const [neeraRes, batchRes] = await Promise.all([
          axios.get('/neera'),
          axios.get('/processing/all')
        ]);
        const allNeera = neeraRes.data;
        const usedNeera = batchRes.data.map(batch => batch.neeraRef?._id || batch.neeraRef);
        setUsedNeeraIds(usedNeera);
        const filteredNeera = allNeera.filter(neera => !usedNeera.includes(neera._id));
        setNeeraList(filteredNeera);
      } catch (err) {
        console.error('Error fetching data:', err);
        setNeeraList([]);
      }
    };
    fetchNeeraAndBatches();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/processing', form);
      setMessage('✅ Batch created successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage('Error: ' + err.response?.data?.error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen ">
      {/* Form Panel */}
      <div className="w-full md:w-3/5 bg-white p-8 mt-5">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-200 pb-3">
          <span className="mr-2">⚙️</span>
          Create Processing Batch
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
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Batch ID
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-800"
              name="batchId"
              placeholder="Enter batch identifier"
              value={form.batchId}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Neera Source
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-800 appearance-none"
              name="neeraRef"
              value={form.neeraRef}
              onChange={handleChange}
              required
            >
              <option value="">Select Neera Entry</option>
              {neeraList.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.batchId} - {item.supplierName}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
          >
            Initialize Processing
          </button>
        </form>
        <ProcessingStageUpdate />
      </div>
      
      {/* Instructions Panel */}
      <div className="w-full md:w-3/5 bg-gray-100 p-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Processing Instructions
          </h3>
          
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              <span className="font-semibold text-gray-700">Step 1:</span> Enter a unique batch ID to identify this processing batch.
            </p>
            <p>
              <span className="font-semibold text-gray-700">Step 2:</span> Select an available Neera entry from the dropdown list.
            </p>
            <p>
              <span className="font-semibold text-gray-700">Step 3:</span> Submit the form to create a new processing batch.
            </p>
            <p>
              <span className="font-semibold text-gray-700">Step 4:</span> After creation, you can update the processing stages below.
            </p>
          </div>
          </div>
          
  
        <div className="mt-10 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Stage Update Guidelines
          </h3>
          
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              <span className="font-semibold text-gray-700">Stage Selection:</span> Choose the appropriate processing stage that is being updated:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-medium">Boiling</span> - Initial heating process (95-100°C)</li>
              <li><span className="font-medium">Crystallization</span> - Cooling and formation of sugar crystals</li>
              <li><span className="font-medium">Drying</span> - Moisture reduction process</li>
              <li><span className="font-medium">Packing</span> - Final product preparation</li>
            </ul>
            
            <p className="pt-2">
              <span className="font-semibold text-gray-700">Timing:</span> Record precise start and end times for process traceability and quality control.
            </p>
            
            <p>
              <span className="font-semibold text-gray-700">Measurements:</span> Enter accurate temperature and volume measurements for production analytics.
            </p>
            
            <p>
              <span className="font-semibold text-gray-700">Notes:</span> Document any anomalies, adjustments, or special observations during the process.
            </p>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-700 mb-3">Processing Stage Guidelines</h4>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left pb-2 font-medium">Stage</th>
                    <th className="text-left pb-2 font-medium">Temp. Range</th>
                    <th className="text-left pb-2 font-medium">Expected Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2">Boiling</td>
                    <td className="py-2">95-100°C</td>
                    <td className="py-2">2-3 hours</td>
                  </tr>
                  <tr>
                    <td className="py-2">Crystallization</td>
                    <td className="py-2">70-80°C</td>
                    <td className="py-2">4-6 hours</td>
                  </tr>
                  <tr>
                    <td className="py-2">Drying</td>
                    <td className="py-2">50-60°C</td>
                    <td className="py-2">8-12 hours</td>
                  </tr>
                  <tr>
                    <td className="py-2">Packing</td>
                    <td className="py-2">Room temp.</td>
                    <td className="py-2">1-2 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
        </div>
  );
}