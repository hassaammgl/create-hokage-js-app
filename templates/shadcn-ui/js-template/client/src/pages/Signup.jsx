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
        <form onSubmit={handleSubmit} className="flex min-h-screen w-full">
            <div className="hidden flex-1 shrink-0 bg-cover bg-center bg-no-repeat md:block" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1686706763783-1378f598d8c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80)' }}></div>
            <div className="flex flex-1 shrink-0 flex-col items-center justify-center gap-4 overflow-auto">
                <div>
                    <h2 className="text-3xl">Nice to see you!</h2>
                    <p className="my-1 mb-2.5 opacity-50">Enter your username, email and password to sign in</p>
                </div>

                {formMessage && (
                    <div className={`mb-4 rounded-md px-3 py-2.5 text-center text-sm ${formMessage.includes('success') ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border border-red-500/30 bg-red-500/10 text-red-400'}`}>
                        {formMessage}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="username" className="mt-5 text-sm">Username</label>
                    <input
                        type="text"
                        className={`w-[350px] rounded-full border border-white/50 bg-transparent px-5 py-3.5 text-white outline-none ${errors.username ? 'border-red-500 bg-red-500/5' : ''}`}
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Your username"
                    />
                    {errors.username && <span className="mt-1 text-xs text-red-400">{errors.username}</span>}
                    <label htmlFor="email" className="mt-5 text-sm">Email</label>
                    <input
                        type="email"
                        className={`w-[350px] rounded-full border border-white/50 bg-transparent px-5 py-3.5 text-white outline-none ${errors.email ? 'border-red-500 bg-red-500/5' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                    />
                    {errors.email && <span className="mt-1 text-xs text-red-400">{errors.email}</span>}

                    <label htmlFor="password" className="mt-5 text-sm">Password</label>
                    <input
                        type="password"
                        className={`w-[350px] rounded-full border border-white/50 bg-transparent px-5 py-3.5 text-white outline-none ${errors.password ? 'border-red-500 bg-red-500/5' : ''}`}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Your password"
                    />
                    {errors.password && <span className="mt-1 text-xs text-red-400">{errors.password}</span>}
                </div>

                <div className="my-6 flex items-center gap-2.5 text-xs">
                </div>

                <button type="submit" className="w-[350px] cursor-pointer rounded-2xl border border-[#30A2FF] bg-[#30A2FF] px-0 py-2.5 text-white">Sign in</button>
                <p className="mt-5.5 text-center text-sm text-white/50">Already have an account? <NavLink to={"/login"} className="text-white">Login</NavLink></p>
            </div>
        </form>
    );
}
export default Signup
