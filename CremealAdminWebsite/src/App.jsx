import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./screens/Login";
import AboutUs from "./screens/AboutUs";
import Admin from "./screens/Admin";
import "./index.css";
import GeneralAnalytics from "./screens/GeneralAnalytics";
import UsersTable from "./components/UsersTable";
import UsersScreen from "./components/UsersScreen";
import HomePage from "./screens/HomePage";
import Header from "./screens/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useState } from "react";

const queryClient = new QueryClient();
export const UserContext = createContext();

const Layout = ({ children }) => (
  <>
    <Header />
    <main style={{ marginTop: "60px" }}>{children}</main>
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: "/AboutUs",
    element: (
      <Layout>
        <AboutUs />
      </Layout>
    ),
  },
  {
    path: "/Login",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    element: <Admin />,
    children: [
      {
        path: "/Admin/statistics",
        element: <GeneralAnalytics />,
      },
      {
        path: "/Admin/users",
        element: <UsersScreen />,
      },
    ],
  },
]);

function App() {
  const [token, setToken] = useState("");
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={{ token, setToken }}>
          <RouterProvider router={router} />
        </UserContext.Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
