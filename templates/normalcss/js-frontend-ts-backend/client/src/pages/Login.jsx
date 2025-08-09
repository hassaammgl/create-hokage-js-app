import { useState } from 'react';
import { z } from 'zod';
import { NavLink } from 'react-router';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth/",
    withCredentials: true,
});

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [formMessage, setFormMessage] = useState('');
    const [formMessageStatus, setFormMessageStatus] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const loginSchema = z.object({
        email: z.string()
            .min(1, "Email is required")
            .email('Invalid email format'),
        password: z.string()
            .min(1, "Password is required")
            .min(6, 'Password must be at least 6 characters'),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormMessage('');
        setIsLoading(true);

        try {
            // Validate form data
            loginSchema.parse(formData);

            // Submit to server
            const { data } = await axiosInstance.post("/login", {
                email: formData.email,
                password: formData.password,
            });

            setFormMessage(data.message);
            setFormMessageStatus(data.status);
            setErrors({});
        } catch (err) {
            if (err instanceof z.ZodError) {
                // Handle validation errors
                const newErrors = err.errors.reduce((acc, error) => {
                    acc[error.path[0]] = error.message;
                    return acc;
                }, {});
                setErrors(newErrors);
            } else {
                // Handle server errors
                setFormMessage(err.response?.data?.message || 'Login failed. Please try again.');
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
                        <div className={`form-message ${formMessageStatus === true ? 'success' : 'error'}`}>
                            {formMessage}
                        </div>
                    )}

                    <div className="input-container">
                        <label htmlFor="email" className="right-container__label">Email</label>
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

                        <label htmlFor="password" className="right-container__label">Password</label>
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

                    <div className="toggle-container">
                        {/* Preserved for any future toggle elements */}
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        disabled={isLoading}
                    >
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