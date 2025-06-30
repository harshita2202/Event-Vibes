import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axiosInstance';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleToggle = () => {
    setIsSignup(!isSignup);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', signInData);
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/register', signUpData);
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="login-wrapper">
      <div className={`cont ${isSignup ? 's--signup' : ''}`}>
        <form className="form sign-in" onSubmit={handleSignIn}>
          <h2>Welcome</h2>
          <label>
            <span>Email</span>
            <input
              type="email"
              required
              value={signInData.email}
              onChange={(e) =>
                setSignInData({ ...signInData, email: e.target.value })
              }
            />
          </label>
          <label>
            <span>Password</span>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={signInData.password}
                onChange={(e) =>
                  setSignInData({ ...signInData, password: e.target.value })
                }
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </label>
          <p className="forgot-pass">Forgot password?</p>
          <button type="submit" className="submit">
            Sign In
          </button>
        </form>

        <div className="sub-cont">
          <div className="img">
            <div className="img__text m--up">
              <h3>Don't have an account? Please Sign up!</h3>
            </div>
            <div className="img__text m--in">
              <h3>If you already have an account, just sign in.</h3>
            </div>
            <div className="img__btn" onClick={handleToggle}>
              <span className="m--up">Sign Up</span>
              <span className="m--in">Sign In</span>
            </div>
          </div>

          <form className="form sign-up" onSubmit={handleSignUp}>
            <h2>Create your Account</h2>
            <label>
              <span>Name</span>
              <input
                type="text"
                required
                value={signUpData.name}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, name: e.target.value })
                }
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                required
                value={signUpData.email}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, email: e.target.value })
                }
              />
            </label>
            <label>
              <span>Password</span>
              <div className="password-field">
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  required
                  value={signUpData.password}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, password: e.target.value })
                  }
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  {showSignupPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </label>
            <button type="submit" className="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;