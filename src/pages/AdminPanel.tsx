import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useLeave, LeaveStatus, LeaveType } from '@/contexts/LeaveContext';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Eye,
  Calendar,
  User
} from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  const { getAllRequests, approveRequest, rejectRequest } = useLeave();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<LeaveType | 'All'>('All');

  const allRequests = getAllRequests();

  // Filter requests based on search and filters
  const filteredRequests = allRequests.filter(request => {
    const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.userDepartment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
    const matchesType = typeFilter === 'All' || request.leaveType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleApprove = (requestId: string) => {
    approveRequest(requestId);
    toast({
      title: "Request Approved",
      description: "The leave request has been approved successfully.",
    });
  };

  const handleReject = (requestId: string) => {
    rejectRequest(requestId);
    toast({
      title: "Request Rejected", 
      description: "The leave request has been rejected.",
      variant: "destructive",
    });
  };

  const getStatusIcon = (status: LeaveStatus) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusBadgeClass = (status: LeaveStatus) => {
    switch (status) {
      case 'Approved':
        return 'status-badge-approved';
      case 'Rejected':
        return 'status-badge-rejected';
      default:
        return 'status-badge-pending';
    }
  };

  // Statistics
  const stats = {
    total: allRequests.length,
    pending: allRequests.filter(r => r.status === 'Pending').length,
    approved: allRequests.filter(r => r.status === 'Approved').length,
    rejected: allRequests.filter(r => r.status === 'Rejected').length,
  };

  if (!user || (user.role !== 'manager' && user.role !== 'hr')) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                You don't have permission to access the admin panel.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Manage leave requests and team approvals
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="leave-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Requests</div>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
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

        {/* Filters and Search */}
        <Card className="leave-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={(value: LeaveStatus | 'All') => setStatusFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Leave Type</label>
                <Select value={typeFilter} onValueChange={(value: LeaveType | 'All') => setTypeFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                    <SelectItem value="Sick">Sick</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Results</label>
                <div className="text-sm text-muted-foreground bg-muted rounded-md p-3">
                  {filteredRequests.length} of {allRequests.length} requests
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredRequests.length === 0 ? (
              <Card className="leave-card">
                <CardContent className="p-8 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">No requests found</h3>
                  <p className="text-muted-foreground">
                    No leave requests match your current filters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="leave-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between space-x-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{request.userName}</h4>
                                <p className="text-sm text-muted-foreground">{request.userDepartment} Department</p>
                              </div>
                              <div className="text-right">
                                <Badge className={getStatusBadgeClass(request.status)}>
                                  {getStatusIcon(request.status)}
                                  <span className="ml-1">{request.status}</span>
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Type:</span>
                                <div className="font-medium">{request.leaveType}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Duration:</span>
                                <div className="font-medium">{request.duration} day{request.duration > 1 ? 's' : ''}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Start Date:</span>
                                <div className="font-medium">{new Date(request.startDate).toLocaleDateString()}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">End Date:</span>
                                <div className="font-medium">{new Date(request.endDate).toLocaleDateString()}</div>
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground text-sm">Reason:</span>
                              <p className="text-sm mt-1">{request.reason}</p>
                            </div>
                          </div>
                        </div>
                        
                        {request.status === 'Pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                              className="bg-success hover:bg-success/90 text-success-foreground"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(request.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            <div className="space-y-4">
              {filteredRequests.filter(r => r.status === 'Pending').map((request) => (
                <Card key={request.id} className="leave-card border-l-4 border-l-warning">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between space-x-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div>
                            <h4 className="font-semibold">{request.userName}</h4>
                            <p className="text-sm text-muted-foreground">{request.userDepartment} Department</p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Type:</span>
                              <div className="font-medium">{request.leaveType}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Duration:</span>
                              <div className="font-medium">{request.duration} day{request.duration > 1 ? 's' : ''}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Dates:</span>
                              <div className="font-medium">
                                {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Reason:</span>
                            <p className="text-sm mt-1">{request.reason}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="bg-success hover:bg-success/90 text-success-foreground"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="space-y-4">
              {filteredRequests.filter(r => r.status === 'Approved').map((request) => (
                <Card key={request.id} className="leave-card border-l-4 border-l-success">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{request.userName}</h4>
                            <p className="text-sm text-muted-foreground">{request.userDepartment} Department</p>
                          </div>
                          <Badge className="status-badge-approved">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approved
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <div className="font-medium">{request.leaveType}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <div className="font-medium">{request.duration} day{request.duration > 1 ? 's' : ''}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Dates:</span>
                            <div className="font-medium">
                              {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected">
            <div className="space-y-4">
              {filteredRequests.filter(r => r.status === 'Rejected').map((request) => (
                <Card key={request.id} className="leave-card border-l-4 border-l-destructive">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{request.userName}</h4>
                            <p className="text-sm text-muted-foreground">{request.userDepartment} Department</p>
                          </div>
                          <Badge className="status-badge-rejected">
                            <XCircle className="w-3 h-3 mr-1" />
                            Rejected
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <div className="font-medium">{request.leaveType}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <div className="font-medium">{request.duration} day{request.duration > 1 ? 's' : ''}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Dates:</span>
                            <div className="font-medium">
                              {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;