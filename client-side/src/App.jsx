import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Main from "@modules/main/Main";
import Login from "@modules/login/Login";
import { useWindowSize } from "@app/hooks/useWindowSize.js";
import { calculateWindowSize } from "@app/utils/helpers";
import { setWindowSize } from "@app/store/reducers/ui";
import PublicRoute from "@app/routes/PublicRoute";
import PrivateRoute from "@app/routes/PrivateRoute";
import { setAuthentication } from "@app/store/reducers/auth";
import { getAuthStatus } from "@app/utils/oidc-providers";
import Dashboard from "@pages/Dashboard";
import BlogsList from "@pages/blogs/BlogsList";
import CreateBlog from "@pages/blogs/CreateBlog";
import ReviewsList from "@pages/reviews/ReviewsList";
import CreateReview from "@pages/reviews/CreateReview";

const App = () => {
  const windowSize = useWindowSize();
  const screenSize = useSelector((state) => state.ui.screenSize);
  const dispatch = useDispatch();
  const [isAppLoading, setIsAppLoading] = useState(true);

  const checkSession = async () => {
    try {
      let responses = await Promise.all([getAuthStatus()]);
      responses = responses.filter((r) => Boolean(r));
      if (responses && responses.length > 0) {
        dispatch(setAuthentication(responses[0]));
      }
    } catch (error) {
      console.error("error", error);
    }
    setIsAppLoading(false);
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    const size = calculateWindowSize(windowSize.width);
    if (screenSize !== size) {
      dispatch(setWindowSize(size));
    }
  }, [windowSize]);

  if (isAppLoading) {
    return <p>Loading</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Main />}>
            {/* Blog Routes */}
            <Route path="/blogs" element={<BlogsList />} />
            <Route path="/create-blog" element={<CreateBlog />} />
            {/* Review Routes */}
            <Route path="/reviews" element={<ReviewsList />} />
            <Route path="/create-review" element={<CreateReview />} />
            {/* Dashboard Route */}
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Route>
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
    </BrowserRouter>
  );
};

export default App;
