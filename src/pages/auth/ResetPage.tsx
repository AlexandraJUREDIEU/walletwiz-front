import { Logo } from '@/components/specifics/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthService } from '@/lib/service/auth.service';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

export default function ResetPage() {
  // * Hooks
//   const navigate = useNavigate();
  const { forgetPassword } = useAuthService();

  // * State management
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [resendDisabled, setResendDisabled] = useState(false);

  // * Handlers
  const handleForget = async () => {
    const { error } = await forgetPassword(email);
    if (error) {
      console.error('Erreur lors de l\'envoi du lien de réinitialisation:', error);
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
              Un email de réinitialisation a été envoyé à <strong>{email}</strong>. Veuillez vérifier votre boîte de
              réception.
            </p>

            <Button className="mt-4 w-full" onClick={handleForget} disabled={resendDisabled}>
              {'Recevoir à nouveau le lien'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
