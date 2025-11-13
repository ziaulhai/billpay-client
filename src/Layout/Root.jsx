import { Outlet } from 'react-router-dom';
import Navbar from '../components/Shared/Navbar'; 
import Footer from '../components/Shared/Footer';
const Root = () => {
  return (
    <div className='bg-white text-gray-800 dark:bg-gray-800 dark:text-white min-h-screen transition-colors duration-300'>
      <Navbar />
      <div className="min-h-[calc(100vh-100px)]"> 
        <Outlet /> 
      </div>
      <Footer />
    </div>
  );
};

export default Root;