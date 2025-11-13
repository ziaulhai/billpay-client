import { Link } from 'react-router-dom';

const BillCard = ({ bill }) => {
    // Destructure bill properties
    const { _id, title, category, location, amount, date, image } = bill;
    
    // Format the date for display
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="card bg-base-100 shadow-xl border border-gray-200">
            {/* Image Section */}
            <figure className="h-48 overflow-hidden">
                <img 
                    
                    src={image || 'https://via.placeholder.com/400/CCCCCC/FFFFFF?Text=No+Image'} 
                    alt={title} 
                    className="[w-380px] h-[300px] scale-100 object-cover" 
                />
            </figure>
            
            {/* Body Section */}
            <div className="card-body p-5">
                {/* Category and Amount */}
                <div className="flex justify-between items-center">
                    <span className="badge badge-primary">{category}</span>
                    <span className="text-xl font-bold text-success">৳{amount.toFixed(2)}</span>
                </div>
                
                {/* Title */}
                <h2 className="card-title text-xl mt-2 mb-2">
                    {title}
                </h2>
                
                {/* Details */}
                <p className="text-sm text-gray-500">
                    Location: {location}
                </p>
                <p className="text-sm text-gray-500">
                    Due Date: {formattedDate}
                </p>
                
                {/* Action Button */}
                <div className="card-actions justify-end mt-4">
                    <Link to={`/bills/${_id}`} className="btn btn-sm btn-outline btn-info">
                        See Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BillCard;