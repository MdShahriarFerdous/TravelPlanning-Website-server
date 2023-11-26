import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./modules/auth/Login";
import Register from "./modules/auth/Register";
import UserActivate from "./modules/auth/UserActivate";
import Main from "./modules/main/Main";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./routes/PrivateRoute";
import { useEffect } from "react";
import { setCredentials } from "@app/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useGetUserInfoQuery } from "@services/auth/authService";
const App = () => {
  // automatically authenticate user if token is found
  const dispatch = useDispatch();
  const { data } = useGetUserInfoQuery("userInfo", {
    pollingInterval: 900000, // 15mins
  });
  useEffect(() => {
    if (data) dispatch(setCredentials(data.user));
  }, [data, dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/activate/:token" element={<UserActivate />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Main />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        autoClose={3000}
        draggable={false}
        position="top-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
      />
    </Router>
  );
};

export default App;
