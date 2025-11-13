import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';
import { toast, Toaster } from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
    
    useEffect(() => {
        document.title = 'Login | BillPay';
    }, []);
    
    const { signIn, googleSignIn, resetPassword } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [loginError, setLoginError] = useState('');
    const [isResetting, setIsResetting] = useState(false); 

    // Determine where to redirect after login (My Bills or Home)
    const from = location.state || '/';

    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError(''); // Reset previous error

        const form = new FormData(e.currentTarget);
        const email = form.get('email');
        const password = form.get('password');

        // 1. Sign In with Email/Password
        signIn(email, password)
            .then(() => {
                toast.success('Login Successful! Welcome.');
                navigate(from, { replace: true }); // Redirect to the intended page
            })
            .catch((error) => {
                // Handle login errors
                if (error.code === 'auth/invalid-credential') {
                    setLoginError('Invalid Email or Password. Please try again.');
                } else {
                    setLoginError(error.message);
                }
            });
    };

    // 2. Google Sign-In
    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(() => {
                toast.success('Google Login Successful!');
                navigate(from, { replace: true });
            })
            .catch((error) => {
                toast.error('Google Login Failed.');
                setLoginError(error.message);
            });
    };

    // 3. Forgot Password
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        
        const emailInput = document.querySelector('input[name="email"]');
        const email = emailInput?.value;

        if (!email) {
            setLoginError("Please enter your email in the field above to reset your password.");
            return;
        }

        if (!resetPassword) {
            setLoginError("Password reset service is currently unavailable.");
            console.error("resetPassword function is missing in AuthContext");
            return;
        }

        setIsResetting(true);
        setLoginError('');
        
        try {
            await resetPassword(email);
            toast.success(`Password reset link sent to ${email}. Check your inbox!`, { duration: 6000 });
        } catch (error) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
                toast.error("User not found for this email or email is invalid.");
            } else {
                toast.error("Failed to send reset email. Please try again.");
                console.error("Password reset error:", error);
            }
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <Toaster />
            <div className="hero-content flex-col lg:flex-row">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login Now!</h1>
                    <p className="py-6">Access your account to start managing and paying your bills.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleLogin} className="card-body">
                        {/* Email */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input type="email" name="email" placeholder="example@email.com" className="input input-bordered" required />
                        </div>
                        {/* Password */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" name="password" placeholder="Password" className="input input-bordered" required />
                            
                            <label className="label">
                                <a 
                                    href="#" 
                                    onClick={handleForgotPassword} 
                                    className={`label-text-alt link link-hover ${isResetting ? 'text-gray-500' : 'text-primary'}`}
                                >
                                    {isResetting ? 'Sending Link...' : 'Forgot Password?'}
                                </a>
                            </label>
                        </div>

                        {/* Error Message */}
                        {loginError && (
                            <p className="text-red-600 mt-2 text-sm">{loginError}</p>
                        )}

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                    </form>

                    <div className="px-8 pb-4">
                        {/* Register Link */}
                        <p className="text-center text-sm">
                            Don't have an account? <Link to="/register" className="text-blue-500 font-bold hover:underline">Register</Link>
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

export default Login;