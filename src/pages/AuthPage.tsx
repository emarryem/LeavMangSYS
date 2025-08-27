import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import heroImage from '@/assets/hero-image.jpg';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="auth-layout">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="hidden md:block space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight">
              ED Leave Management System
            </h1>
            <p className="text-xl text-white/80">
              Streamline your leave requests and approvals with our professional, 
              enterprise-grade management system.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-large">
            <img 
              src={heroImage} 
              alt="Professional office workspace"
              className="w-full h-80 object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-white">99%</div>
              <div className="text-sm text-white/70">Uptime</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-white/70">Support</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-white">Secure</div>
              <div className="text-sm text-white/70">Platform</div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex items-center justify-center">
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;