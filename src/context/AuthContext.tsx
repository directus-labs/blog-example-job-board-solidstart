import {
  createContext,
  useContext,
  JSX,
  createSignal,
  createEffect,
} from "solid-js";
import { User } from "../types";
import getDirectusInstance from "~/lib/directus";
import { readMe, registerUser, withToken } from "@directus/sdk";

const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
};

const getCookie = (name: string): string | null => {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
};

const deleteCookie = (name: string) => {
  setCookie(name, "", -1);
};

interface AuthContextType {
  user: () => User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (user: Omit<User, "id">) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>();
const directus = getDirectusInstance();

export function AuthProvider(props: { children: JSX.Element }) {
  const [user, setUser] = createSignal<User | null>(null);
  const getToken = () => getCookie("auth_token") || "";

  createEffect(() => {
    const token = getToken();
    if (token) {
      directus.setToken(token);
      fetchUser();
    }
  });

  const fetchUser = async () => {
    try {
      const userData = await directus.request(
        withToken(
          getToken(),
          readMe({
            fields: ["*"],
            deep: {
              role: {
                fields: ["*"],
              },
            },
          })
        )
      );
      setUser(userData as User);
    } catch (error) {
      await logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await directus.login(email, password);
      setCookie("auth_token", result.access_token as string);
      directus.setToken(result.access_token);
      await fetchUser();
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const logout = async () => {
    try {
      await directus.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      deleteCookie("auth_token");
      directus.setToken(null);
    }
  };

  const register = async (newUser: Omit<User, "id">) => {
    try {
      await directus.request(
        registerUser('user@example.com', 'd1r3ctu5')
      );
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;
