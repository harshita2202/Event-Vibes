import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(res.data.user, res.data.token); // Save to AuthContext
      navigate("/"); // Redirect to home
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#f8f9fc] overflow-x-hidden font-['Inter','Noto Sans',sans-serif]">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between border-b border-[#e6e9f4] px-10 py-3">
          <div className="flex items-center gap-4 text-[#0d0f1c]">
            <div className="size-4">
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
          <form onSubmit={handleSubmit} className="w-full max-w-[512px] py-5 flex flex-col">
            <h2 className="text-[28px] font-bold text-center py-5 text-[#0d0f1c]">
              Create your account
            </h2>

            {/* Name */}
            <label className="px-4 py-3 flex flex-col">
              <p className="text-base font-medium pb-2">Name</p>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="rounded-xl h-14 bg-[#e6e9f4] p-4 placeholder:text-[#47569e]"
                required
              />
            </label>

            {/* Email */}
            <label className="px-4 py-3 flex flex-col">
              <p className="text-base font-medium pb-2">Email</p>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="College Email (e.g., student@yourcollege.ac.in)"
                className="rounded-xl h-14 bg-[#e6e9f4] p-4 placeholder:text-[#47569e]"
                required
              />
            </label>

            {/* Password */}
            <label className="px-4 py-3 flex flex-col">
              <p className="text-base font-medium pb-2">Password</p>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="rounded-xl h-14 bg-[#e6e9f4] p-4 placeholder:text-[#47569e]"
                required
              />
            </label>

            {/* Confirm Password */}
            <label className="px-4 py-3 flex flex-col">
              <p className="text-base font-medium pb-2">Confirm Password</p>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="rounded-xl h-14 bg-[#e6e9f4] p-4 placeholder:text-[#47569e]"
                required
              />
            </label>

            <div className="px-4 py-3">
              <button
                type="submit"
                className="w-full bg-[#607afb] text-white rounded-xl h-12 font-bold"
              >
                Sign Up
              </button>
            </div>

            <p className="text-center text-[#47569e] text-sm underline">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
