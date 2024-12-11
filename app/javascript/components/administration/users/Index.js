import React, { useState, useEffect } from "react";
import { fetchUsers } from "../../../services/UsersService";
import Pagination from "../../commons/Pagination";
import { initPages } from "../../../helpers/AppHelper";
import { Breadcrumb } from "react-bootstrap";

export default Index = (props) => {
  const [numPages, setNumPages]   = useState(0);
  const [count, setCount]         = useState(0);
  const [page, setPage]           = useState(1);
  const [users, setUsers]         = useState([]);
  const [pages, setPages]         = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset]                  = useState(5);

  const [filter, setFilter] = useState({
    q: ""
  });

  const getUsers = () => {
    fetchUsers({ page, q: filter.q })
      .then((payload) => {
        setUsers(payload.data.users);
        setNumPages(payload.data.num_pages);
        setCount(payload.data.count);
        setPages(initPages(page, offset, numPages));
      }).catch((payload) => {
        console.log(payload);
        console.log(payload.response);
      })
  }

  useEffect(() => {
    getUsers();
  }, [page, numPages]);

  return (
    <div className="container-fluid">
      <Breadcrumb>
        <Breadcrumb.Item active>
          Administration
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          Users
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-9 col-xs-12">
              <div className="form-group">
                <label className="form-label">
                  Search
                </label>
                <input
                  className="form-control"
                  value={filter.q}
                  onChange={(event) => {
                    let _filter = {...filter};
                    _filter.q = event.target.value;

                    setFilter(_filter);
                  }}
                />
              </div>
            </div>
            <div className="col-md-3 col-xs-12">
              <div className="form-group">
                <label className="form-label">
                  Actions
                </label>
                <button
                  className="btn btn-info w-100"
                  onClick={() => {
                    getUsers();
                  }}
                >
                  <span className="bi bi-search"/>
                </button>
              </div>
            </div>
          </div>
          <table className="table table-sm table-bordered">
            <thead>
              <tr>
                <th/>
                <th>
                  Name
                </th>
                <th>
                  Username
                </th>
                <th>
                  Email
                </th>
                <th>
                  Identification Number
                </th>
                <th>
                  Roles
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={`user-${user.id}`}>
                    <td className="text-center">
                      <a
                        href={`/administration/users/${user.id}`}
                      >
                        <span className="bi bi-search"/>
                      </a>
                    </td>
                    <td>
                      {user.full_name}
                    </td>
                    <td>
                      {user.username}
                    </td>
                    <td>
                      {user.email}
                    </td>
                    <td>
                      {user.identification_number}
                    </td>
                    <td>
                      <ul>
                        {user.roles.filter((role) => { return role != "" }).map((role) => {
                          return (
                            <li key={`user-${user.id}-role-${role}`}>
                              {role}
                            </li>
                          )
                        })}
                      </ul>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <Pagination
            numPages={numPages}
            setNumPages={setNumPages}
            pages={pages}
            setPages={setPages}
            setPage={setPage}
            page={page}
            offset={offset}
          />
        </div>
      </div>
    </div>
  )
}
