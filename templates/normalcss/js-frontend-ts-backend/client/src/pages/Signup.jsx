import { useState } from 'react';
import { z } from 'zod';
import { NavLink } from 'react-router';
import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth/",
    withCredentials: true,
});

const Signup = () => {


    const [formData, setFormData] = useState({
        username: "",
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [formMessage, setFormMessage] = useState('');

    const registerSchema = z.object({
        username: z.string()
            .min(6, "Username is required"),
        email: z.string()
            .min(1, "Email is required")
            .email('Invalid email format'),
        password: z.string()
            .min(1, "Password is required")
            .min(6, 'Password must be at least 6 characters'),
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormMessage('');

        try {
            registerSchema.parse(formData);
            const { data } = await axiosInstance.post("/register",
                {
                    name: formData.username,
                    email: formData.email,
                    password: formData.password,
                }
            )
            console.log(data);
            setFormMessage(data.message)
            setErrors({});
            console.log('Form submitted:', formData);
        } catch (err) {
            if (err instanceof z.ZodError) {
                const newErrors = {};
                err.errors.forEach(error => {
                    newErrors[error.path[0]] = error.message;
                });
                setErrors(newErrors);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <div className="left-container"></div>
            <div className="right-container">
                <div className="right-container__box">
                    <div className="right-container-box">
                        <h2 className="right-container__h2">Nice to see you!</h2>
                        <p className="right-container__p">Enter your username, email and password to sign in</p>
                    </div>

                    {formMessage && (
                        <div className={`form-message ${formMessage.includes('success') ? 'success' : 'error'}`}>
                            {formMessage}
                        </div>
                    )}

                    <div className="input-container">
                        <label htmlFor="username" className="right-container__label">Username</label>
                        <input
                            type="text"
                            className={`right-container__input ${errors.username ? 'error' : ''}`}
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Your username"
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                        <label htmlFor="email" className="right-container__label">Email</label>
                        <input
                            type="email"
                            className={`right-container__input ${errors.email ? 'error' : ''}`}
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your email address"
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
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="toggle-container">
                    </div>

                    <button type="submit" className="btn">Sign in</button>
                    <p className="right-container__bottom-text">Already have an account? <NavLink to={"/login"}>Login</NavLink></p>
                </div>
            </div>
        </form>
    );
};
export default Signup