
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

import { useAuth } from '../../app/providers/AuthContext';
import { ROLES } from '../../constants/roles';

import { Logo } from '../../components/shared/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const { error, user } = await signIn(
        identifier.trim(),
        password
      );

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      switch (user.role) {
        case ROLES.DOCTOR:
          navigate('/doctor/dashboard');
          break;

        case ROLES.HOSPITAL_ADMIN:
          navigate('/admin/dashboard');
          break;

        case ROLES.SUPER_ADMIN:
          navigate('/super-admin/dashboard');
          break;

        default:
          navigate('/patient/dashboard');
      }
    } catch (err) {
      console.error(err);

      setError('Login failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <Logo
              size={60}
              variant="dark"
            />
          </div>

          <h1 className="text-3xl font-bold text-center text-neutral-900 mb-2">
            Welcome Back
          </h1>

          <p className="text-center text-neutral-600 mb-8">
            Login with your Email or Fayda ID
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 flex items-start gap-2">
              <FiAlertCircle
                className="text-red-600 mt-0.5"
                size={18}
              />
              <span className="text-red-700 text-sm">
                {error}
              </span>
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email or Fayda ID
              </label>

              <Input
                type="text"
                value={identifier}
                onChange={(e) =>
                  setIdentifier(e.target.value)
                }
                placeholder="Enter email or Fayda ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
            </div>

            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
              
              disabled={loading}
            >
              {loading
                ? 'Signing In...'
                : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Register
              </Link>
            </p>
          </div>

          <div className="mt-8 border-t pt-6">
            <p className="text-xs text-neutral-500 text-center">
              Demo Accounts
            </p>              <div className="mt-3 text-xs text-neutral-600 space-y-1">
              <div>
                Admin: admin1@tenalink.com / admin123
              </div>
              <div>
                Doctor: doctor1@tenalink.com / doctor123
              </div>
              <div>
                Patient: patient1@tenalink.com / patient123
              </div>
              <div>
                Super Admin: super@tenalink.com / super123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}