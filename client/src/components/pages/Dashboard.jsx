import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Calendar, Clock, Droplet, Package, TrendingUp, AlertCircle } from 'lucide-react';

// Refined color palette for a more sophisticated look
const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];
const STATUS_COLORS = {
  Completed: 'bg-emerald-100 text-emerald-800',
  Processing: 'bg-blue-100 text-blue-800',
  Pending: 'bg-amber-100 text-amber-800'
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentBatches, setRecentBatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, batchesRes] = await Promise.all([
          axios.get('/dashboard/summary'),
          axios.get('/processing/all')
        ]);
        setSummary(summaryRes.data);
        setRecentBatches(batchesRes.data.slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Completed', value: summary.completedBatches },
    { name: 'Processing', value: summary.processingBatches },
    { name: 'Pending', value: summary.pendingBatches },
  ];

  const statusData = [
    { name: 'Completed', value: summary.completedBatches },
    { name: 'Processing', value: summary.processingBatches },
    { name: 'Pending', value: summary.pendingBatches },
  ];

  const getStageIcon = (stage) => {
    switch(stage) {
      case 'Filtering': return <Droplet size={16} className="text-blue-500" />;
      case 'Heating': return <TrendingUp size={16} className="text-red-500" />;
      case 'Drying': return <AlertCircle size={16} className="text-amber-500" />;
      default: return <Package size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Production Dashboard</h1>
          <p className="text-gray-500 mt-2">Real-time overview of palm sugar production metrics</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KpiCard title="Total Neera Collected" value={`${summary.totalNeeraLiters} L`} icon={<Droplet size={20} />} color="bg-blue-500" />
          <KpiCard title="Total Palm Sugar" value={`${summary.totalSugarKg} Kg`} icon={<Package size={20} />} color="bg-emerald-500" />
          <KpiCard title="Total Batches" value={summary.totalBatches} icon={<TrendingUp size={20} />} color="bg-indigo-500" />
          <KpiCard title="Wastage" value={`${summary.wastagePercentage}%`} icon={<AlertCircle size={20} />} color="bg-amber-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ChartCard title="Batch Status Distribution">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} batches`, 'Quantity']} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Status Breakdown">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statusData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip cursor={{ fill: 'rgba(242, 242, 242, 0.5)' }} />
                <Bar dataKey="value" name="Batches">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Recent Batches</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                View All Batches
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stage</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBatches.map((batch, index) => (
                  <motion.tr
                    key={batch._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{batch.batchId.slice(-2)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{batch.batchId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        {new Date(batch.completedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 font-medium">{batch.neeraRef?.quantityLiters ?? '—'} L
                      L</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        batch.isCompleted ? STATUS_COLORS.Completed : STATUS_COLORS.Processing
                      }`}>
                        {batch.isCompleted ? 'Completed' : 'Processing'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-700">
                        {getStageIcon(batch.currentStage)}
                        <span className="ml-2">{batch.currentStage}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{recentBatches.length}</span> of <span className="font-medium">{summary.totalBatches}</span> batches
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100">Previous</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const KpiCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
  >
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${color} bg-opacity-10`}>
          <div className={`${color} text-white rounded-full p-2`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
    <div className="p-6 border-b border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);