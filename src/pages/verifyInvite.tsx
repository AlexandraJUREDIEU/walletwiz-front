import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSessionService } from "@/lib/service/session.service";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyInvitePage() {
  // Extraire le token d'invitation de l'URL (`https://wallet-wiz.alexandrajuredieu.fr/invite?token=${inviteToken}`)
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { verifyInviteLink } = useSessionService();

  // Vérifier le lien d'invitation
  const verifyInvite = async () => {
    if (token) {
      const { data, error } = await verifyInviteLink(token);
      if (error) {
        toast.error("Erreur lors de la vérification du lien d'invitation:");
        // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
      } else if (data) {
        toast.success("Invitation vérifiée avec succès:");
        // Gérer le succès (par exemple, rediriger l'utilisateur vers une page de confirmation)
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted gap-6 flex-col md:flex-row">
      <div className="flex flex-col text-center justify-center md:border-r md:pr-6 gap-3 md:w-1/3">
        <h1>Rejoignez-nous !</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Vous avez reçu une <strong>invitation</strong> pour rejoindre un budget. <strong>Connectez vous ou inscrivez vous </strong>pour vérifier votre invitation.
        </p>
        <Button onClick={verifyInvite} className="hidden md:block mt-12 w-full">
          Vérifier l'invitation
        </Button>
      </div>
        {/* toggle bouton 'j'ai un compte' 'nouveau compte' */}
        <Tabs defaultValue="register" >
          <TabsList className="w-full">
            <TabsTrigger value="login">Je me connecte</TabsTrigger>
            <TabsTrigger value="register">Nouvel Utilisateur</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <LoginForm />
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <RegisterForm />
            </Card>
          </TabsContent>
        </Tabs>
      </div>

  );
}
