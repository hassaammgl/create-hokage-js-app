import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { z, ZodError } from 'zod';
import { NavLink } from 'react-router'; // Fixed import
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

        // Clear error when typing
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
            // Validate client-side
            registerSchema.parse(formData);

            // Send to server
            const { data } = await axiosInstance.post('/register', {
                name: formData.username,
                email: formData.email,
                password: formData.password,
            });

            setFormMessage(data.message || 'Signup successful!');
            setIsSuccess(true);
            setErrors({});

            // Reset form after short delay
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
        <form onSubmit={handleSubmit} className="form-container">
            <div className="left-container"></div>
            <div className="right-container">
                <div className="right-container__box">
                    <div className="right-container-box">
                        <h2 className="right-container__h2">Create Your Account</h2>
                        <p className="right-container__p">
                            Enter your details to join our community
                        </p>
                    </div>

                    {formMessage && (
                        <div className={`form-message ${isSuccess ? 'success' : 'error'}`}>
                            {formMessage}
                        </div>
                    )}

                    <div className="input-container">
                        <label htmlFor="username" className="right-container__label">
                            Username
                        </label>
                        <input
                            type="text"
                            className={`right-container__input ${errors.username ? 'error' : ''}`}
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Your username"
                            aria-invalid={!!errors.username}
                            disabled={isLoading}
                        />
                        {errors.username && (
                            <span className="error-message">{errors.username}</span>
                        )}

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
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <span className="error-message">{errors.email}</span>
                        )}

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
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <span className="error-message">{errors.password}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'SIGN UP'}
                    </button>

                    <p className="right-container__bottom-text">
                        Already have an account? <NavLink to="/login">Login</NavLink>
                    </p>
                </div>
            </div>
        </form>
    );
};

export default Signup;