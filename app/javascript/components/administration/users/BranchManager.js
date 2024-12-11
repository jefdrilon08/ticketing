import React, { useState, useEffect } from 'react';
import "react-toggle/style.css";
import { fetchUserBranches, toggleUserBranch } from '../../../services/UsersService';

import SkCubeLoading from '../../SkCubeLoading';
import ToggleSwitch from '../../utils/ToggleSwitch';

export default BranchManager = (props) => {
  const [userBranches, setUserBranches] = useState([]);
  const [isLoading, setIsLoading]       = useState(true);

  useEffect(() => {
    fetchUserBranches(props.id)
      .then((payload) => {
        setUserBranches(payload.data);
        setIsLoading(false);
      }).catch((payload) => {
        alert("Error in fetching user branches");
        setIsLoading(true);
      })
  }, [])

  return (
    <React.Fragment>
      <h4>
        Branch Manager
      </h4>
      {(() => {
        if (isLoading) {
          return (
            <SkCubeLoading/>
          )
        } else {
          return (
            <table className="table table-hover table-sm table-bordered">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>
                    <center>
                      Actions
                    </center>
                  </th>
                </tr>
              </thead>
              <tbody>
                {userBranches.map((userBranch) => {
                  return (
                    <tr key={"user-branch-" + userBranch.id}>
                      <td>
                        {userBranch.branch.name}
                      </td>
                      <td>
                        <center>
                          <ToggleSwitch
                            name={`branch-${userBranch.branch.name}`}
                            key={`user-branch-toggle-${userBranch.id}`}
                            checked={userBranch.active}
                            onChange={() => {
                              toggleUserBranch(userBranch.id)
                                .then((payload) => {
                                  setUserBranches(payload.data);
                                }).catch((payload) => {
                                  console.log(payload);
                                  alert("Error in toggling user branch");
                                  setIsLoading(true);
                                })
                            }}
                          />
                        </center>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        }
      })()}
    </React.Fragment>
  );
}
