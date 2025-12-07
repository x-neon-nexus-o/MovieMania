import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
        return null;
    }

    const handleSubmit = async (data) => {
        setIsLoading(true);
        try {
            await register(data.username, data.email, data.password);
            toast.success('Account created! Welcome aboard!');
            navigate('/dashboard', { replace: true });
        } catch (error) {
            toast.error(error.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="card p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                <Film className="w-7 h-7 text-white" />
                            </div>
                        </Link>
                        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                            Create Account
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Start tracking your movie journey
                        </p>
                    </div>

                    {/* Form */}
                    <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-primary-600 hover:text-primary-500"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
