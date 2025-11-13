import React, { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import BillCard from '../../components/BillCard/BillCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import useDynamicTitle from '../../hooks/useDynamicTitle'

const AllBills = () => {
     useDynamicTitle('AllBIlls');

    const axiosPublic = useAxios();
    const location = useLocation();
    const navigate = useNavigate();

    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSearch, setCurrentSearch] = useState('');
    const [currentCategory, setCurrentCategory] = useState('');

    const query = new URLSearchParams(location.search);
    const categoryParam = query.get('category') || '';
    const searchParam = query.get('search') || '';

    const handleSearch = (e) => {
        e.preventDefault();
        const form = e.target;
        const searchTerm = form.search.value.trim();

        const newQuery = new URLSearchParams();
        if (categoryParam) {
            newQuery.append('category', categoryParam);
        }
        if (searchTerm) {
            newQuery.append('search', searchTerm);
        }

        navigate(`/bills?${newQuery.toString()}`);
    };

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;

        const newQuery = new URLSearchParams();
        if (searchParam) {
            newQuery.append('search', searchParam);
        }
        if (newCategory) {
            newQuery.append('category', newCategory);
        }

        navigate(`/bills?${newQuery.toString()}`);
    };

    useEffect(() => {
        setCurrentSearch(searchParam);
        setCurrentCategory(categoryParam);

        setLoading(true);

        const url = `/bills?category=${categoryParam}&search=${searchParam}`;

        axiosPublic.get(url)
            .then(res => {
                setBills(res.data);
                setLoading(false);
            })
            .catch(err => {
                toast.error("Failed to fetch bills from server.");
                setLoading(false);
                console.error(err);
            });
    }, [location.search, axiosPublic]);

    const categories = ['All Categories', 'Electricity', 'Gas', 'Water', 'Internet'];

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
            <Toaster />
            <h1 className="text-4xl font-bold text-center mb-10">All Available Utility Bills</h1>

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="form-control w-full md:w-auto">
                    <select
                        className="select select-bordered"
                        value={currentCategory || 'All Categories'}
                        onChange={handleCategoryChange}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search by Bill Title or Location..."
                        name="search"
                        defaultValue={currentSearch}
                        className="input input-bordered w-full"
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
            </div>

            <div className="py-8">
                {bills.length === 0 ? (
                    <div className="text-center py-20 bg-base-200 rounded-lg">
                        <p className="text-2xl text-gray-500">No bills found matching your criteria.</p>
                        <button
                            onClick={() => navigate('/bills')}
                            className="btn btn-sm btn-link mt-4"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bills.map(bill => (
                            <BillCard key={bill._id} bill={bill} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllBills;