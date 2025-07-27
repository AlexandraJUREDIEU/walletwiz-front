import LoginForm from '@/components/forms/LoginForm';
import RegisterForm from '@/components/forms/RegisterForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSessionService } from '@/lib/service/session.service';
import { useAuthStore } from '@/stores/authStore';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function VerifyInvitePage() {
  // Extraire le token d'invitation de l'URL (`https://wallet-wiz.alexandrajuredieu.fr/invite?token=${inviteToken}`)
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const user = useAuthStore((state) => state.user);
  const { verifyInviteLink, acceptInvite } = useSessionService();
  const [message, setMessage] = useState('');
  const [userInvited, setUserInvited] = useState('');
  const navigate = useNavigate();

  // Vérifier le lien d'invitation
  const verifyInvite = async () => {
    if (token) {
      const { data, error } = await verifyInviteLink(token);
      console.log('Verify Invite Response:', data, error);
      if (error) {
        toast.error("Erreur lors de la vérification du lien d'invitation:");
        // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
      } else if (data) {
        toast.success('Invitation vérifiée avec succès:');
        setUserInvited(data.invitedEmail);
        setMessage(`Utilisateur invité : ${data.invitedEmail}`);
      }
    }
  };

  // Accepter l'invitation
  const acceptInvitation = async () => {
    if (token && userInvited === user?.email) {
      const { data, error } = await acceptInvite(token);
      console.log('Accept Invite Response:', data, error);
      if (error) {
        toast.error("Erreur lors de l'acceptation de l'invitation:");
      } else if (data) {
        toast.success('Invitation acceptée avec succès:');
        navigate('/dashboard/home');
      }
    } else {
      toast.error("Vous devez être connecté avec l'email de l'invitation pour l'accepter.");
    }
  };

  useEffect(() => {
    if (token) {
      verifyInvite();
    } else {
      setMessage('Invitation invalide ou expirée.');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted gap-6 flex-col md:flex-row">
      <div className="flex flex-col text-center justify-center md:border-r md:pr-6 gap-3 md:w-1/3">
        <h1>Rejoignez-nous !</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Vous avez reçu une <strong>invitation</strong> pour rejoindre un budget.{' '}
          <strong>Connectez vous</strong> ou <strong>inscrivez vous</strong> pour vérifier votre
          invitation.
        </p>
        <p className="text-xs md:text-sm text-muted-foreground">{message}</p>
      </div>
      {/* toggle bouton 'j'ai un compte' 'nouveau compte' */}
      {userInvited === user?.email ? (
        <div className="flex flex-col items-center justify-center gap-4 md:w-1/3">
          <CheckCircle className="w-16 h-16 text-primary mb-4 animate-success-pop" />
          <h2 className="text-xl font-bold mb-2 animate-fade-in">Invitation acceptée !</h2>
          <Button onClick={acceptInvitation} className="mt-4 w-full">
            Rejoindre la session
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="register">
          <TabsList className="w-full">
            <TabsTrigger value="login">Je me connecte</TabsTrigger>
            <TabsTrigger value="register">Nouvel Utilisateur</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <LoginForm onLoginSuccess={() => setMessage('Vous êtes connecté avec succès.')} />
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <RegisterForm onRegisterSuccess={() => setMessage('Inscription réussie.')} />
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
