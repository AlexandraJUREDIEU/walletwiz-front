import RegisterForm from '@/components/forms/RegisterForm';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <RegisterForm onRegisterSuccess={() => navigate('/dashboard/profile')} />
    </div>
  );
}
