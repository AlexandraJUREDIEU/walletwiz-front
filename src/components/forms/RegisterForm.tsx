import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthService } from "@/lib/service/auth.service";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  //* Hooks
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { register, verifyOtp } = useAuthService();

  //* State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"register" | "otp">("register");
  const [loading, setLoading] = useState(false);

  //* Handlers
  // 🔹 Gestion de l'inscription
  const handleRegister = async () => {
    setLoading(true);
    const { error } = await register({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Vérifie ta boîte mail pour le code");
      setStep("otp");
    }
  };

  // 🔹 Gestion de la vérification de l'OTP
  const handleVerify = async () => {
    setLoading(true);
    const { data, error } = await verifyOtp({ email, code: otp });
    setLoading(false);

    if (error) {
      toast.error(error);
    } else if (data) {
      console.log("➡️ login response:", data);
      setAuth(data.user, data.accessToken);
      toast.success("Inscription réussie !");
      navigate("/dashboard/profile");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 px-4 space-y-6">
      {/* Titre de l’app */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">WalletWiz</h1>
        <p className="text-muted-foreground text-sm mt-1">
          L’app pour gérer ton budget au quotidien
        </p>
      </div>

      {/* Formulaire */}
      <div className="space-y-4">
        {step === "register" && (
          <>
            <Input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
            <Button
              className="w-full"
              onClick={handleRegister}
              disabled={loading || !email || !password}
            >
              {loading ? "Envoi du mail..." : "Créer un compte"}
            </Button>
            <p className="text-sm text-center text-muted-foreground mt-4">
              Déjà inscrit ?{" "}
              <Link
                to="/auth/login"
                className="text-primary underline hover:opacity-80"
              >
                Se connecter
              </Link>
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="text-sm text-muted-foreground text-center">
              Un code a été envoyé à <strong>{email}</strong>
            </div>

            <InputOTP maxLength={6} value={otp} onChange={setOtp} className="">
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Button
              className="w-full mt-4"
              onClick={handleVerify}
              disabled={loading || otp.length < 6}
            >
              {loading ? "Vérification..." : "Valider le code"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
