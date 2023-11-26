import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@components/Spinner";
import { registerUser } from "@features/auth/authActions";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setWindowClass } from "@app/utils/helpers";
import { Form, InputGroup } from "react-bootstrap";
import { PfButton, PfCheckbox } from "@profabric/react-components";
import useUser from "@app/hooks/useUser";

const Register = () => {
  // if page refresh
  useUser();

  const [customRetypeError, setCustomRetypeError] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const dispatch = useDispatch();
  

  const register = (data) => {
    if (data.password !== data.passwordRetype) {
      setCustomRetypeError("Password mismatch");
      toast.error("Password mismatch");
      return;
    }
    data.email = data.email.toLowerCase();
    dispatch(registerUser(data));
  };
  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      passwordRetype: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(5, "Must be 5 characters or more")
        .max(30, "Must be 30 characters or less")
        .required("Required"),
      passwordRetype: Yup.string()
        .min(5, "Must be 5 characters or more")
        .max(30, "Must be 30 characters or less")
        .required("Required"),
    }),
    onSubmit: (values) => {
      register(values);
      setIsAuthLoading(true);
    },
  });

  setWindowClass("hold-transition register-page");

  return (
    <>
      <div className="register-box">
        <div className="card card-outline card-primary">
          <div className="card-header text-center">
            <Link to="/" className="h1">
              <b>We</b>
              <span>Travel</span>
            </Link>
          </div>
          <div className="card-body">
            <p className="login-box-msg">Register a new membership</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <InputGroup className="mb-3">
                  <Form.Control
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    onChange={handleChange}
                    value={values.username}
                    isValid={touched.username && !errors.username}
                    isInvalid={touched.username && !!errors.username}
                  />
                  {touched.username && errors.username ? (
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  ) : (
                    <InputGroup.Append>
                      <InputGroup.Text>
                        <i className="fas fa-solid fa-user"></i>
                      </InputGroup.Text>
                    </InputGroup.Append>
                  )}
                </InputGroup>
              </div>
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

              <div className="mb-3">
                <InputGroup className="mb-3">
                  <Form.Control
                    id="passwordRetype"
                    name="passwordRetype"
                    type="password"
                    placeholder="Retype password"
                    onChange={handleChange}
                    value={values.passwordRetype}
                    isValid={touched.passwordRetype && !errors.passwordRetype}
                    isInvalid={customRetypeError}
                  />

                  {touched.passwordRetype && errors.passwordRetype ? (
                    <Form.Control.Feedback type="invalid">
                      {errors.passwordRetype}
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
                <div className="col-12 m-auto">
                  <PfButton type="submit" block disabled={isAuthLoading}>
                    Register
                  </PfButton>
                </div>
              </div>
            </form>

            <p className="mt-1 text-center">
              <Link to="/login" className="text-center">
                I already have a membership
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
