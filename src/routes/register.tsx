// src/components/RegisterForm.tsx
import { createSignal } from "solid-js";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "@solidjs/router";

export default function RegisterPage() {
  const [first_name, setFirstName] = createSignal("");
  const [last_name, setLastName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [role, setRole] = createSignal<"applicant" | "employer">("applicant");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: Event) => {
    e.preventDefault();
    try {
     const res = await auth.register({
        first_name: first_name(),
        last_name: last_name(),
        email: email(),
        password: password(),
      });
      //await auth.login(email(), password());
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err)
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="First Name"
        value={first_name()}
        onInput={(e) => setFirstName(e.currentTarget.value)}
        required
      />
       <input
        type="text"
        placeholder="Last Name"
        value={last_name()}
        onInput={(e) => setLastName(e.currentTarget.value)}
        required
      />
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
      <select
        value={role()}
        onChange={(e) =>
          setRole(e.currentTarget.value as "applicant" | "employer")
        }
      >
        <option value="applicant">Applicant</option>
        <option value="employer">Employer</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}
