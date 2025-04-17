import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function NeeraList() {
  const [neeraList, setNeeraList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNeera, setSelectedNeera] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [editForm, setEditForm] = useState({
    supplierName: '',
    collectionDate: '',
    batchId: '',
    quantityLiters: '',
    collectionMethod: '',
    storageTank: '',
    temperatureCelsius: '',
    notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchNeera();
  }, []);

  const fetchNeera = async () => {
    try {
      const response = await axios.get('/neera');
      setNeeraList(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch neera collections');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/neera/${selectedNeera._id}`);
      setShowDeleteModal(false);
      fetchNeera();
    } catch (err) {
      setError('Failed to delete neera collection');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/neera/${selectedNeera._id}`, editForm);
      setShowEditModal(false);
      fetchNeera();
    } catch (err) {
      setError('Failed to update neera collection');
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const updatedStatus = {
        status: newStatus,
        isCompleted: newStatus === 'Completed' // Automatically set true if completed
      };
  
      await axios.put(`/neera/${selectedNeera._id}/status`, updatedStatus);
      setShowStatusModal(false);
      fetchNeera();
    } catch (err) {
      setError('Failed to update status');
    }
  };
  

  const openEditModal = (neera) => {
    setSelectedNeera(neera);
    setEditForm({
      supplierName: neera.supplierName,
      collectionDate: new Date(neera.collectionDate).toISOString().split('T')[0],
      batchId: neera.batchId,
      quantityLiters: neera.quantityLiters,
      collectionMethod: neera.collectionMethod || '',
      storageTank: neera.storageTank || '',
      temperatureCelsius: neera.temperatureCelsius || '',
      notes: neera.notes || ''
    });
    setShowEditModal(true);
  };

  const openStatusModal = (neera) => {
    setSelectedNeera(neera);
    setNewStatus(neera.status);
    setShowStatusModal(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">📋 Neera Collections</h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity (L)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {neeraList.map((neera) => (
              <motion.tr
                key={neera._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{neera.batchId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{neera.supplierName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(neera.collectionDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{neera.quantityLiters}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openStatusModal(neera)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                      neera.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      neera.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {neera.status}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => openEditModal(neera)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => {
                      setSelectedNeera(neera);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold mb-4">Update Status</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select New Status</label>
                <select
                  className="input w-full"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleStatusUpdate}
                >
                  Update Status
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="mb-4">Are you sure you want to delete this neera collection?</p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-semibold mb-4">Edit Neera Collection</h3>
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
                  <input
                    className="input"
                    name="supplierName"
                    value={editForm.supplierName}
                    onChange={(e) => setEditForm({ ...editForm, supplierName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Collection Date *</label>
                  <input
                    className="input"
                    type="date"
                    name="collectionDate"
                    value={editForm.collectionDate}
                    onChange={(e) => setEditForm({ ...editForm, collectionDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID *</label>
                  <input
                    className="input"
                    name="batchId"
                    value={editForm.batchId}
                    onChange={(e) => setEditForm({ ...editForm, batchId: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Liters) *</label>
                  <input
                    className="input"
                    type="number"
                    name="quantityLiters"
                    value={editForm.quantityLiters}
                    onChange={(e) => setEditForm({ ...editForm, quantityLiters: e.target.value })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Collection Method</label>
                  <input
                    className="input"
                    name="collectionMethod"
                    value={editForm.collectionMethod}
                    onChange={(e) => setEditForm({ ...editForm, collectionMethod: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Tank</label>
                  <input
                    className="input"
                    name="storageTank"
                    value={editForm.storageTank}
                    onChange={(e) => setEditForm({ ...editForm, storageTank: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                  <input
                    className="input"
                    type="number"
                    name="temperatureCelsius"
                    value={editForm.temperatureCelsius}
                    onChange={(e) => setEditForm({ ...editForm, temperatureCelsius: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    className="input"
                    name="notes"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 