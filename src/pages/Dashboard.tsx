import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useLeave, LeaveType } from '@/contexts/LeaveContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Briefcase,
  Heart,
  User,
  Zap,
  DollarSign
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { getMyRequests } = useLeave();
  const navigate = useNavigate();
  const myRequests = getMyRequests();

  const leaveTypes: { type: LeaveType; icon: any; color: string; description: string; maxDays?: string }[] = [
    { 
      type: 'Annual', 
      icon: Calendar, 
      color: 'bg-blue-500', 
      description: 'Paid vacation leave',
      maxDays: '21 days/year'
    },
    { 
      type: 'Sick', 
      icon: Heart, 
      color: 'bg-red-500', 
      description: 'Medical leave',
      maxDays: '3 days w/o certificate'
    },
    { 
      type: 'Personal', 
      icon: User, 
      color: 'bg-green-500', 
      description: 'Personal permission',
      maxDays: '4 hours max'
    },
    { 
      type: 'Emergency', 
      icon: Zap, 
      color: 'bg-orange-500', 
      description: 'Urgent situations',
      maxDays: '1-2 days'
    },
    { 
      type: 'Unpaid', 
      icon: DollarSign, 
      color: 'bg-gray-500', 
      description: 'Unpaid leave',
      maxDays: 'HR approval required'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'status-badge-approved';
      case 'Rejected':
        return 'status-badge-rejected';
      default:
        return 'status-badge-pending';
    }
  };

  const stats = {
    pending: myRequests.filter(r => r.status === 'Pending').length,
    approved: myRequests.filter(r => r.status === 'Approved').length,
    rejected: myRequests.filter(r => r.status === 'Rejected').length,
  };

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your leave requests and view your balance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{user?.annualLeaveBalance}</div>
                  <div className="text-sm opacity-90">Days Remaining</div>
                </div>
                <Calendar className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="leave-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-warning">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="leave-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-success">{stats.approved}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="leave-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Leave Types */}
          <Card className="leave-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Leave Types
                <Button 
                  onClick={() => navigate('/apply-leave')}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Apply Leave
                </Button>
              </CardTitle>
              <CardDescription>
                Available leave types and their policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaveTypes.map((leave) => (
                <div key={leave.type} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-all duration-300 ease-out">
                  <div className={`w-10 h-10 ${leave.color} rounded-lg flex items-center justify-center`}>
                    <leave.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{leave.type} Leave</div>
                    <div className="text-sm text-muted-foreground">{leave.description}</div>
                    {leave.maxDays && (
                      <div className="text-xs text-muted-foreground mt-1">{leave.maxDays}</div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* My Requests */}
          <Card className="leave-card">
            <CardHeader>
              <CardTitle>My Requests</CardTitle>
              <CardDescription>
                Recent leave request history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No leave requests found</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/apply-leave')}
                  >
                    Apply for Leave
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{request.leaveType} Leave</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {request.duration} day{request.duration > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <Badge className={getStatusBadgeClass(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {myRequests.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" onClick={() => navigate('/profile')}>
                        View All Requests
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;