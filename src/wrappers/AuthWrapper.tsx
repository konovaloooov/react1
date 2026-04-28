import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { getToken } from "../utils/tokenStorage";

const authOnlyPublicPaths = ["/login", "/register"];
const protectedPaths = [
  "/dashboard",
  "/profile",
  "/catalog",
  "/cart",
  "/admin",
  "/orders",
];

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { pathname } = useLocation();
  const token = getToken();
  const isAuthOnlyPublicPage = authOnlyPublicPaths.includes(pathname);
  const isPublicPage = pathname === "/" || isAuthOnlyPublicPage;
  const isProtectedPage = protectedPaths.includes(pathname);

  if (token && isAuthOnlyPublicPage) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (isProtectedPage && !token) {
    return <UnauthorizedPage from={pathname} />;
  }

  return <>{children}</>;
}
