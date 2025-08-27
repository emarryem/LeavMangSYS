import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useLeave } from '@/contexts/LeaveContext';
import { 
  User, 
  Mail, 
  Building, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const { getMyRequests } = useLeave();
  
  const myRequests = getMyRequests();
  const approvedRequests = myRequests.filter(r => r.status === 'Approved');
  
  // Calculate used leave days by type
  const leaveUsage = {
    Annual: approvedRequests.filter(r => r.leaveType === 'Annual').reduce((sum, r) => sum + r.duration, 0),
    Sick: approvedRequests.filter(r => r.leaveType === 'Sick').reduce((sum, r) => sum + r.duration, 0),
    Personal: approvedRequests.filter(r => r.leaveType === 'Personal').reduce((sum, r) => sum + r.duration, 0),
    Emergency: approvedRequests.filter(r => r.leaveType === 'Emergency').reduce((sum, r) => sum + r.duration, 0),
    Unpaid: approvedRequests.filter(r => r.leaveType === 'Unpaid').reduce((sum, r) => sum + r.duration, 0),
  };

  const totalUsedDays = Object.values(leaveUsage).reduce((sum, days) => sum + days, 0);
  const remainingDays = user?.annualLeaveBalance || 0;

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

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            View your personal information and leave history
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="leave-card">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary-foreground">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
                <CardTitle className="text-2xl">{user?.name}</CardTitle>
                <CardDescription className="text-base">
                  {user?.department} Department
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{user?.department} Department</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm capitalize">{user?.role}</span>
                </div>
              </CardContent>
            </Card>

            {/* Leave Balance */}
            <Card className="stats-card">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <div className="text-3xl font-bold mb-2">{remainingDays}</div>
                <div className="text-sm opacity-90 mb-4">Annual Leave Days Remaining</div>
                <div className="text-xs opacity-75">
                  Out of 21 allocated days
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leave Statistics and History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Leave Usage Statistics */}
            <Card className="leave-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Leave Usage Statistics
                </CardTitle>
                <CardDescription>
                  Breakdown of your leave usage by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(leaveUsage).map(([type, days]) => (
                    <div key={type} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{days}</div>
                      <div className="text-sm text-muted-foreground">{type}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {days === 1 ? 'day' : 'days'} used
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Leave Days Used:</span>
                    <span className="text-xl font-bold text-primary">{totalUsedDays} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request History */}
            <Card className="leave-card">
              <CardHeader>
                <CardTitle>Leave Request History</CardTitle>
                <CardDescription>
                  All your leave requests and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Leave Requests</h3>
                    <p>You haven't submitted any leave requests yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{request.leaveType} Leave</h4>
                              <p className="text-sm text-muted-foreground">
                                {request.duration} day{request.duration > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(request.status)}
                            <Badge className={getStatusBadgeClass(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Start Date:</span>
                            <div className="font-medium">{new Date(request.startDate).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">End Date:</span>
                            <div className="font-medium">{new Date(request.endDate).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Applied On:</span>
                            <div className="font-medium">{new Date(request.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground text-sm">Reason:</span>
                          <p className="text-sm mt-1">{request.reason}</p>
                        </div>
                        
                        {request.attachment && (
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-muted-foreground">Attachment:</span>
                            <span className="text-primary underline">{request.attachment}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;