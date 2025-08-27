import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Users, BarChart3, Shield } from 'lucide-react';

const WelcomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Easy Leave Applications',
      description: 'Submit and track your leave requests with just a few clicks'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'View team availability and manage approvals efficiently'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Get insights into leave patterns and absence ratios'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with complete audit trails'
    }
  ];

  return (
    <div className="page-container">
      <div className="container mx-auto px-4 py-16">
        {/* Welcome Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome {user?.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              to ED Leave Management System
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-primary hover:opacity-90 transition-all duration-300 ease-out h-12 px-8"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="h-12 px-8"
              onClick={() => navigate('/profile')}
            >
              View Profile
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="max-w-2xl mx-auto mb-16 shadow-medium">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary-foreground">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{user?.name}</h3>
                <p className="text-muted-foreground">{user?.department} Department</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{user?.annualLeaveBalance}</div>
                  <div className="text-sm text-muted-foreground">Days Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{user?.role}</div>
                  <div className="text-sm text-muted-foreground">Role</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="leave-card">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;