import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import BillCard from '../components/BillCard/BillCard';
import { toast } from 'react-hot-toast';


const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const axiosPublic = useAxios();

  const urlCategory = searchParams.get('category');

  const [activeCategory, setActiveCategory] = useState(urlCategory || 'All');

  useEffect(() => {
    setLoading(true);
    axiosPublic.get('/bills')
      .then(res => {
        setBills(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to fetch bills from the server.');
        setLoading(false);
      });
  }, [axiosPublic]);

  useEffect(() => {
    setActiveCategory(urlCategory || 'All');
  }, [urlCategory, location.pathname]);

  const filteredBills = useMemo(() => {
    let currentBills = bills;

    if (activeCategory !== 'All') {
      const lowerCaseActiveCategory = activeCategory.toLowerCase();

      currentBills = currentBills.filter(bill =>
        bill.category?.toLowerCase() === lowerCaseActiveCategory
      );
    }

    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      currentBills = currentBills.filter(bill =>
        bill.title?.toLowerCase().includes(lowerCaseSearch) ||
        bill.location?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return currentBills;
  }, [bills, activeCategory, searchTerm]);

  const categories = ['All', 'Electricity', 'Gas', 'Water', 'Internet'];

  if (loading) {
    return (
      <div className="text-center min-h-screen pt-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p>Loading Bills...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">All Available Bills</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by Title or Location..."
            className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 w-full md:w-2/3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSearchTerm('');
              }}
              className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline dark:text-white dark:hover:bg-primary dark:hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredBills.length === 0 ? (
        <div className="text-center py-20 bg-base-200 rounded-lg dark:bg-gray-800">
          <p className="text-2xl text-gray-500 dark:text-gray-400">No bills found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBills.map(bill => (
            < BillCard key={bill._id} bill={bill} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bills;