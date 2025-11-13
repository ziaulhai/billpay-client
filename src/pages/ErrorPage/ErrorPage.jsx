import { Link } from 'react-router-dom';
import Navbar from '../../components/Shared/Navbar';
import Footer from '../../components/Shared/Footer';
import useDynamicTitle from '../../hooks/useDynamicTitle';

const ErrorPage = () => {

   useDynamicTitle('Error');


  return (

    <>
    <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-100">
     
      <h1 className="text-9xl font-extrabold text-red-600">404</h1>
      <img src="https://i.ibb.co.com/TZDV6Qy/errorbill.png" className='w-[250px] h[350px]' alt="" />
      <p className="text-2xl font-semibold mb-4">Page Not Found</p>
      <Link to="/" className="btn btn-primary">
       Back to Home
      </Link>
    </div>
    <Footer />
    </>
  );
};

export default ErrorPage;