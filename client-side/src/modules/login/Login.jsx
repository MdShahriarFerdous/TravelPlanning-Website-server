import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { setAuthentication } from "@store/reducers/auth";
import { setWindowClass } from "@app/utils/helpers";
import { PfCheckbox, PfButton } from "@profabric/react-components";
import * as Yup from "yup";

import { authLogin } from "@app/utils/oidc-providers";
import { Form, InputGroup } from "react-bootstrap";

const Login = () => {
  const [isAuthLoading, setAuthLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      setAuthLoading(true);
      const response = await authLogin(email, password);
      dispatch(setAuthentication(response));
      toast.success("Login is succeed!");
      setAuthLoading(false);
      navigate("/");
    } catch (error) {
      setAuthLoading(false);
      toast.error(error.message || "Failed");
    }
  };

  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      email: "admin@example.com",
      password: "admin",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(5, "Must be 5 characters or more")
        .max(30, "Must be 30 characters or less")
        .required("Required"),
    }),
    onSubmit: (values) => {
      login(values.email, values.password);
    },
  });

  setWindowClass("hold-transition login-page");

  return (
    <div className="login-box">
      <div className="card card-outline card-primary">
        <div className="card-header text-center">
          <Link to="/" className="h1">
            <b>Travello</b>
            <span>Admin</span>
          </Link>
        </div>
        <div className="card-body">
          <p className="login-box-msg">Sign in to start your session</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  value={values.email}
                  isValid={touched.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                />
                {touched.email && errors.email ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-envelope" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                  isValid={touched.password && !errors.password}
                  isInvalid={touched.password && !!errors.password}
                />
                {touched.password && errors.password ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-lock" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>

            <div className="row">
              <div className="col-8">
                <PfCheckbox checked={false}>
                  Sign in to start your session
                </PfCheckbox>
              </div>
              <div className="col-4">
                <PfButton
                  block
                  type="submit"
                  loading={isAuthLoading}
                >
                  Sign In
                </PfButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
