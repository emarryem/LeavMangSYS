import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2, UserPlus, User, Mail, Lock, Building } from 'lucide-react';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const departments = [
  'IT',
  'HR',
  'Finance',
  'Marketing',
  'Operations',
  'Sales',
  'Legal',
  'R&D'
];

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !department) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    const success = await register(name, email, password, department);
    
    if (!success) {
      toast({
        title: "Registration Failed",
        description: "Email already exists or password is too short.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-medium">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>Join the ED Leave Management System</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@ed.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Department
            </Label>
            <Select value={department} onValueChange={setDepartment} disabled={isLoading}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-primary hover:opacity-90 transition-all duration-300 ease-out"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="font-medium text-primary hover:underline"
              disabled={isLoading}
            >
              Sign In
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};