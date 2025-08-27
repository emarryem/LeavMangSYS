import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navbar } from '@/components/layout/Navbar';
import { useLeave, LeaveType } from '@/contexts/LeaveContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [attachment, setAttachment] = useState('');
  const { submitLeaveRequest } = useLeave();
  const { user } = useAuth();
  const navigate = useNavigate();

  const leaveTypeRules = {
    Annual: {
      maxDays: 21,
      minNotice: 3,
      requiresAttachment: false,
      description: 'Annual vacation leave with pay',
      rules: ['Maximum 21 days per year', 'Minimum 3 days notice required', 'Subject to approval']
    },
    Sick: {
      maxDays: 3,
      minNotice: 0,
      requiresAttachment: true,
      description: 'Medical leave for illness',
      rules: ['Medical certificate required for >1 day', 'Maximum 3 consecutive days without certificate', 'Immediate approval for emergencies']
    },
    Personal: {
      maxDays: 0.5,
      minNotice: 1,
      requiresAttachment: false,
      description: 'Personal permission (max 4 hours)',
      rules: ['Maximum 4 hours per request', 'Maximum 3 times per month', 'Must be within working hours']
    },
    Emergency: {
      maxDays: 2,
      minNotice: 0,
      requiresAttachment: false,
      description: 'Emergency situations',
      rules: ['Maximum 1-2 days', 'Retroactive allowed within 24h', 'Frequent use may be flagged']
    },
    Unpaid: {
      maxDays: 30,
      minNotice: 7,
      requiresAttachment: false,
      description: 'Unpaid leave of absence',
      rules: ['Must exhaust paid leave first', 'HR approval required', 'Usually limited to 30 days']
    }
  };

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const validateRequest = () => {
    const rules = leaveTypeRules[leaveType];
    const duration = calculateDuration();
    const errors = [];

    if (!startDate || !endDate || !reason) {
      errors.push('Please fill in all required fields');
    }

    if (duration > rules.maxDays && leaveType !== 'Personal') {
      errors.push(`${leaveType} leave cannot exceed ${rules.maxDays} days`);
    }

    if (leaveType === 'Personal' && duration > 0.5) {
      errors.push('Personal permission cannot exceed 4 hours (0.5 days)');
    }

    if (rules.requiresAttachment && !attachment) {
      errors.push('Medical certificate is required for sick leave');
    }

    const noticeRequired = rules.minNotice;
    if (noticeRequired > 0) {
      const today = new Date();
      const requestDate = new Date(startDate);
      const daysDiff = Math.ceil((requestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < noticeRequired) {
        errors.push(`Minimum ${noticeRequired} days notice required for ${leaveType} leave`);
      }
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateRequest();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors[0],
        variant: "destructive",
      });
      return;
    }

    const duration = calculateDuration();
    
    submitLeaveRequest({
      leaveType,
      startDate,
      endDate,
      duration,
      reason,
      attachment: attachment || undefined
    });

    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted for approval.",
    });

    navigate('/dashboard');
  };

  const currentRules = leaveTypeRules[leaveType];
  const duration = calculateDuration();
  const validationErrors = validateRequest();

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Apply for Leave</h1>
              <p className="text-muted-foreground">Submit a new leave request</p>
            </div>
          </div>

          {/* Leave Type Rules */}
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">{leaveType} Leave Policy:</div>
                <ul className="text-sm space-y-1">
                  {currentRules.rules.map((rule, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Form */}
          <Card className="leave-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Leave Application Form</span>
              </CardTitle>
              <CardDescription>{currentRules.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type *</Label>
                  <Select value={leaveType} onValueChange={(value: LeaveType) => setLeaveType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Annual">Annual Leave</SelectItem>
                      <SelectItem value="Sick">Sick Leave</SelectItem>
                      <SelectItem value="Personal">Personal Permission</SelectItem>
                      <SelectItem value="Emergency">Emergency Leave</SelectItem>
                      <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {duration > 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Duration:</span>
                      <span className="text-lg font-bold text-primary">
                        {duration} day{duration > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a detailed reason for your leave request..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                  />
                </div>

                {currentRules.requiresAttachment && (
                  <div className="space-y-2">
                    <Label htmlFor="attachment">
                      Medical Certificate * 
                      <span className="text-sm text-muted-foreground ml-2">(Required for sick leave)</span>
                    </Label>
                    <Input
                      id="attachment"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setAttachment(e.target.files?.[0]?.name || '')}
                    />
                  </div>
                )}

                {validationErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      <ul className="space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                    disabled={validationErrors.length > 0}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Request
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;