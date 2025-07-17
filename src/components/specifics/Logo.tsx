import { Link } from "react-router-dom";
import logo from "@/assets/logo_walletwiz.png";

export const Logo = () => {
  return (
    <Link to="/" className="flex justify-center items-center m-2 gap-2">
      <img src={logo} alt="WalletWiz Logo" className="h-14 w-14" />
    </Link>
  );
};