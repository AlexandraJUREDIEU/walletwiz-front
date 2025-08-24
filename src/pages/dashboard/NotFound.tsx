import { Link } from "react-router-dom";

export default function DashboardNotFound() {
  return (
    <div className="p-3 sm:p-6 space-y-2 text-sm">
      <div className="text-base sm:text-lg font-medium">Page introuvable</div>
      <div className="text-muted-foreground">
        Vérifie l’URL ou reviens à l’accueil du tableau de bord.
      </div>
      <Link to="/dashboard/home" className="text-primary underline underline-offset-4">
        Retour au dashboard
      </Link>
    </div>
  );
}