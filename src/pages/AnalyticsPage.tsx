import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useLeave } from '@/contexts/LeaveContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Users, 
  Calendar,
  Download
} from 'lucide-react';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const { getAbsenceRatio, getAllRequests } = useLeave();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedUserId, setSelectedUserId] = useState(user?.id || '');
  
  const allRequests = getAllRequests();
  
  // Get unique users from requests
  const uniqueUsers = Array.from(
    new Set(allRequests.map(r => r.userId))
  ).map(userId => {
    const userRequest = allRequests.find(r => r.userId === userId);
    return {
      id: userId,
      name: userRequest?.userName || '',
      department: userRequest?.userDepartment || ''
    };
  });

  // Get absence ratio data
  const absenceRatio = getAbsenceRatio(selectedUserId, selectedYear);
  
  // Prepare data for charts
  const pieData = Object.entries(absenceRatio)
    .filter(([_, ratio]) => ratio > 0)
    .map(([leaveType, ratio]) => ({
      name: leaveType,
      value: ratio,
      color: getLeaveTypeColor(leaveType)
    }));

  const barData = Object.entries(absenceRatio).map(([leaveType, ratio]) => ({
    leaveType,
    ratio: parseFloat(ratio.toFixed(1)),
    color: getLeaveTypeColor(leaveType)
  }));

  // Calculate department statistics
  const departmentStats = allRequests
    .filter(r => r.status === 'Approved' && new Date(r.startDate).getFullYear() === selectedYear)
    .reduce((acc, request) => {
      const dept = request.userDepartment;
      if (!acc[dept]) {
        acc[dept] = { department: dept, totalDays: 0, requests: 0 };
      }
      acc[dept].totalDays += request.duration;
      acc[dept].requests += 1;
      return acc;
    }, {} as Record<string, { department: string; totalDays: number; requests: number }>);

  const departmentChartData = Object.values(departmentStats);

  // Overall statistics
  const yearRequests = allRequests.filter(r => 
    new Date(r.startDate).getFullYear() === selectedYear
  );
  
  const stats = {
    totalRequests: yearRequests.length,
    approvedRequests: yearRequests.filter(r => r.status === 'Approved').length,
    totalLeaveDays: yearRequests
      .filter(r => r.status === 'Approved')
      .reduce((sum, r) => sum + r.duration, 0),
    averageDuration: yearRequests.length > 0 
      ? (yearRequests.reduce((sum, r) => sum + r.duration, 0) / yearRequests.length).toFixed(1)
      : 0
  };

  function getLeaveTypeColor(leaveType: string) {
    const colors = {
      Annual: '#3B82F6',
      Sick: '#EF4444',
      Personal: '#10B981',
      Emergency: '#F59E0B',
      Unpaid: '#6B7280'
    };
    return colors[leaveType as keyof typeof colors] || '#6B7280';
  }

  const selectedUserName = uniqueUsers.find(u => u.id === selectedUserId)?.name || 'Unknown';
  const hasData = pieData.length > 0;

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Analyze leave patterns and absence ratios
          </p>
        </div>

        {/* Filters */}
        <Card className="leave-card">
          <CardHeader>
            <CardTitle>Analysis Filters</CardTitle>
            <CardDescription>Select parameters for your analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Employee</label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Export</label>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-all duration-300 ease-out">
                    <Download className="w-4 h-4" />
                    <span>PDF</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-all duration-300 ease-out">
                    <Download className="w-4 h-4" />
                    <span>Excel</span>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="stats-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.totalRequests}</div>
                  <div className="text-sm opacity-90">Total Requests</div>
                </div>
                <Calendar className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="leave-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-success">{stats.approvedRequests}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="leave-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.totalLeaveDays}</div>
                  <div className="text-sm text-muted-foreground">Total Days</div>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="leave-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-warning">{stats.averageDuration}</div>
                  <div className="text-sm text-muted-foreground">Avg Duration</div>
                </div>
                <BarChart3 className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Absence Ratio Pie Chart */}
          <Card className="leave-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                Absence Ratio by Leave Type
              </CardTitle>
              <CardDescription>
                {selectedUserName} - {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${typeof value === 'number' ? value.toFixed(1) : value}%`, 'Ratio']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <PieChartIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No leave data available for the selected parameters</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leave Type Bar Chart */}
          <Card className="leave-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Leave Type Distribution
              </CardTitle>
              <CardDescription>
                Percentage breakdown by leave type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="leaveType" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Ratio']} />
                  <Bar dataKey="ratio" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Analysis */}
        {user?.role !== 'employee' && (
          <Card className="leave-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Department Analysis
              </CardTitle>
              <CardDescription>
                Leave statistics by department for {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {departmentChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalDays" fill="#3B82F6" name="Total Days" />
                    <Bar dataKey="requests" fill="#10B981" name="Total Requests" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No department data available for {selectedYear}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Detailed Statistics Table */}
        <Card className="leave-card">
          <CardHeader>
            <CardTitle>Detailed Statistics</CardTitle>
            <CardDescription>
              Complete breakdown of absence ratios for {selectedUserName} in {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Leave Type</th>
                    <th className="text-right p-2 font-medium">Percentage</th>
                    <th className="text-right p-2 font-medium">Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(absenceRatio).map(([leaveType, ratio]) => (
                    <tr key={leaveType} className="border-b">
                      <td className="p-2 flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: getLeaveTypeColor(leaveType) }}
                        />
                        <span>{leaveType} Leave</span>
                      </td>
                      <td className="text-right p-2 font-medium">
                        {ratio.toFixed(1)}%
                      </td>
                      <td className="text-right p-2">
                        <div className="w-full bg-muted rounded-full h-2 inline-block max-w-[100px]">
                          <div
                            className="h-2 rounded-full"
                            style={{ 
                              backgroundColor: getLeaveTypeColor(leaveType),
                              width: `${Math.max(ratio, 2)}%`
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;