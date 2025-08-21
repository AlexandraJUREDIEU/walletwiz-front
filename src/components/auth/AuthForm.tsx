import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthService } from "@/lib/service/auth.service";
import { useAuthStore } from "@/stores/authStore";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

//* Zod Schemas
const authSchema = z.object({
  email: z.email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});


type Props = { mode: "login" | "signup" };

export default function AuthForm({ mode }: Props) {
  const { login, signup, me } = useAuthService();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const [params] = useSearchParams();
  const from = params.get("from") || "/dashboard/home";
  const [submitting, setSubmitting] = useState(false);

  // 4) RHF relié à Zod
  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues:
      mode === "login"
        ? { email: "", password: "" }
        : { email: "", password: "", firstName: "", lastName: "" },
    mode: "onSubmit", // tu peux mettre "onChange" si tu veux valider au fil de l'eau
  });

  // 5) Submit
  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      // a) login/signup -> token
      const resp = mode === "login" ? await login(values) : await signup(values);
      const token = resp.access_token;

      // b) stocke le token (user null temporairement)
      setAuth(null, token);

      // c) /users/me -> hydrate l'utilisateur
      const user = await me();
      setUser(user);

      toast.success(mode === "login" ? "Bienvenue !" : "Compte créé, bienvenue !");
      window.location.href = from; // redirection vers la page d’origine ou /dashboard/home
    } catch {
      // useApi affiche déjà le toast d'erreur, on peut compléter si besoin
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Titre + lien alternatif */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">
          {mode === "login" ? "Se connecter" : "Créer un compte"}
        </h1>
        {mode === "login" ? (
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link to="/signup" className="underline">Inscrivez-vous</Link>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link to="/login" className="underline">Connectez-vous</Link>
          </p>
        )}
      </div>

      {/* Formulaire */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {mode === "signup" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Alex" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="vous@exemple.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer le compte"}
          </Button>
        </form>
      </Form>
    </div>
  );
}