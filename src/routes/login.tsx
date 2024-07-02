// src/components/LoginForm.tsx
import { createSignal } from "solid-js";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "@solidjs/router";

export default function LoginPage() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    try {
      await auth.login(email(), password());
      navigate("/", { replace: true });
    } catch (err) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email()}
        onInput={(e) => setEmail(e.currentTarget.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password()}
        onInput={(e) => setPassword(e.currentTarget.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
