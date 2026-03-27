import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  return <AppRoutes />;
}

export default App;