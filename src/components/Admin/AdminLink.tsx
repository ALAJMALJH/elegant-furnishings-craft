
import React from 'react';
import { Link } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';

const AdminLink: React.FC = () => {
  // Check if user is already logged in
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // Determine where to link - dashboard if logged in, auth if not
  const linkTo = user && user.isAuthenticated ? '/admin/dashboard' : '/auth';
  
  return (
    <Link
      to={linkTo}
      className="flex items-center gap-1 text-sm text-furniture-dark/70 hover:text-furniture-accent transition-colors duration-200"
      title="Admin Access"
    >
      <LockKeyhole className="h-4 w-4" />
      <span className="hidden md:inline">Admin</span>
    </Link>
  );
};

export default AdminLink;
