import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import { toast } from 'react-hot-toast';
import ThemeToggler from '../Shared/ThemeToggler';

const Navbar = () => {
  const { user, logOut, loading } = useContext(AuthContext);

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success('Successfully Logged out!');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Logout failed.');
      });
  };

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "border-b-2 border-primary text-primary font-semibold transition-all duration-300"
              : "hover:text-primary transition-all duration-300"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/bills"
          className={({ isActive }) =>
            isActive
              ? "border-b-2 border-primary text-primary font-semibold transition-all duration-300"
              : "hover:text-primary transition-all duration-300"
          }
        >
          Bills
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/mypaybills"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-primary text-primary font-semibold transition-all duration-300"
                : "hover:text-primary transition-all duration-300"
            }
          >
            My Pay Bills
          </NavLink>
        </li>
      )}
    </>
  );

  if (loading) {
  }

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 dark:bg-gray-900 dark:text-white transition-colors duration-500">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 dark:bg-gray-800">
            {navLinks}
          </ul>
        </div>
        <Link to="/" className="text-2xl font-[orbitron] font-bold text-primary dark:text-white">BillPay</Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navLinks}
        </ul>
      </div>

      <div className="navbar-end">
        <ThemeToggler />

        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt={user.displayName || 'User'}
                  src={user.photoURL || 'https://i.ibb.co.com/WNyfY5cS/profile-1.png'}
                  title={user.displayName || user.email}
                />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 dark:bg-gray-800">
              <li><a className="justify-between">{user.displayName || user.email || 'Profile'}</a></li>
              <li><a onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2 ml-2">
            <Link to="/login" className="btn btn-sm btn-outline btn-primary">Login</Link>
            <Link to="/register" className="btn btn-sm btn-secondary hidden sm:flex">Register</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;