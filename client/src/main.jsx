import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store";
import { Toaster } from "./components/ui/sonner";
import { useLoadUserQuery } from "./features/api/authApi";
import { Loader } from "lucide-react";

const CustomComp = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return (
    <>
      {isLoading ? (
        <>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <Loader className="animate-spin h-16 w-16 text-blue-600" />
            <p className="mt-4 text-lg font-semibold text-gray-700">
              Loading, please wait...
            </p>
          </div>{" "}
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <CustomComp>
        <App />
        <Toaster />
      </CustomComp>
    </Provider>
  </StrictMode>
);
