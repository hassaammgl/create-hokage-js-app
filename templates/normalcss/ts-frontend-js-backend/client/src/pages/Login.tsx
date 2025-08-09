import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { z, ZodError } from 'zod';
import { NavLink } from 'react-router';
import axios from 'axios';

// ✅ Zod schema is now the single source of truth
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

// ✅ Infer TypeScript type from Zod
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
            // ✅ Validate using Zod
            loginSchema.parse(formData);

            // ✅ Strongly typed API call
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
        <form onSubmit={handleSubmit} className="form-container">
            <div className="left-container"></div>
            <div className="right-container">
                <div className="right-container__box">
                    <div className="right-container-box">
                        <h2 className="right-container__h2">Nice to see you!</h2>
                        <p className="right-container__p">Enter your email and password to sign in</p>
                    </div>

                    {formMessage && (
                        <div className={`form-message ${formMessageStatus ? 'success' : 'error'}`}>
                            {formMessage}
                        </div>
                    )}

                    <div className="input-container">
                        <label htmlFor="email" className="right-container__label">
                            Email
                        </label>
                        <input
                            type="email"
                            className={`right-container__input ${errors.email ? 'error' : ''}`}
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your email address"
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}

                        <label htmlFor="password" className="right-container__label">
                            Password
                        </label>
                        <input
                            type="password"
                            className={`right-container__input ${errors.password ? 'error' : ''}`}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Your password"
                            aria-invalid={!!errors.password}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="toggle-container">{/* Future toggles */}</div>

                    <button type="submit" className="btn" disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'SIGN IN'}
                    </button>

                    <p className="right-container__bottom-text">
                        Don't have an account? <NavLink to="/signup">Sign Up</NavLink>
                    </p>
                </div>
            </div>
        </form>
    );
};

export default Login;
