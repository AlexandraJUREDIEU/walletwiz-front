import { Logo } from '@/components/specifics/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthService } from '@/lib/service/auth.service';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function ResetPage() {
  // * Hooks
  const navigate = useNavigate();
  const { forgetPassword, resetPassword } = useAuthService();
  const [searchParams] = useSearchParams();

  // * State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      setStep(3);
    }
  }, []);

  // * Handlers
  const handleForget = async () => {
    const { error } = await forgetPassword(email);
    if (error) {
      console.error("Erreur lors de l'envoi du lien de réinitialisation:", error);
      return;
    } else {
      console.log(`Lien de réinitialisation envoyé à: ${email}`);
      step === 1 && setStep(2);
      if (step === 2) {
        // Disable the resend button for 30 seconds
        setResendDisabled(true);
        setTimeout(() => {
          setResendDisabled(false);
        }, 30000); // 30 seconds
      }
    }
  };

  const handleResetPassword = async () => {
    if (!token || !password) {
      toast.error('Veuillez fournir un token et un mot de passe.');
      return;
    }
    const { error } = await resetPassword(token, password);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Mot de passe réinitialisé avec succès');
      navigate('/auth/login');
      setStep(1);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-md mx-auto mt-12 px-4 space-y-6">
        <div className="text-center">
          <Logo />
          <h1>WalletWiz</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Il est temps de réinitialiser votre mot de passe
          </p>
        </div>
        {step === 1 && (
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-muted-foreground text-sm text-center">
              Si cette adresse email est associée à un compte, vous recevrez un lien de
              réinitialisation.
            </p>
            <Button className="w-full" onClick={handleForget} disabled={!email}>
              {'Recevoir le lien'}
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Un email de réinitialisation a été envoyé à <strong>{email}</strong>. Veuillez
              vérifier votre boîte de réception.
            </p>

            <Button className="mt-4 w-full" onClick={handleForget} disabled={resendDisabled}>
              {'Recevoir à nouveau le lien'}
            </Button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button className="w-full" onClick={handleResetPassword}>
              {'Réinitialiser le mot de passe'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
