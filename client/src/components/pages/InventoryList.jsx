import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { ClipboardList, Search, Filter, Package, Calendar, Database } from 'lucide-react';

export default function InventoryList() {
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('/inventory')
      .then((res) => {
        setInventory(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredData = inventory.filter((item) => {
    return (
      (!filter || item.productType === filter) &&
      (!search || item.batchId.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // Helper function to determine background color based on quality grade
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'bg-green-50 text-green-700';
      case 'B': return 'bg-blue-50 text-blue-700';
      case 'C': return 'bg-yellow-50 text-yellow-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  // Helper function to determine expiration status
  const getExpirationStatus = (date) => {
    if (!date) return { className: '', text: 'N/A' };
    
    const expiryDate = new Date(date);
    const today = new Date();
    const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysToExpiry < 0) {
      return { className: 'text-red-600 font-medium', text: 'Expired' };
    } else if (daysToExpiry < 30) {
      return { className: 'text-amber-600 font-medium', text: `${date.split('T')[0]} (${daysToExpiry} days)` };
    } else {
      return { className: 'text-green-600', text: date.split('T')[0] };
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center mb-6">
          <ClipboardList className="text-gray-700 mr-2" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Inventory List</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex items-center md:w-1/3 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-gray-700 focus-within:border-transparent">
            <Filter size={18} className="text-gray-500 mr-2" />
            <select
              className="w-full bg-transparent border-none focus:outline-none text-gray-700"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Product Types</option>
              <option value="Jaggery Powder">Jaggery Powder</option>
              <option value="Jaggery Block">Jaggery Block</option>
              <option value="Liquid Sugar">Liquid Sugar</option>
            </select>
          </div>

          <div className="flex items-center flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-gray-700 focus-within:border-transparent">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              className="w-full bg-transparent border-none focus:outline-none text-gray-700"
              placeholder="Search by Batch ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
            </div>
          ) : (
            <>
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 font-medium border-b">Batch ID</th>
                    <th className="px-4 py-3 font-medium border-b">Product</th>
                    <th className="px-4 py-3 font-medium border-b">Net Weight</th>
                    <th className="px-4 py-3 font-medium border-b">Units</th>
                    <th className="px-4 py-3 font-medium border-b">Packaging</th>
                    <th className="px-4 py-3 font-medium border-b">Location</th>
                    <th className="px-4 py-3 font-medium border-b">Grade</th>
                    <th className="px-4 py-3 font-medium border-b">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => {
                    const expiration = getExpirationStatus(item.expirationDate);
                    return (
                      <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">{item.batchId}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Package size={16} className="text-gray-500 mr-2" />
                            <span>{item.productType}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{item.netWeightKg} kg</td>
                        <td className="px-4 py-3">{item.unitsPacked}</td>
                        <td className="px-4 py-3">{item.packagingType}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Database size={16} className="text-gray-500 mr-2" />
                            <span>{item.storageLocation}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(item.qualityGrade)}`}>
                            Grade {item.qualityGrade}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Calendar size={16} className="text-gray-500 mr-2" />
                            <span className={expiration.className}>{expiration.text}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredData.length === 0 && (
                <div className="text-gray-500 bg-gray-50 p-10 text-center rounded-md my-4">
                  <Package size={40} className="mx-auto mb-2 text-gray-400" />
                  <p>No matching inventory records found.</p>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
          <span>Total items: {filteredData.length}</span>
          {filteredData.length > 0 && (
            <span>Total weight: {filteredData.reduce((sum, item) => sum + Number(item.netWeightKg), 0).toFixed(2)} kg</span>
          )}
        </div>
      </div>
    </div>
  );
}