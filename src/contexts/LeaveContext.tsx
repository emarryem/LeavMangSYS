import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type LeaveType = 'Annual' | 'Sick' | 'Personal' | 'Emergency' | 'Unpaid';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userDepartment: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: LeaveStatus;
  attachment?: string;
  createdAt: string;
  updatedAt: string;
  approver?: {
    lineManager?: LeaveStatus;
    hr?: LeaveStatus;
  };
}

interface LeaveContextType {
  requests: LeaveRequest[];
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'userId' | 'userName' | 'userDepartment' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  getMyRequests: () => LeaveRequest[];
  getAllRequests: () => LeaveRequest[];
  getAbsenceRatio: (userId: string, year: number) => { [key in LeaveType]: number };
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

// Mock leave requests for demonstration
const mockRequests: LeaveRequest[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Mariam Ahmed',
    userDepartment: 'IT',
    leaveType: 'Annual',
    startDate: '2025-01-15',
    endDate: '2025-01-17',
    duration: 3,
    reason: 'Personal vacation',
    status: 'Approved',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-02T14:30:00Z',
    approver: { lineManager: 'Approved', hr: 'Approved' }
  },
  {
    id: '2',
    userId: '1',
    userName: 'Mariam Ahmed',
    userDepartment: 'IT',
    leaveType: 'Sick',
    startDate: '2025-01-20',
    endDate: '2025-01-20',
    duration: 1,
    reason: 'Medical appointment',
    status: 'Pending',
    createdAt: '2025-01-18T09:15:00Z',
    updatedAt: '2025-01-18T09:15:00Z'
  }
];


export const LeaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    // Load requests from localStorage
    const storedRequests = localStorage.getItem('ed-leave-requests');
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    } else {
      setRequests(mockRequests);
    }
  }, []);

  useEffect(() => {
    // Save requests to localStorage whenever they change
    localStorage.setItem('ed-leave-requests', JSON.stringify(requests));
  }, [requests]);

  const submitLeaveRequest = (requestData: Omit<LeaveRequest, 'id' | 'userId' | 'userName' | 'userDepartment' | 'status' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const newRequest: LeaveRequest = {
      ...requestData,
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userDepartment: user.department,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests(prev => [newRequest, ...prev]);
  };

  const approveRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'Approved' as LeaveStatus, updatedAt: new Date().toISOString() }
        : req
    ));
  };

  const rejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'Rejected' as LeaveStatus, updatedAt: new Date().toISOString() }
        : req
    ));
  };

  const getMyRequests = (): LeaveRequest[] => {
    if (!user) return [];
    return requests.filter(req => req.userId === user.id);
  };

  const getAllRequests = (): LeaveRequest[] => {
    return requests;
  };

  const getAbsenceRatio = (userId: string, year: number): { [key in LeaveType]: number } => {
    const userRequests = requests.filter(req => 
      req.userId === userId && 
      req.status === 'Approved' &&
      new Date(req.startDate).getFullYear() === year
    );

    const totalDays = userRequests.reduce((sum, req) => sum + req.duration, 0);
    
    const ratios = {
      Annual: 0,
      Sick: 0,
      Personal: 0,
      Emergency: 0,
      Unpaid: 0
    };

    if (totalDays === 0) return ratios;

    userRequests.forEach(req => {
      ratios[req.leaveType] += (req.duration / totalDays) * 100;
    });

    return ratios;
  };

  return (
    <LeaveContext.Provider value={{
      requests,
      submitLeaveRequest,
      approveRequest,
      rejectRequest,
      getMyRequests,
      getAllRequests,
      getAbsenceRatio
    }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};