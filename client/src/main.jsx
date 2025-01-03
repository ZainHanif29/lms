import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store";
import { Toaster } from "./components/ui/sonner";
import { useLoadUserQuery } from "./features/api/authApi";

const CustomComp = ({ children }) => {
  const { isLoading } = useLoadUserQuery;
  return (
    <>
      {isLoading ? (
        <>
          <h1>Loading........................</h1>
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
