import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "@features/auth/authActions";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { setWindowClass } from "@app/utils/helpers";
import { PfButton } from "@profabric/react-components";
import * as Yup from "yup";
import { Form, InputGroup } from "react-bootstrap";
import useUser from "@app/hooks/useUser";

const Login = () => {
  // if page refresh
  useUser();

  const { loading, error, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      email: "",
      password: "",
      loginCode: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      loginCode: Yup.string().required("Required"),
      password: Yup.string()
        .min(5, "Must be 5 characters or more")
        .max(30, "Must be 30 characters or less")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      await dispatch(userLogin(values));
    },
  });

  useEffect(() => {
    if(error){
      toast.error(error);
    }
    if(!!message){
      toast.success(message);
    }
  }, [loading, error]);

  setWindowClass("hold-transition login-page");

  return (
    <div className="login-box">
      <div className="card card-outline card-primary">
        <div className="card-header text-center">
          <Link to="/" className="h1">
            <b>We</b>
            <span>Travel</span>
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
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="loginCode"
                  name="loginCode"
                  type="password"
                  placeholder="Proof Of Admin"
                  onChange={handleChange}
                  value={values.loginCode}
                  isValid={touched.loginCode && !errors.loginCode}
                  isInvalid={touched.loginCode && !!errors.loginCode}
                />
                {touched.loginCode && errors.loginCode ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.loginCode}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-key" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>

            <div className="row">
              <div className="col-12">
                <PfButton
                  block
                  type="submit"
                  loading={loading}
                  disabled={loading}
                >
                  Sign In
                </PfButton>
              </div>
            </div>
          </form>
          <p className="mb-0">
            <Link to="/register" className="text-center">
              Register a new membership
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
