import { useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LoginPage } from "./components/LoginPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  return <RouterProvider router={router} />;
}
