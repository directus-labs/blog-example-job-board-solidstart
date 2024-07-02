// src/components/ProtectedRoute.tsx
import { JSX } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = (props: { children: JSX.Element }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth.user()) {
     console.log(auth.user())
    // navigate("/login", { replace: true });
    return null;
  }

  return <>{props.children}</>;
};

export default ProtectedRoute;