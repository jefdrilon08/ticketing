import React, { useState, useEffect } from "react";
import ErrorList from '../ErrorList';
import axios from 'axios';

export default function MembersProfileMyKoins(props) {
  const [password, setPassword]               = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading]             = useState(false);
  const [errors, setErrors]                   = useState([]);

  const handleSavePassword = () => {
    setIsLoading(true);
    setErrors([]);

    const payload = {
      id:                     props.memberId,
      password:               password,
      password_confirmation:  passwordConfirm
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': props.token
    }

    const options = {
      headers: headers
    }

    axios.post(
      '/api/members/update_password',
      payload,
      options
    ).then((res) => {
      alert("Successfully updated password!");
      setIsLoading(false);
      setPassword("");
      setPasswordConfirm("");
    }).catch((error) => {
      console.log(error.response.data);
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }

  return (
    <>
      <h3>
        Change Password
      </h3>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label>
              Password
            </label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(event) => { setPassword(event.target.value) }}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label>
              Password Confirmation
            </label>
            <input
              className="form-control"
              type="password"
              value={passwordConfirm}
              onChange={(event) => { setPasswordConfirm(event.target.value) }}
              disabled={isLoading}
            />
          </div>
          <hr/>
          {(() => {
            if(errors.length > 0) {
              return (
                <div className="">
                  <h5>
                    Errors
                  </h5>
                  <ul>
                    {errors.map((o, i) => {
                      return (
                        <li key={`err-${i}`}>
                          {o}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            } else {
              return (
                <></>
              )
            }
          })()}
          <button 
            className="btn btn-success btn-block"
            onClick={handleSavePassword}
          >
            Save Password
          </button>
        </div>
      </div>
    </>
  )
}
