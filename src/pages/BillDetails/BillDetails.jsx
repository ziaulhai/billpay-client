import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import { AuthContext } from '../../AuthProvider';
import { toast, Toaster } from 'react-hot-toast';
import { FaMoneyBillWave, FaMapMarkerAlt, FaCalendarAlt, FaTag } from 'react-icons/fa';
import useDynamicTitle from '../../hooks/useDynamicTitle';

const BillDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosSecure = useAxios();

    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [paymentMeta, setPaymentMeta] = useState({
        customBillId: '',
        formattedDate: ''
    });

    const pageTitle = !loading && bill
        ? `${bill.title} - Details`
        : !loading && !bill
            ? 'Bill Not Found'
            : 'Loading Bill Details';

    useDynamicTitle(pageTitle);

    useEffect(() => {
        setLoading(true);
        axiosSecure.get(`/bills/${id}`)
            .then(res => {
                setBill(res.data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.error("Single Bill Fetch Error:", err);
                toast.error("Failed to fetch bill details.");
            });

        generatePaymentMeta();

    }, [id, axiosSecure]);

    const generatePaymentMeta = () => {
        const min = 100000000;
        const max = 999999999;
        const customBillId = String(Math.floor(Math.random() * (max - min + 1)) + min);

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        setPaymentMeta({ customBillId, formattedDate });
    };

    const handlePayment = (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please log in to make a payment.");
            navigate('/login');
            return;
        }

        setIsSubmitting(true);
        const form = e.target;

        const paymentData = {
            billsId: paymentMeta.customBillId,
            username: form.name.value,
            phone: form.phone.value,
            address: form.address.value,
            email: user.email,
            paymentDate: paymentMeta.formattedDate,
            amount: bill?.amount || 0,
            title: bill?.title,
            category: bill?.category,
        };

        axiosSecure.post('/mybills', paymentData)
            .then(() => {
                toast.success(`Bill paid successfully! Redirecting to My Bills...`);
                form.reset();
                setIsModalOpen(false);
                setTimeout(() => {
                    navigate('/mypaybills');
                }, 1500);
            })
            .catch(err => {
                toast.error('Payment failed. Please try again.');
                console.error(err);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const formatDueDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const dateObj = new Date(dateString);
            return dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } 
        catch (error) {
            return dateString;
        }
    };


    if (loading) {
        return (
            <div className="text-center min-h-screen pt-40">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p>Loading Bill Details...</p>
            </div>
        );
    }

    if (!bill) {
        return <div className="text-center text-red-600 mt-20 text-2xl">Bill Not Found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <Toaster />

            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <header className="mb-8 border-b pb-4 dark:border-gray-700">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center dark:text-white">{bill.title}</h1>
                    <p className="text-center text-gray-500 mt-2">Details for the upcoming payment</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                    <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/50 dark:border-red-800">
                        <FaMoneyBillWave className="text-red-500 text-2xl" />
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount Due</p>
                            <p className="text-xl font-bold text-red-600 dark:text-red-400">৳{bill.amount?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200 dark:bg-indigo-900/50 dark:border-indigo-800">
                        <FaCalendarAlt className="text-indigo-500 text-2xl" />
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</p>
                            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{formatDueDate(bill.date)}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200 dark:bg-green-900/50 dark:border-green-800">
                        <FaTag className="text-green-500 text-2xl" />
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">{bill.category}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-semibold border-b pb-2 text-gray-700 dark:text-gray-200 dark:border-gray-700">Description</h3>
                    <p className="text-gray-600 leading-relaxed indent-8 dark:text-gray-300">{bill.description}</p>

                    <div className="flex items-center space-x-2 text-lg text-gray-600 dark:text-gray-300">
                        <FaMapMarkerAlt className="text-primary" />
                        <span className="font-semibold">Location:</span>
                        <span>{bill.location}</span>
                    </div>
                </div>

                <div className='w-full pt-10 border-t mt-8 dark:border-gray-700'>
                    <div className="max-w-sm mx-auto">
                        <button
                            onClick={() => {
                                generatePaymentMeta();
                                setIsModalOpen(true);
                            }}
                            className="btn btn-block btn-primary text-lg font-bold py-3"
                            disabled={!user}
                        >
                            Proceed to Pay
                        </button>
                        {!user && <p className="text-center text-error text-sm mt-2">Please log in to proceed to payment.</p>}
                    </div>
                </div>
            </div>

            <div
                className={`modal ${isModalOpen ? 'modal-open' : ''}`}
                onClick={(e) => {
                    if (e.target.classList.contains('modal-open')) {
                        setIsModalOpen(false);
                    }
                }}
            >
                <div className="modal-box w-11/12 max-w-lg dark:bg-gray-800 dark:text-white">
                    <h2 className="text-2xl font-bold mb-4 text-center">Payment Form</h2>
                    <p className="text-center mb-4 text-error font-semibold">Total Payable: ৳{bill.amount?.toFixed(2) || '0.00'}</p>

                    <button
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                        onClick={() => setIsModalOpen(false)}
                    >
                        ✕
                    </button>

                    <form onSubmit={handlePayment} className="space-y-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text dark:text-gray-300">Transaction ID</span></label>
                            <input
                                type="text"
                                name="billsId"
                                value={paymentMeta.customBillId}
                                className="input input-bordered bg-gray-100 font-mono w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                readOnly
                            />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text dark:text-gray-300">Payment Date</span></label>
                            <input
                                type="text"
                                name="paymentDate"
                                value={paymentMeta.formattedDate}
                                className="input input-bordered bg-gray-100 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                readOnly
                            />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text dark:text-gray-300">Your Name</span></label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={user?.displayName || ''}
                                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text dark:text-gray-300">Phone Number</span></label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="e.g. 017xxxxxxxx"
                                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text dark:text-gray-300">Billing Address</span></label>
                            <textarea
                                name="address"
                                placeholder="Your full address"
                                className="textarea textarea-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                required
                            ></textarea>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text dark:text-gray-300">Email</span></label>
                            <input
                                type="email"
                                name="email"
                                value={user?.email || ''}
                                className="input input-bordered bg-gray-100 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                readOnly
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full mt-6"
                            disabled={isSubmitting || !user}
                        >
                            {isSubmitting ? 'Processing...' : `Pay ৳${bill.amount?.toFixed(2) || '0.00'}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default BillDetails;