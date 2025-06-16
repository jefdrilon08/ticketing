import React, { useState, useEffect } from "react";
import { hasFormError } from "../../helpers/AppHelper";
import kmba_logo from '../../../assets/images/kmba_logo.png';
import logo from '../../../assets/images/logo.png';
import { createSession, login } from "../../services/AuthService";
import ModalForgotPassword from "./ModalForgotPassword";

export default Login = (props) => {
  const [username, setUsername]                                   = useState("");
  const [password, setPassword]                                   = useState("");
  const [isLoading, setIsLoading]                                 = useState(false);
  const [errors, setErrors]                                       = useState({});
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  useEffect(() => {
  }, []);

  const {
    is_microloans,
    is_microinsurance
  } = props;

  const handleLogin = () => {
    setIsLoading(true);
    setErrors({});

    login({ username, password })
      .then((payload) => {
        console.log(payload);

        let token = payload.data.token;
        let user = payload.data.user;

        createSession({ token, user });
        window.location.href = '/';
      }).catch((payload) => {
        console.log(payload.response.data);
        setIsLoading(false);
        setErrors(payload.response.data);
      })
  }

  return (
    <div className="d-flex align-items-center" style={{ height: "100vh" }}>
      <ModalForgotPassword
        isOpen={isForgotPasswordModalOpen}
        setIsOpen={setIsForgotPasswordModalOpen}
      />
      <div className="container">
        <div className="card">
          <div className="card-body">
            <center>
              {(() => {
                //if (is_microinsurance) {
                  //return (
                   // <img src={kmba_logo} width="220px"/>
                 // )
                //} else if (is_microloans) {
                 // return (
                //    <img src={logo} width="220px"/>
                //  )
                //}
              })()}
            </center>
            <hr/>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div className="row">
                <div className="col mb-4">
                  <label className="form-label">
                    Username
                  </label>
                  <input
                    value={username}
                    disabled={isLoading}
                    className={`form-control ${hasFormError(errors, 'username') ? 'is-invalid' : ''}`}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <div className="invalid-feedback">
                    {hasFormError(errors, 'username') ? errors.username.join(', ') : ''}
                  </div>
                  <label className="form-label mt-4">
                    Password
                  </label>
                  <input
                    value={password}
                    type="password"
                    disabled={isLoading}
                    className={`form-control ${hasFormError(errors, 'password') ? 'is-invalid' : ''}`}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <div className="invalid-feedback">
                    {hasFormError(errors, 'password') ? errors.password.join(', ') : ''}
                  </div>
                </div>
              </div>
              <hr/>
              <div className="row">
                <div className="col mb-4">
                  <center>
                    <button
                      className="btn btn-primary"
                      disabled={isLoading}
                      type="submit"
                    >
                      <span className="bi bi-shield-check me-2"/>
                      Login to System
                    </button>
                    <hr/>
                    <div
                      className="clickable"
                      onClick={() => {
                        setIsForgotPasswordModalOpen(true);
                      }}
                    >
                      Forgot Password
                    </div>
                  </center>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
