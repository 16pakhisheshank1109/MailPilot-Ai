import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-error/10 border border-error/30 flex items-center justify-center text-error mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold font-headline text-on-surface mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-on-surface-variant max-w-sm mb-6">
        The workspace path you requested does not exist or has been moved.
      </p>
      <Button
        variant="primary"
        leftIcon={<Home className="w-4 h-4" />}
        onClick={() => navigate('/dashboard')}
      >
        Return to Dashboard
      </Button>
    </div>
  );
};
