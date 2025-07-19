import { Link } from "react-router-dom";
import logo from "@/assets/logo_walletwiz.png";

type LogoProps = {
  variant?: "small" | "medium" | "large";
};

export const Logo = ({ variant = "medium" }: LogoProps) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-14 w-12",
    large: "h-18 w-18",
  };

  return (
    <Link to="/" className="flex justify-center items-center m-2 gap-2">
      <img src={logo} alt="WalletWiz Logo" className={sizeClasses[variant]} />
    </Link>
  );
};