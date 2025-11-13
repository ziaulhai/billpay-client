import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import { toast, Toaster } from 'react-hot-toast'; 
import { FaGoogle } from 'react-icons/fa'; 
import useDynamicTitle from '../../hooks/useDynamicTitle'

const Register = () => {
     
    useDynamicTitle('Register');

    useEffect(() => {
        document.title = 'Register | BillPay';
    }, []);
    
    
    const { createUser, googleSignIn, updateUserInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const [registerError, setRegisterError] = useState('');

    // Password validation logic
    const handleRegister = (e) => {
        e.preventDefault();
        setRegisterError(''); // Reset previous error

        const form = new FormData(e.currentTarget);
        const name = form.get('name');
        const email = form.get('email');
        const photo = form.get('photo');
        const password = form.get('password');

        // --- Assignment Required Password Validation ---
        if (password.length < 6) {
            setRegisterError('Password must be at least 6 characters long.');
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setRegisterError('Password must contain at least one uppercase letter.');
            return;
        }
        if (!/[a-z]/.test(password)) {
            setRegisterError('Password must contain at least one lowercase letter.');
            return;
        }

        // 1. Create User in Firebase
        createUser(email, password)
            .then(() => {
                // 2. Update User Profile (Name & Photo)
                updateUserInfo(name, photo)
                    .then(() => {
                        toast.success('Registration Successful! Welcome.');
                        navigate('/'); // Navigate to home after successful registration
                    })
                    .catch((error) => {
                        setRegisterError(error.message);
                    });
            })
            .catch((error) => {
                // Handle specific Firebase error (e.g., email-already-in-use)
                if (error.code === 'auth/email-already-in-use') {
                    setRegisterError('This email is already registered.');
                } else {
                    setRegisterError(error.message);
                }
            });
    };

    // 3. Google Sign-In
    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(() => {
                toast.success('Google Login Successful!');
                navigate('/');
            })
            .catch((error) => {
                toast.error('Google Login Failed.');
                setRegisterError(error.message);
            });
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <Toaster /> 
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Register Now!</h1>
                    <p className="py-6">Create an account to start managing your utility bills.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleRegister} className="card-body">
                        {/* Name */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Name</span></label>
                            <input type="text" name="name" placeholder="Your Full Name" className="input input-bordered" required />
                        </div>
                        {/* Email */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input type="email" name="email" placeholder="example@email.com" className="input input-bordered" required />
                        </div>
                        {/* Photo URL */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Photo URL (Optional)</span></label>
                            <input type="text" name="photo" placeholder="Your Photo URL" className="input input-bordered" />
                        </div>
                        {/* Password */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" name="password" placeholder="Password" className="input input-bordered" required />
                        </div>

                        {/* Error Message */}
                        {registerError && (
                            <p className="text-red-600 mt-2 text-sm">{registerError}</p>
                        )}

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">Register</button>
                        </div>
                    </form>

                    <div className="px-8 pb-4">
                        {/* Login Link */}
                        <p className="text-center text-sm">
                            Already have an account? <Link to="/login" className="text-blue-500 font-bold hover:underline">Login</Link>
                        </p>
                        
                        {/* Social Login Divider */}
                        <div className="divider">OR</div>

                        {/* Google Login */}
                        <button onClick={handleGoogleSignIn} className="btn btn-outline w-full mt-2">
                            <FaGoogle className="text-lg" /> Login with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;