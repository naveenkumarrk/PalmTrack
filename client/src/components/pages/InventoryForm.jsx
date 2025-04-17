import { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Package, Info, HelpCircle } from 'lucide-react';

export default function InventoryForm() {
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({
    batchId: '',
    productType: 'Jaggery Powder',
    netWeightKg: '',
    unitsPacked: '',
    packagingType: '',
    storageLocation: '',
    qualityGrade: '',
    expirationDate: '',
    processingBatchRef: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found');
      setMessage('Please log in to access this page.');
      setMessageType('error');
      return;
    }
  
    axios.get('/processing/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then((res) => {
      console.log('Fetched batches:', res.data);
      const availableBatches = res.data.filter(b => b.isCompleted && !b.addedToInventory);
      console.log('Available Batches:', availableBatches);
      setBatches(availableBatches);
    })
    .catch((err) => {
      console.error('Failed to fetch batches:', err);
      setMessage('Error fetching batches. Please try again later.');
      setMessageType('error');
      setBatches([]);
    });
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleProcessingBatchSelect = (e) => {
    const selectedBatchId = e.target.value;
    
    const selectedBatch = batches.find(batch => batch._id === selectedBatchId);
    
    if (selectedBatch) {
      const inventoryBatchId = `INV-${selectedBatch.batchId}-${Date.now().toString().slice(-6)}`;
      
      setForm({
        ...form,
        processingBatchRef: selectedBatchId,
        batchId: inventoryBatchId
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found');
      setMessage('Please log in to access this page.');
      setMessageType('error');
      return;
    }

    // Format data before sending
    const formattedData = {
      ...form,
      netWeightKg: parseFloat(form.netWeightKg),
      unitsPacked: parseInt(form.unitsPacked, 10),
      expirationDate: form.expirationDate ? new Date(form.expirationDate).toISOString() : undefined
    };

    console.log('Submitting inventory data:', formattedData);

    try {
      // First, save the inventory
      const response = await axios.post('/inventory', formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      console.log('Inventory submission response:', response.data);
      
      try {
        // Then try to update the processing batch
        await axios.put(`/processing/${form.processingBatchRef}/inventory-status`, 
          { addedToInventory: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        
        setMessage('✅ Inventory recorded and processing batch updated!');
        setMessageType('success');
      } catch (updateErr) {
        console.error('Failed to update processing batch status:', updateErr);
        setMessage('✅ Inventory recorded! Note: Failed to mark processing batch as used. Please contact admin.');
        setMessageType('warning');
      }
      
      // Navigate after a short delay regardless of the update result
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Error details:', err.response?.data || err);
      setMessage('Error: ' + (err.response?.data?.error || err.message));
      setMessageType('error');
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-white min-h-screen">
      {/* Form Column */}
      <div className="w-full md:w-3/5 p-6 border-r border-gray-200">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center mb-8">
            <Package className="mr-3 text-gray-700" size={22} />
            <h2 className="text-2xl font-medium text-gray-800">Add Inventory</h2>
          </div>
          
          {message && (
            <div className={`p-4 mb-6 rounded-md shadow-sm flex items-center ${
              messageType === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 
              messageType === 'warning' ? 'bg-amber-50 text-amber-800 border-l-4 border-amber-500' : 
              'bg-red-50 text-red-800 border-l-4 border-red-500'
            }`}>
              <AlertCircle className="mr-2" size={18} />
              <p className="text-sm">{message}</p>
            </div>
          )}
          
          {batches.length === 0 && (
            <div className="p-4 mb-6 rounded-md bg-amber-50 border-l-4 border-amber-400 text-amber-800 flex items-center shadow-sm">
              <Info className="mr-2" size={18} />
              <p className="text-sm">No completed batches available for inventory. All completed batches have already been added to inventory.</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Processing Batch</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 bg-white shadow-sm"
                name="processingBatchRef"
                value={form.processingBatchRef} 
                onChange={handleProcessingBatchSelect}
                required
                disabled={batches.length === 0}
              >
                <option value="">Select Completed Batch</option>
                {batches.length > 0 ? (
                  batches.map(batch => (
                    <option key={batch._id} value={batch._id}>
                      {batch.batchId} - {batch._id.substring(0, 8)}...
                    </option>
                  ))
                ) : (
                  <option>No batches available for inventory</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Batch ID</label>
              <input 
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:outline-none text-gray-600 shadow-sm"
                name="batchId" 
                placeholder="Inventory Batch ID" 
                value={form.batchId} 
                onChange={handleChange}
                readOnly 
                required 
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 bg-white shadow-sm"
                name="productType" 
                value={form.productType} 
                onChange={handleChange}
                disabled={batches.length === 0}
              >
                <option>Jaggery Powder</option>
                <option>Jaggery Block</option>
                <option>Liquid Sugar</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Net Weight (Kg)</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 shadow-sm"
                  name="netWeightKg" 
                  type="number"
                  step="0.01"
                  placeholder="Net Weight (Kg)" 
                  value={form.netWeightKg} 
                  onChange={handleChange} 
                  required 
                  disabled={batches.length === 0}
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Units Packed</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 shadow-sm"
                  name="unitsPacked" 
                  type="number"
                  placeholder="Units Packed" 
                  value={form.unitsPacked} 
                  onChange={handleChange} 
                  required 
                  disabled={batches.length === 0}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Packaging Type</label>
              <input 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 shadow-sm"
                name="packagingType" 
                placeholder="e.g., Paper Bags, Plastic, Glass Jars" 
                value={form.packagingType} 
                onChange={handleChange} 
                disabled={batches.length === 0}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 shadow-sm"
                  name="storageLocation" 
                  placeholder="Warehouse Location" 
                  value={form.storageLocation} 
                  onChange={handleChange} 
                  disabled={batches.length === 0}
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quality Grade</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 shadow-sm"
                  name="qualityGrade" 
                  placeholder="A, B, Premium, etc." 
                  value={form.qualityGrade} 
                  onChange={handleChange} 
                  disabled={batches.length === 0}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
              <input 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 shadow-sm"
                type="date" 
                name="expirationDate" 
                value={form.expirationDate} 
                onChange={handleChange} 
                disabled={batches.length === 0}
              />
            </div>

            <button 
              className={`mt-6 px-6 py-2 rounded-md font-medium text-white shadow-md transition-all duration-200 ${
                batches.length === 0 || !form.processingBatchRef
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-800 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
              }`}
              type="submit"
              disabled={batches.length === 0 || !form.processingBatchRef}
            >
              Submit Inventory
            </button>
          </form>
        </div>
      </div>
      
      {/* Instructions Panel */}
      <div className="w-full md:w-2/5 p-6 bg-gray-50">
        <div className="sticky top-6">
          <div className="flex items-center mb-6">
            <HelpCircle className="mr-2 text-gray-700" size={20} />
            <h3 className="text-xl font-medium text-gray-800">Instructions</h3>
          </div>
          
          <div className="rounded-md bg-white p-5 border-l-4 border-gray-600 mb-6 shadow-sm">
            <h4 className="font-medium text-lg text-gray-800 mb-3">Adding New Inventory</h4>
            <ol className="space-y-3 text-gray-600">
              <li className="flex">
                <span className="bg-gray-100 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center mr-2 shrink-0 border border-gray-300">1</span>
                <span>Select a completed processing batch from the dropdown menu.</span>
              </li>
              <li className="flex">
                <span className="bg-gray-100 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center mr-2 shrink-0 border border-gray-300">2</span>
                <span>The Inventory Batch ID will be automatically generated.</span>
              </li>
              <li className="flex">
                <span className="bg-gray-100 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center mr-2 shrink-0 border border-gray-300">3</span>
                <span>Select the product type from the dropdown.</span>
              </li>
              <li className="flex">
                <span className="bg-gray-100 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center mr-2 shrink-0 border border-gray-300">4</span>
                <span>Enter the total weight in kilograms and the number of units packed.</span>
              </li>
              <li className="flex">
                <span className="bg-gray-100 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center mr-2 shrink-0 border border-gray-300">5</span>
                <span>Fill in the remaining details and submit the form.</span>
              </li>
            </ol>
          </div>
          
          <div className="rounded-md bg-white p-5 mb-6 shadow-sm">
            <h4 className="font-medium text-lg text-gray-800 mb-3">Field Descriptions</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <div className="bg-gray-100 p-1 rounded mr-2 shrink-0 border border-gray-200">
                  <span className="text-gray-700 text-sm font-medium">Net Weight</span>
                </div>
                <span>Total weight of the product in kilograms.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-100 p-1 rounded mr-2 shrink-0 border border-gray-200">
                  <span className="text-gray-700 text-sm font-medium">Units Packed</span>
                </div>
                <span>Number of individual packages or containers.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-100 p-1 rounded mr-2 shrink-0 border border-gray-200">
                  <span className="text-gray-700 text-sm font-medium">Packaging</span>
                </div>
                <span>Type of packaging used (bags, jars, etc.).</span>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-100 p-1 rounded mr-2 shrink-0 border border-gray-200">
                  <span className="text-gray-700 text-sm font-medium">Quality Grade</span>
                </div>
                <span>Assigned quality rating for the product.</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
            <div className="flex items-center mb-2">
              <Info size={18} className="text-gray-700 mr-2" />
              <h4 className="font-medium text-gray-800">Note</h4>
            </div>
            <p className="text-gray-600 text-sm">Once a batch is added to inventory, it cannot be modified through this form. For any corrections, please contact your system administrator.</p>
          </div>
        </div>
      </div>
    </div>
  );
}