import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TaskManagerProvider } from "./context/TaskManagerContext";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TaskManagerProvider>
        <App />
      </TaskManagerProvider>
    </ThemeProvider>
  </React.StrictMode>
);
