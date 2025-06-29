import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#f8f9fc] overflow-x-hidden font-['Inter','Noto Sans',sans-serif]"
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between border-b border-[#e6e9f4] px-10 py-3">
          <div className="flex items-center gap-4 text-[#0d0f1c]">
            <div className="size-4">
              {/* Icon SVG */}
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Event Vibes</h2>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <form
            onSubmit={handleSubmit}
            className="w-[512px] max-w-[512px] py-5 flex flex-col"
          >
            <h2 className="text-[28px] font-bold text-center py-5 text-[#0d0f1c]">
              Welcome back
            </h2>

            {/* Email Field */}
            <label className="px-4 py-3 flex flex-col">
              <p className="text-[#0d0f1c] text-base font-medium pb-2">Email</p>
              <input
                type="email"
                placeholder="Enter your college email (@yourcollege.ac.in)"
                className="rounded-xl h-14 border border-[#ced2e9] bg-[#f8f9fc] text-[#0d0f1c] placeholder:text-[#47569e] p-[15px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            {/* Password Field */}
            <label className="px-4 py-3 flex flex-col">
              <p className="text-[#0d0f1c] text-base font-medium pb-2">Password</p>
              <input
                type="password"
                placeholder="Enter your password"
                className="rounded-xl h-14 border border-[#ced2e9] bg-[#f8f9fc] text-[#0d0f1c] placeholder:text-[#47569e] p-[15px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className="flex justify-between items-center px-4 text-sm text-[#0d0f1c] py-1">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5 border-[#ced2e9]" />
                Remember me
              </label>
              <p className="text-[#47569e] underline cursor-pointer">
                Forgot password?
              </p>
            </div>

            {/* Login Button */}
            <div className="px-4 py-3">
              <button
                type="submit"
                className="w-full bg-[#607afb] text-[#f8f9fc] rounded-xl h-10 font-bold"
              >
                Login
              </button>
            </div>

            <p className="text-center text-[#47569e] text-sm underline">
              Don't have an account? <a href="/register">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
