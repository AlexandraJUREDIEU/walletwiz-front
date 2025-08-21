import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthService } from "@/lib/service/auth.service";
import { useAuthStore } from "@/stores/authStore";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useTranslation } from "react-i18next";

type Props = { mode: "login" | "signup" };

export default function AuthForm({ mode }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, signup, me } = useAuthService();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const [params] = useSearchParams();
  const from = params.get("from") || "/dashboard/home";
  const [submitting, setSubmitting] = useState(false);
  
  //* Zod Schemas
    const authSchema = useMemo(() => z.object({
      email: z.email(t("form.validations.emailInvalid")),
      password: z.string().min(6, t("form.validations.passwordMin")),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }), [t]);

  //* RHF relié à Zod
  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues:
      mode === "login"
        ? { email: "", password: "" }
        : { email: "", password: "", firstName: "", lastName: "" },
    mode: "onSubmit", // tu peux mettre "onChange" si tu veux valider au fil de l'eau
  });

  //* Submit
  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      // a) login/signup -> token
      const resp =
        mode === "login" ? await login(values) : await signup(values);
      const token = resp.access_token;

      // b) stocke le token (user null temporairement)
      setAuth(null, token);

      // c) /users/me -> hydrate l'utilisateur
      const user = await me();
      setUser(user);

      toast.success(
        mode === "login" ? t("toast.welcome") : t("toast.accountCreated")
      );
      navigate(from); // redirection vers la page d’origine ou /dashboard/home
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
          {mode === "login" ? t("auth.login") : t("auth.signup")}
        </h1>
        {mode === "login" ? (
          <p className="text-sm text-muted-foreground">
            {t("auth.noAccount")}{" "}
            <Link to="/signup" className="underline">
              {t("nav.signup")}
            </Link>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("auth.haveAccount")}{" "}
            <Link to="/login" className="underline">
              {t("nav.login")}
            </Link>
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
                    <FormLabel>{t("form.firstName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("form.placeholders.firstName")} {...field} />
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
                    <FormLabel>{t("form.lastName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("form.placeholders.lastName")} {...field} />
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
                <FormLabel>{t("form.email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("form.placeholders.email")}
                    {...field}
                  />
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
                <FormLabel>{t("form.password")}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={t("form.placeholders.password")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting
              ? t("cta.loading")
              : mode === "login"
              ? t("cta.signIn")
              : t("cta.createAccount")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
