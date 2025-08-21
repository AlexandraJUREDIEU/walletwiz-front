import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 bg-background">
        <Outlet />
      </div>
    </div>
  );
}