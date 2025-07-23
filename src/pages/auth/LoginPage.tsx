import LoginForm from '@/components/forms/LoginForm'
import { useNavigate } from 'react-router-dom';


export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <LoginForm onLoginSuccess={() => navigate("/dashboard")} />
    </div>
  )
}