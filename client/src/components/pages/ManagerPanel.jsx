import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import ChatbotInterface from './../ChatbotInterface';
import { CheckCircle, ClipboardList, Users, AlertCircle, Loader } from 'lucide-react';

export default function ManagerPanel() {
  const [batches, setBatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('batches');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (activeTab === 'batches') {
        const batchRes = await axios.get('/processing/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched batches:', batchRes.data);
        setBatches(batchRes.data);
      } else if (activeTab === 'users') {
        // Since there's no dedicated endpoint for unverified users yet,
        // fetch all users and filter on the client side
        const userRes = await axios.get('/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Filter to only show unverified users
        const unverifiedUsers = userRes.data.filter(user => user.isVerified === false);
        console.log('Filtered unverified users:', unverifiedUsers);
        setUsers(unverifiedUsers);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setMessage(`Error fetching data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (batchId) => {
    const token = localStorage.getItem('token');
    setMessage('');

    try {
      await axios.patch(`/processing/${batchId}/complete`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setMessage(`Batch ${batchId} marked as completed`);
      setBatches((prev) =>
        prev.map((b) =>
          b.batchId === batchId ? { ...b, isCompleted: true } : b
        )
      );
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleVerifyUser = async (userId) => {
    const token = localStorage.getItem('token');
    setMessage('');

    try {
      await axios.patch(`/auth/verify/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setMessage(`User verified successfully`);
      setUsers((prev) => prev.filter(user => user._id !== userId));
      fetchData();
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg ">
      <div className="flex flex-col md:flex-row">
        {/* Manager Panel Section */}
        <div className="md:w-3/5 p-6">
          <div className="flex items-center mb-6">
            <ClipboardList className="text-gray-700 mr-2" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Manager Panel</h2>
          </div>
          
          {message && (
            <div className={`p-4 mb-6 rounded-md flex items-center ${message.includes('Error') ? 'bg-gray-50 border-l-4 border-red-500 text-red-700' : 'bg-gray-50 border-l-4 border-green-500 text-green-700'}`}>
              {message.includes('Error') ? (
                <AlertCircle className="mr-2" size={20} />
              ) : (
                <CheckCircle className="mr-2" size={20} />
              )}
              {message}
            </div>
          )}

          <div className="flex border-b border-gray-200 mb-6">
            <button 
              className={`py-3 px-5 transition-all ${activeTab === 'users' ? 'border-b-2 border-gray-800 font-medium text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('users')}
            >
              <div className="flex items-center">
                <Users size={18} className="mr-2" />
                Pending Verifications
              </div>
            </button>
            <button 
              className={`py-3 px-5 transition-all ${activeTab === 'batches' ? 'border-b-2 border-gray-800 font-medium text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('batches')}
            >
              <div className="flex items-center">
                <ClipboardList size={18} className="mr-2" />
                Processing Batches
              </div>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="animate-spin h-8 w-8 text-gray-700" />
            </div>
          ) : (
            <>
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Unverified Users</h3>
                  {users.length === 0 ? (
                    <div className="text-gray-500 bg-gray-50 p-6 rounded-md text-center">
                      No pending user verifications.
                    </div>
                  ) : (
                    users.map((user) => (
                      <div key={user._id} className="border border-gray-100 rounded-lg p-5 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{user.name || user.username}</h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600">Role: <span className="font-medium">{user.role}</span></p>
                            <p className="text-sm text-gray-600">Email: <span className="font-medium">{user.email}</span></p>
                            {user.createdAt && (
                              <p className="text-sm text-gray-600">Registration: <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span></p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleVerifyUser(user._id)}
                          className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-5 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
                        >
                          Verify
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'batches' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Processing Batches</h3>
                  {batches.length === 0 ? (
                    <div className="text-gray-500 bg-gray-50 p-6 rounded-md text-center">
                      No batches available.
                    </div>
                  ) : (
                    batches.map((batch) => (
                      <div key={batch._id} className="border border-gray-100 rounded-lg p-5 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{batch.batchId}</h3>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">Stage:</span>
                              <span className="font-medium px-3 py-1 bg-gray-100 rounded-full text-xs">{batch.currentStage}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">Status:</span>
                              {batch.isCompleted ? (
                                <span className="flex items-center font-medium text-green-600">
                                  <CheckCircle size={14} className="mr-1" /> Completed
                                </span>
                              ) : (
                                <span className="flex items-center font-medium text-amber-600">
                                  <Loader size={14} className="mr-1 animate-spin" /> In Progress
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {!batch.isCompleted && (
                          <button
                            onClick={() => handleComplete(batch.batchId)}
                            className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-5 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Chatbot Interface Section */}
        <div className="md:w-2/5 bg-gray-50 p-6 border-l border-gray-100">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Assistant</h3>
            <p className="text-sm text-gray-600 mt-1">Get help with managing tasks and operations</p>
          </div>
          <div className="h-full">
            <ChatbotInterface />
          </div>
        </div>
      </div>
    </div>
  );
}