// import { AuthProvider } from "./context/AuthContext";
// import MainContent from "./components/MainContent";
// import './app.css'
// import { Router, Route } from "@solidjs/router";

// function App() {
//   return (
//     <AuthProvider>
//       <MainContent />
//     </AuthProvider>
//   );
// }

// export default App;

// src/App.tsx
import { Router,  Route } from "@solidjs/router";
import { AuthProvider } from "./context/AuthContext";
import { Suspense } from "solid-js";
import { FileRoutes } from "@solidjs/start/router";

export default function App() {
  return (
    <AuthProvider>
    <Router root={props => <Suspense>{props.children}</Suspense>}>
      <FileRoutes />
    </Router>
    </AuthProvider>
  );
}