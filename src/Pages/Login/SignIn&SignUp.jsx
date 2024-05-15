import React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./signIn&signup.scss";

export default function LoginSignUp() {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const loginValidationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is Required"),
    password: Yup.string().required("Password is Required"),
  });

  const signupValidationSchema = Yup.object({
    username: Yup.string()
      .trim() // Trim leading and trailing whitespace
      .required("User name is Required")
      .test(
        "no-spaces",
        "User name cannot consist only of spaces",
        (value) => !/^\s+$/.test(value) // Check if the value doesn't consist only of spaces
      ),
    mobile: Yup.number()
      .typeError("That doesn't look like a phone number")
      .positive("A phone number can't start with a minus")
      .integer("A phone number can't include a decimal point")
      .min(1000000000, "A phone number should be at least 10 digits")
      .required("A phone number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is Required"),
    password: Yup.string().required("Password is Required"),
  });

  const formikLogin = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      console.log("Login Form Values:", values);
    },
  });

  const formikSignup = useFormik({
    initialValues: {
      username: "",
      mobile: "",
      email: "",
      password: "",
    },
    validationSchema: signupValidationSchema,
    onSubmit: (values) => {
      console.log("Signup Form Values:", values);
    },
  });

  return (
    <div className="container-fluid p-5 bg-white">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-white">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "login" && "active"}`}
                    onClick={() => handleTabChange("login")}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "signup" && "active"}`}
                    onClick={() => handleTabChange("signup")}
                  >
                    Sign Up
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === "login" ? (
                <form onSubmit={formikLogin.handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="loginEmail" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="loginEmail"
                      placeholder="Enter email"
                      name="email"
                      onBlur={formikLogin.handleBlur}
                      value={formikLogin.values.email}
                      onChange={formikLogin.handleChange}
                    />
                    {formikLogin.touched.email && formikLogin.errors.email ? (
                      <p style={{ color: "red" }}>{formikLogin.errors.email}</p>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="loginPassword" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="loginPassword"
                      placeholder="Password"
                      name="password"
                      onBlur={formikLogin.handleBlur}
                      value={formikLogin.values.password}
                      onChange={formikLogin.handleChange}
                    />
                    {formikLogin.touched.password &&
                    formikLogin.errors.password ? (
                      <p style={{ color: "red" }}>
                        {formikLogin.errors.password}
                      </p>
                    ) : null}
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Login
                  </button>
                </form>
              ) : (
                <form onSubmit={formikSignup.handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="signupName" className="form-label">
                      User Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="signupName"
                      placeholder="Enter your name"
                      name="username"
                      onBlur={formikSignup.handleBlur}
                      value={formikSignup.values.username}
                      onChange={formikSignup.handleChange}
                    />
                    {formikSignup.touched.username &&
                    formikSignup.errors.username ? (
                      <p style={{ color: "red" }}>
                        {formikSignup.errors.username}
                      </p>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="signupName" className="form-label">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="signupName"
                      placeholder="Enter your mobile number"
                      name="mobile"
                      onBlur={formikSignup.handleBlur}
                      value={formikSignup.values.mobile}
                      onChange={formikSignup.handleChange}
                    />
                    {formikSignup.touched.mobile &&
                    formikSignup.errors.mobile ? (
                      <p style={{ color: "red" }}>
                        {formikSignup.errors.mobile}
                      </p>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="signupEmail" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="signupEmail"
                      placeholder="Enter email"
                      name="email"
                      onBlur={formikSignup.handleBlur}
                      value={formikSignup.values.email}
                      onChange={formikSignup.handleChange}
                    />
                    {formikSignup.touched.email && formikSignup.errors.email ? (
                      <p style={{ color: "red" }}>
                        {formikSignup.errors.email}
                      </p>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="signupPassword" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="signupPassword"
                      placeholder="Password"
                      name="password"
                      onBlur={formikSignup.handleBlur}
                      value={formikSignup.values.password}
                      onChange={formikSignup.handleChange}
                    />
                    {formikSignup.touched.password &&
                    formikSignup.errors.password ? (
                      <p style={{ color: "red" }}>
                        {formikSignup.errors.password}
                      </p>
                    ) : null}
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign Up
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
