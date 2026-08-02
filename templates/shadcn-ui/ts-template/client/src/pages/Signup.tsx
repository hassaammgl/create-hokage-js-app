import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { z, ZodError } from 'zod';
import { NavLink } from 'react-router';
import axios from 'axios';

interface FormData {
    username: string;
    email: string;
    password: string;
}

type FormErrors = Partial<Record<keyof FormData, string | undefined>>;

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth',
    withCredentials: true,
});

const registerSchema = z.object({
    username: z.string().min(6, 'Username must be at least 6 characters'),
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Must contain at least one number'),
});

const Signup = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [formMessage, setFormMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const field = name as keyof FormData;

        setFormData(prev => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormMessage('');
        setIsLoading(true);
        setIsSuccess(false);

        try {
            registerSchema.parse(formData);

            const { data } = await axiosInstance.post('/register', {
                name: formData.username,
                email: formData.email,
                password: formData.password,
            });

            setFormMessage(data.message || 'Signup successful!');
            setIsSuccess(true);
            setErrors({});

            setTimeout(() => {
                setFormData({ username: '', email: '', password: '' });
            }, 1500);
        } catch (err) {
            setIsSuccess(false);

            if (err instanceof ZodError) {
                // @ts-expect-error - dont know why this eerror is happened
                const newErrors = err.errors.reduce<FormErrors>((acc, error) => {
                    if (error.path.length > 0) {
                        const field = error.path[0] as keyof FormData;
                        acc[field] = error.message;
                    }
                    return acc;
                }, {});
                setErrors(newErrors);
            } else if (axios.isAxiosError(err)) {
                const serverMessage = err.response?.data?.message;
                setFormMessage(serverMessage || 'Registration failed. Please try again.');
            } else {
                setFormMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex min-h-screen w-full">
            <div className="hidden flex-1 shrink-0 bg-cover bg-center bg-no-repeat md:block" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1686706763783-1378f598d8c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80)' }}></div>
            <div className="flex flex-1 shrink-0 flex-col items-center justify-center gap-4 overflow-auto">
                <div>
                    <h2 className="text-3xl">Create Your Account</h2>
                    <p className="my-1 mb-2.5 opacity-50">
                        Enter your details to join our community
                    </p>
                </div>

                {formMessage && (
                    <div className={`mb-4 rounded-md px-3 py-2.5 text-center text-sm ${isSuccess ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border border-red-500/30 bg-red-500/10 text-red-400'}`}>
                        {formMessage}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="username" className="mt-5 text-sm">
                        Username
                    </label>
                    <input
                        type="text"
                        className={`w-[350px] rounded-full border border-white/50 bg-transparent px-5 py-3.5 text-white outline-none ${errors.username ? 'border-red-500 bg-red-500/5' : ''}`}
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Your username"
                        aria-invalid={!!errors.username}
                        disabled={isLoading}
                    />
                    {errors.username && (
                        <span className="mt-1 text-xs text-red-400">{errors.username}</span>
                    )}

                    <label htmlFor="email" className="mt-5 text-sm">
                        Email
                    </label>
                    <input
                        type="email"
                        className={`w-[350px] rounded-full border border-white/50 bg-transparent px-5 py-3.5 text-white outline-none ${errors.email ? 'border-red-500 bg-red-500/5' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        aria-invalid={!!errors.email}
                        disabled={isLoading}
                    />
                    {errors.email && (
                        <span className="mt-1 text-xs text-red-400">{errors.email}</span>
                    )}

                    <label htmlFor="password" className="mt-5 text-sm">
                        Password
                    </label>
                    <input
                        type="password"
                        className={`w-[350px] rounded-full border border-white/50 bg-transparent px-5 py-3.5 text-white outline-none ${errors.password ? 'border-red-500 bg-red-500/5' : ''}`}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Your password"
                        aria-invalid={!!errors.password}
                        disabled={isLoading}
                    />
                    {errors.password && (
                        <span className="mt-1 text-xs text-red-400">{errors.password}</span>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-[350px] cursor-pointer rounded-2xl border border-[#30A2FF] bg-[#30A2FF] px-0 py-2.5 text-white disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'SIGN UP'}
                </button>

                <p className="mt-5.5 text-center text-sm text-white/50">
                    Already have an account? <NavLink to="/login" className="text-white">Login</NavLink>
                </p>
            </div>
        </form>
    );
};

export default Signup;
