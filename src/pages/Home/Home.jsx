import React, { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { Fade } from 'react-awesome-reveal';
import { Link } from 'react-router-dom';
import BillCard from '../../components/BillCard/BillCard';
import { toast, Toaster } from 'react-hot-toast';
import useDynamicTitle from '../../hooks/useDynamicTitle';

const Home = () => {
    
    useDynamicTitle('Home');
    const [allBills, setAllBills] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const axiosSecure = useAxios(); 

    useEffect(() => {
        setLoading(true);
        axiosSecure.get('/bills')
            .then(res => {
                setAllBills(res.data.slice(0, 8)); // Ensures max 8 bills are used
                setLoading(false);
            })
            .catch(err => {
                toast.error("Failed to load bill data. Check console for details.");
                setLoading(false);
                console.error("Home Page Fetch Error:", err);
            });
            
    }, []); 

    if (loading) {
        return (
            <div className="text-center min-h-screen pt-40">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p>Loading Bills...</p>
            </div>
        );
    }

    // Define static categories for the Home Page
    const categories = [
        { name: 'Electricity', icon: '⚡' },
        { name: 'Gas', icon: '🔥' },
        { name: 'Water', icon: '💧' },
        { name: 'Internet', icon: '🌐' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4">
            <Toaster /> 
            {/* 1. Banner/Hero Section */}
            <Fade direction="down" triggerOnce>
                <section
                    className="hero h-[500px] bg-base-200 rounded-lg my-8 
                                 bg-[url('https://i.ibb.co.com/Cp7WTBYG/banner.jpg')] 
                                 bg-cover bg-center"
                >
                    <div className="hero-overlay bg-opacity-60 rounded-lg"></div> 
                    <div className="hero-content text-center text-neutral-content"> 
                        <div className="max-w-md">
                            <h1 className="text-5xl font-bold">Manage Your Utility Bills</h1>
                            <p className="py-6">View, pay, and track all your monthly utility expenses in one place securely.</p>
                            <Link to="/bills" className="btn btn-primary">Go to Bills Page</Link>
                        </div>
                    </div>
                </section>
            </Fade>

            {/* 2. Categories Section */}
            <Fade direction="left" triggerOnce>
                <section className="py-16">
                    <h2 className="text-4xl font-bold text-center mb-10">Bill Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((cat, index) => (
                            <Link to={`/bills?category=${cat.name}`} key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer text-center p-6">
                                <div className="text-6xl mb-4">{cat.icon}</div>
                                <p className="text-xl font-semibold">{cat.name}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </Fade>

            {/* 3. Featured Bills Section (Standard 3-Column Grid) */}
            <Fade direction="right" triggerOnce>
                <section className="py-16">
                    <h2 className="text-4xl font-bold text-center mb-10">Our Featured Bills</h2>

                    {allBills.length === 0 && !loading ? (
                        <p className="col-span-full text-center text-lg">No bills found in the database.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {allBills.map(bill => (
                                <BillCard key={bill._id} bill={bill} />
                            ))}
                        </div>
                    )}
                </section>
            </Fade>

            {/* 4. Extra Section */}
            <section className="py-16 bg-gray-100 rounded-lg my-8">
                <h2 className="text-3xl font-bold text-center mb-4">Why Choose BillPay?</h2>
                <p className="text-center text-gray-600 max-w-2xl mx-auto">We offer secure payments, detailed tracking, and timely reminders to ensure you never miss a due date again.</p>
            </section>

        </div>
    );
};

export default Home;