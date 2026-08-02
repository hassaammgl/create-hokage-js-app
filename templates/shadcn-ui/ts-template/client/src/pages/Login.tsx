import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { z, ZodError } from 'zod';
import { NavLink } from 'react-router';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof loginSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

interface ApiResponse {
    message: string;
    status: boolean;
}

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth/',
    withCredentials: true,
});

const Login: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [formMessage, setFormMessage] = useState('');
    const [formMessageStatus, setFormMessageStatus] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as string }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormMessage('');
        setIsLoading(true);

        try {
            loginSchema.parse(formData);

            const { data } = await axiosInstance.post<ApiResponse>('/login', formData);

            setFormMessage(data.message);
            setFormMessageStatus(data.status);
            setErrors({});
        } catch (err: unknown) {
            if (err instanceof ZodError) {
                const newErrors: FormErrors = {};
                // @ts-expect-error - dont know why this eerror is happened
                err.errors.forEach(error => {
                    const field = error.path[0] as keyof FormData;
                    newErrors[field] = error.message;
                });
                setErrors(newErrors);
            } else if (axios.isAxiosError(err)) {
                setFormMessage(err.response?.data?.message || 'Login failed. Please try again.');
            } else {
                setFormMessage('An unexpected error occurred.');
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
                    <h2 className="text-3xl">Nice to see you!</h2>
                    <p className="my-1 mb-2.5 opacity-50">Enter your email and password to sign in</p>
                </div>

                {formMessage && (
                    <div className={`mb-4 rounded-md px-3 py-2.5 text-center text-sm ${formMessageStatus ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border border-red-500/30 bg-red-500/10 text-red-400'}`}>
                        {formMessage}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
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
                    />
                    {errors.email && <span className="mt-1 text-xs text-red-400">{errors.email}</span>}

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
                    />
                    {errors.password && <span className="mt-1 text-xs text-red-400">{errors.password}</span>}
                </div>

                <div className="my-6 flex items-center gap-2.5 text-xs">{/* Future toggles */}</div>

                <Button type="submit" className="w-[350px]" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'SIGN IN'}
                </Button>

                <p className="mt-5.5 text-center text-sm text-white/50">
                    Don't have an account? <NavLink to="/signup" className="text-white">Sign Up</NavLink>
                </p>
            </div>
        </form>
    );
};

export default Login;
