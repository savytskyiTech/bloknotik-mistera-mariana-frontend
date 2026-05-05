import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { InstructorApp } from "./components/InstructorApp";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  return <InstructorApp />;
}
