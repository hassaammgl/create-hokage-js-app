import { useState, useEffect } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import { NavLink } from 'react-router';

const Home = () => {
    const [conn, setConn] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const connectBackend = async () => {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:5000");
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setConn(data);
                setError(null);
            } catch (err) {
                console.error("Backend connection failed:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        connectBackend();
    }, []);

    return (
        <div className="relative z-10 flex w-full max-w-5xl flex-col gap-8">
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="bubble1 animate-float absolute h-[300px] w-[300px] rounded-full bg-white/10 blur-sm" style={{ top: '10%', left: '5%', animationDuration: '25s' }}></div>
                <div className="bubble2 animate-float absolute h-[200px] w-[200px] rounded-full bg-white/10 blur-sm" style={{ bottom: '15%', right: '10%', animationDuration: '20s' }}></div>
                <div className="bubble3 animate-float absolute h-[150px] w-[150px] rounded-full bg-white/10 blur-sm" style={{ top: '40%', right: '20%', animationDuration: '15s' }}></div>
                <div className="bubble4 animate-float absolute h-[250px] w-[250px] rounded-full bg-white/10 blur-sm" style={{ bottom: '30%', left: '20%', animationDuration: '30s' }}></div>
            </div>

            <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/20 bg-white/10 p-10 text-center shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center gap-8">
                    <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
                        <img src={viteLogo} className="h-30 drop-shadow-lg transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
                    </a>
                    <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                        <img src={reactLogo} className="h-30 animate-logo-spin drop-shadow-lg transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_2em_#61dafbaa]" alt="React logo" />
                    </a>
                </div>

                <h1 className="my-2 bg-gradient-to-r from-[#7a7cff] via-[#6ecbf5] to-[#ff7eb3] bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                    Vite + React
                </h1>
                <p className="max-w-[500px] text-xl text-white/85">Modern frontend experience</p>

                {loading ? (
                    <div className="animate-fade-in flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-gray-400">
                        <div className="inline-block h-5 w-5 animate-spin rounded-full border-3 border-white/30 border-t-white"></div>
                        <span>Connecting to backend...</span>
                    </div>
                ) : error ? (
                    <div className="animate-fade-in rounded-full bg-red-500/20 px-4 py-2 text-sm text-red-500">
                        <span>Connection failed: {error}</span>
                    </div>
                ) : conn?.success ? (
                    <div className="animate-pulse-slow animate-fade-in rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-400">
                        <span>Backend connected successfully!</span>
                    </div>
                ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-10 rounded-2xl border border-white/20 bg-white/10 p-10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex min-w-[200px] flex-col items-center gap-4">
                    <button
                        className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-[18px] border border-white/20 bg-white/15 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/25 active:scale-98"
                        onClick={() => setCount((count) => count + 1)}
                    >
                        <span className="text-5xl font-bold leading-none text-white">{count}</span>
                        <span className="mt-2 text-lg text-white/80">Clicks</span>
                    </button>
                    <div className="text-sm text-white/70">Click to increase the counter</div>
                </div>

                <div className="min-w-[300px] flex-1">
                    <p className="mb-6 text-xl leading-relaxed">
                        Edit <code className="rounded-md bg-white/10 px-2 py-0.5 font-mono">src/pages/Home.jsx</code> and save to test HMR
                    </p>
                    <div className="flex flex-wrap gap-6">
                        <div className="min-w-[140px] flex-1 rounded-2xl border border-white/20 bg-white/8 p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15">
                            <div className="mb-3 text-4xl">⚡</div>
                            <div className="text-lg font-semibold">Blazing Fast</div>
                        </div>
                        <div className="min-w-[140px] flex-1 rounded-2xl border border-white/20 bg-white/8 p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15">
                            <div className="mb-3 text-4xl">🧩</div>
                            <div className="text-lg font-semibold">Modular</div>
                        </div>
                        <div className="min-w-[140px] flex-1 rounded-2xl border border-white/20 bg-white/8 p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15">
                            <div className="mb-3 text-4xl">🔧</div>
                            <div className="text-lg font-semibold">Developer Friendly</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 px-10 text-center shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <p className="mb-6 text-lg">Click on the Vite and React logos to learn more</p>
                <div className="flex flex-wrap justify-center gap-8">
                    <NavLink to="/signup" className="rounded-xl border border-white/20 bg-white/8 px-5 py-3 text-white/90 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20">Signup</NavLink>
                    <NavLink to="/login" className="rounded-xl border border-white/20 bg-white/8 px-5 py-3 text-white/90 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20">Login</NavLink>
                </div>
            </div>
        </div>
    );
}

export default Home
