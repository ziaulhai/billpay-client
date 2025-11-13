import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { AuthContext } from '../../AuthProvider';
import { toast, Toaster } from 'react-hot-toast';
import { FiCopy, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf'; 
import useDynamicTitle from '../../hooks/useDynamicTitle';

const MyPayBills = () => {
    
    useDynamicTitle('My Paid Bills');
    

    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();
    
    const [myBills, setMyBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentBill, setCurrentBill] = useState(null);
    const [billToDelete, setBillToDelete] = useState(null); 

    const handleCopyToClipboard = (billsId) => {
        navigator.clipboard.writeText(billsId)
            .then(() => {
                toast.success('Bill ID copied to clipboard!');
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
                toast.error('Failed to copy Bill ID.');
            });
    };

    const handleDownloadReceipt = (bill) => {
        const doc = new jsPDF();
        let y = 10; 

        // Header
        doc.setFontSize(16);
        doc.text("--- Bill Payment Receipt ---", 10, y);
        y += 10;

        // Details
        doc.setFontSize(12);
        const receiptData = [
            ["Title:", bill.title],
            ["Category:", bill.category],
            ["Amount:", `৳${bill.amount.toFixed(2)}`],
            ["Payment Date:", bill.paymentDate],
            ["Bill ID:", bill.billsId],
            ["Payer Name:", bill.username],
            ["Phone:", bill.phone],
            ["Email:", bill.email],
            ["Address:", bill.address],
        ];

        receiptData.forEach(([label, value]) => {
            doc.text(label, 10, y);
            doc.text(value, 50, y); // Align value
            y += 7; // Increment Y for next line
        });

        doc.text("-----------------------------", 10, y);
        
        // Save as PDF
        doc.save(`Receipt_${bill.category}_${bill.billsId.substring(0, 8)}.pdf`);
        toast.success(`Receipt for ${bill.title} downloaded as PDF!`);
    };

    const fetchMyBills = () => {
        if (!user?.email) {
            setLoading(false);
            return;
        }

        const encodedEmail = encodeURIComponent(user.email); 

        setLoading(true);
        axiosSecure.get(`/mybills/${encodedEmail}`) 
            .then(res => {
                setMyBills(res.data.myBills ? res.data.myBills.reverse() : []); 
                setLoading(false);
            })
            .catch(err => {
                toast.error("Failed to fetch your paid bills. (Check Server/Decode Error)");
                setLoading(false);
                console.error(err);
            });
    };

    useEffect(() => {
        fetchMyBills();
    }, [user, axiosSecure]);

    const handleConfirmDeleteClick = (id, title) => {
        setBillToDelete({ id, title });
        document.getElementById('delete_modal').showModal();
    };

    const handleExecuteDelete = () => {
        document.getElementById('delete_modal').close();
        
        if (!billToDelete) return; 

        const { id, title } = billToDelete;

        axiosSecure.delete(`/mybills/${id}`)
            .then(res => {
                if (res.data.deletedCount > 0 || res.status === 200) {
                    toast.success(`Payment record for "${title}" deleted successfully!`);
                    fetchMyBills();
                } else {
                    toast.error("Failed to delete: Record not found.");
                }
            })
            .catch(err => {
                const errorStatus = err.response?.status;
                if (errorStatus === 400) {
                    toast.error("Deletion failed: Invalid Record ID format.");
                } else if (errorStatus === 404) {
                    toast.error("Deletion failed: Record not found.");
                } else {
                    toast.error("Failed to delete the bill record.");
                }
                console.error("Deletion Error:", err.response || err);
            })
            .finally(() => {
                setBillToDelete(null); 
            });
    };

    const handleEditClick = (bill) => {
        setCurrentBill(bill);
        document.getElementById('edit_modal').showModal();
    };

    const handleUpdateBill = (e) => {
        e.preventDefault();
        const form = e.target;
        
        const updatedData = {
            username: form.username.value, // Name (username)
            address: form.address.value,   // Address
        };

        axiosSecure.put(`/mybills/${currentBill._id}`, updatedData)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast.success('Bill payment record updated successfully!');
                    document.getElementById('edit_modal').close();
                    fetchMyBills();
                } else {
                    toast('No changes made.', { icon: 'ℹ️' });
                }
            })
            .catch(err => {
                toast.error("Failed to update the bill record.");
                console.error(err);
            });
    };

    if (loading) {
        return (<div className="text-center min-h-screen pt-40"><span className="loading loading-spinner loading-lg text-primary"></span><p>Loading Your Paid Bills...</p></div>);
    }

    if (!user) {
        return <div className="text-center text-error mt-20 text-2xl">Please log in to view your payment history.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <Toaster />
            <h1 className="text-4xl font-bold text-center mb-10">My Payment History ({myBills.length})</h1>

            {myBills.length === 0 ? (
                <div className="text-center py-20 bg-base-200 rounded-lg">
                    <p className="text-2xl text-gray-500">You have no recorded bill payments yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-xl rounded-lg">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-primary text-white"><th>#</th><th>Bill Title</th><th>Amount</th><th>Category</th><th>Phone Number</th><th>Payer Name</th><th>Bill ID</th><th>Payment Date</th><th>Action</th></tr>
                        </thead>
                        
                        <tbody>
                            {myBills.map((bill, index) => (
                                <tr key={bill._id}>
                                    <th>{index + 1}</th>
                                    <td>{bill.title}</td>
                                    <td className="font-semibold text-error">৳{bill.amount.toFixed(2)}</td>
                                    <td>{bill.category}</td>
                                    <td>{bill.phone}</td>
                                    <td>{bill.username}</td>
                                    <td className="flex items-center gap-2">
                                        <span className="font-mono text-sm">{bill.billsId.length > 9 ? bill.billsId.substring(0, 9) + '...' : bill.billsId}</span>
                                        <button onClick={() => handleCopyToClipboard(bill.billsId)} className="btn btn-ghost btn-xs tooltip" data-tip="Copy Bill ID" aria-label="Copy Bill ID"><FiCopy className="text-blue-500" /></button>
                                    </td>
                                    <td className="text-xs text-center">
                                        {bill.paymentDate && bill.paymentDate.split(',').length > 1 ? (
                                            <>
                                                <span className="font-medium text-gray-700">{bill.paymentDate.split(',')[0].trim()}</span>
                                                <br />
                                                <span className="text-primary font-bold">{bill.paymentDate.split(',')[1].trim()}</span>
                                            </>
                                        ) : (
                                            bill.paymentDate 
                                        )}
                                    </td>
                                    <td>
                                        <button onClick={() => handleDownloadReceipt(bill)} className="btn btn-ghost btn-xs text-info mr-1 tooltip" data-tip="Download Receipt PDF" aria-label="Download">
                                            <FiDownload className="text-lg" />
                                        </button>
                                        <button onClick={() => handleEditClick(bill)} className="btn btn-ghost btn-xs text-warning mr-1 tooltip" data-tip="Edit Payment Info" aria-label="Edit">
                                            <FiEdit className="text-lg" />
                                        </button>
                                        {/* confirm delete */}
                                        <button onClick={() => handleConfirmDeleteClick(bill._id, bill.title)} className="btn btn-ghost btn-xs text-error tooltip" data-tip="Delete Record" aria-label="Delete">
                                            <FiTrash2 className="text-lg" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* Edit Modal */}
            <dialog id="edit_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Edit Payment Record</h3>
                    {currentBill && (
                        <form onSubmit={handleUpdateBill} className="space-y-4 py-4">
                            <p className="text-sm">Editing record for: **{currentBill.title}**</p>
                            
                            <div className="form-control">
                                <label className="label"><span className="label-text">Payer Name</span></label>
                                <input type="text" name="username" defaultValue={currentBill.username} className="input input-bordered w-full" required />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Amount (৳)</span></label>
                                <input type="text" name="amount" defaultValue={`৳${currentBill.amount.toFixed(2)}`} className="input input-bordered w-full bg-gray-100" disabled />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Phone Number</span></label>
                                <input type="tel" name="phone" defaultValue={currentBill.phone} className="input input-bordered w-full bg-gray-100" disabled />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Billing Address</span></label>
                                <textarea name="address" defaultValue={currentBill.address} className="textarea textarea-bordered w-full" required ></textarea>
                            </div>

                            <button type="submit" className="btn btn-warning w-full">Update Record</button>
                        </form>
                    )}

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                    </div>
                </div>
            </dialog>

            {/* delete confirmation modal */}
            <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-red-50 border-t-4 border-red-500">
                    <h3 className="font-bold text-xl text-red-600">⚠️ Confirm Permanent Deletion</h3>
                    
                    <p className="py-4 text-gray-700">Are you sure you want to delete this bill entry?</p>
                    
                    {billToDelete && (
                        <div className="bg-red-100 p-3 rounded-lg border border-red-300">
                            <p className="font-semibold text-red-700">
                                Entry: {billToDelete.title}</p>
                            
                        </div>
                    )}
                    
                    <div className="modal-action">
                        
                        <button 
                            onClick={handleExecuteDelete} 
                            className="btn btn-error text-white"
                        >
                            Delete Permanently
                        </button>
                        
                       
                        <form method="dialog">
                            <button className="btn btn-ghost">Cancel</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default MyPayBills;