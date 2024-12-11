import React, { useEffect, useState } from "react";
import { hasFormError } from "../../../helpers/AppHelper";
import { fetchUser, saveUser } from "../../../services/UsersService";
import { Breadcrumb } from "react-bootstrap";

export default Form = (props) => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    identification_number: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirmation: "",
    incentivized_date: "",
    profile_picture: "",
    roles: []
  })

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors]       = useState({});

  useEffect(() => {
    if (props.id) {
      fetchUser(props.id)
        .then((payload) => {
          setUser(payload.data);
        }).catch((payload) => {
          console.log("Error");
          console.log(payload);
        })
    }
  }, []);

  return (
    <React.Fragment>
      <div className="container-fluid">
        <Breadcrumb>
          <Breadcrumb.Item active>
            Administration
          </Breadcrumb.Item>
          <Breadcrumb.Item href={`/administration/users`}>
            Users
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            {props.id ? 'Edit User' : 'New User'}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 col-xs-12">
                <div className="form-group">
                  <label className="form-label">
                    First Name
                  </label>
                  <input
                    value={user.first_name}
                    className={`form-control ${hasFormError(errors, 'first_name') ? 'is-invalid' : ''}`}
                    disabled={isLoading}
                    onChange={(event) => {
                      let _user = {...user}
                      _user.first_name = event.target.value;
                      setUser(_user);
                    }}
                  />
                  <div className="invalid-feedback">
                    {hasFormError(errors, 'first_name') ? errors.first_name.join(', ') : ''}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xs-12">
                <div className="form-group">
                  <label className="form-label">
                    Last Name
                  </label>
                  <input
                    value={user.last_name}
                    className={`form-control ${hasFormError(errors, 'last_name') ? 'is-invalid' : ''}`}
                    disabled={isLoading}
                    onChange={(event) => {
                      let _user = {...user}
                      _user.last_name = event.target.value;
                      setUser(_user);
                    }}
                  />
                  <div className="invalid-feedback">
                    {hasFormError(errors, 'last_name') ? errors.last_name.join(', ') : ''}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 col-xs-12">
                <div className="form-group">
                  <label className="form-label">
                    Email
                  </label>
                  <input
                    value={user.email}
                    className={`form-control ${hasFormError(errors, 'email') ? 'is-invalid' : ''}`}
                    disabled={isLoading}
                    onChange={(event) => {
                      let _user = {...user}
                      _user.email = event.target.value;
                      setUser(_user);
                    }}
                  />
                  <div className="invalid-feedback">
                    {hasFormError(errors, 'email') ? errors.email.join(', ') : ''}
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-xs-12">
                <div className="form-group">
                  <label className="form-label">
                    Username
                  </label>
                  <input
                    value={user.username}
                    className={`form-control ${hasFormError(errors, 'username') ? 'is-invalid' : ''}`}
                    disabled={isLoading}
                    onChange={(event) => {
                      let _user = {...user}
                      _user.username = event.target.value;
                      setUser(_user);
                    }}
                  />
                  <div className="invalid-feedback">
                    {hasFormError(errors, 'username') ? errors.username.join(', ') : ''}
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-xs-12">
                <div className="form-group">
                  <label className="form-label">
                    Identification Number
                  </label>
                  <input
                    value={user.identification_number}
                    className={`form-control ${hasFormError(errors, 'identification_number') ? 'is-invalid' : ''}`}
                    disabled={isLoading}
                    onChange={(event) => {
                      let _user = {...user}
                      _user.identification_number = event.target.value;
                      setUser(_user);
                    }}
                  />
                  <div className="invalid-feedback">
                    {hasFormError(errors, 'identification_number') ? errors.identification_number.join(', ') : ''}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 col-xs-12">
                <div className="form-group">
                  <label className="form-label">
                    Roles
                  </label>
                  {props.roles.map((role) => {
                    return (
                      <React.Fragment key={`role-${role}`}>
                        <div>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={user.roles.includes(role)}
                            disabled={isLoading}
                            onChange={(e) => {
                              let roles = [...user.roles];

                              if (roles.includes(role)) {
                                const roleIndex = roles.indexOf(role);
                                roles.splice(roleIndex, 1);
                              } else {
                                roles.push(role);
                              }

                              let _user = {...user};
                              _user.roles = roles;
                              setUser(_user);
                            }}
                          />
                          <label className="form-label ms-2">
                            {role}
                          </label>
                        </div>
                      </React.Fragment>
                    )
                  })}
                  <input type="hidden" className="form-control" />
                  <div className="invalid-feedback">
                    {hasFormError(errors, 'roles') ? errors.roles.join(', ') : ''}
                  </div>
                </div>
              </div>
              <div className="col-md-8 col-xs-12">
                <div className="form-group">
                  <label className="form-label">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    className={`form-control ${hasFormError(errors, 'profile_picture') ? 'is-invalid' : ''}`}
                    disabled={isLoading}
                    onChange={(event) => {
                      let _user = {...user}

                      if (event.target.files.length > 0) {
                        _user.profile_picture = event.target.files[0];
                        setUser(_user);
                      }
                    }}
                  />
                  <div className="invalid-feedback">
                    {hasFormError(errors, 'profile_picture') ? errors.profile_picture.join(', ') : ''}
                  </div>
                  <label className="form-label mt-2">
                    Incentivized Date
                  </label>
                  <input
                    value={user.incentivized_date}
                    className={`form-control ${hasFormError(errors, 'incentivized_date') ? 'is-invalid' : ''}`}
                    disabled={isLoading}
                    type="date"
                    onChange={(event) => {
                      let _user = {...user}
                      _user.incentivized_date = event.target.value;
                      setUser(_user);
                    }}
                  />
                  <div className="invalid-feedback">
                    {hasFormError(errors, 'incentivized_date') ? errors.incentivized_date.join(', ') : ''}
                  </div>
                  <div className="mt-2"/>
                  <input
                    checked={user.is_regular ? true : false}
                    type="checkbox"
                    className={`form-check-input ${hasFormError(errors, 'is_regular') ? 'is-invalid' : ''}`}
                    disabled={isLoading}
                    onChange={(event) => {
                      let _user = {...user}

                      _user.is_regular = !user.is_regular;
                      setUser(_user);
                    }}
                  />
                  <label className="form-label ms-2">
                    Is Regular
                  </label>
                  <div className="invalid-feedback">
                    {hasFormError(errors, 'is_regular') ? errors.is_regular.join(', ') : ''}
                  </div>
                  {(() => {
                    if (!user.id) {
                      return (
                        <div className="card mt-2">
                          <div className="card-header">
                            Setup Password
                          </div>
                          <div className="card-body">
                            <div className="form-group">
                              <label className="form-label">
                                Password
                              </label>
                              <input
                                value={user.password}
                                className={`form-control ${hasFormError(errors, 'password') ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                                type="password"
                                onChange={(event) => {
                                  let _user = {...user}
                                  _user.password = event.target.value;
                                  setUser(_user);
                                }}
                              />
                              <div className="invalid-feedback">
                                {hasFormError(errors, 'password') ? errors.password.join(', ') : ''}
                              </div>
                            </div>
                            <div className="form-group mt-2">
                              <label className="form-label">
                                Password Confirmation
                              </label>
                              <input
                                value={user.password_confirmation}
                                className={`form-control ${hasFormError(errors, 'password_confirmation') ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                                type="password"
                                onChange={(event) => {
                                  let _user = {...user}
                                  _user.password_confirmation = event.target.value;
                                  setUser(_user);
                                }}
                              />
                              <div className="invalid-feedback">
                                {hasFormError(errors, 'password_confirmation') ? errors.password_confirmation.join(', ') : ''}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  })()}
                </div>
              </div>
            </div>
            <hr/>
            <button
              className="btn btn-primary"
              disabled={isLoading}
              onClick={() => {
                setIsLoading(true);
                setErrors({});

                saveUser({...user})
                  .then((payload) => {
                    window.location.href=`/administration/users/${payload.data.id}`;
                  }).catch((payload) => {
                    console.log(payload);
                    setErrors(payload.response.data);
                    setIsLoading(false);
                  })
              }}
            >
              Save
            </button>
            <button
              className="btn btn-secondary ms-2"
              disabled={isLoading}
              onClick={() => {
                if (user.id) {
                  window.location.href = `/administration/users/${user.id}`;
                } else {
                  window.location.href = '/administration/users';
                }
              }}
            >
              Cancel
            </button>
            <hr/>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
