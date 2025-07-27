import { Button } from "@/components/ui/button";
import { useSessionService } from "@/lib/service/session.service";
import { CheckCircle, OctagonX } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function DeclinedInvitePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { declineInvite } = useSessionService();
  const [message, setMessage] = useState("");

  // Refuser l'invitation
  const declineInvitation = async () => {
    if (token) {
      const { data, error } = await declineInvite(token);
      console.log("Decline Invite Response:", data, error);
      if (error) {
        toast.error("Erreur lors du refus de l'invitation:");
        setMessage("error");
      } else if (data) {
        toast.success("Invitation refusée avec succès:");
        setMessage("success");
      }
    }
  };

  // Appel de la fonction pour refuser l'invitation
  useEffect(() => {
    if (token) {
      declineInvitation();
    } else {
      toast.error("Invitation invalide ou expirée.");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted gap-6 flex-col">
      {message === "success" ? (
        <div className="max-w-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Invitation refusée</h1>
          <p className="text-gray-600 mb-6">
            Vous avez refusé l'invitation à rejoindre la session.
          </p>
          <CheckCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-sm text-gray-500">
            Si vous avez changé d'avis, vous pouvez demander une nouvelle
            invitation à l'administrateur de la session.
          </p>
        </div>
      ) : (
        <div className="max-w-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">
            Une erreur s'est produite lors du refus de l'invitation.
          </p>
          <OctagonX className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Veuillez réessayer plus tard.</p>
        </div>
      )}
      <Button onClick={() => (window.location.href = "/")}>
        Retour à l'accueil
      </Button>
    </div>
  );
}
