import React, { useState, useEffect } from "react";

export default function MembersProfileBeneficiaries(props) {
  return (
    <>
      {(() => {
        if(props.records && props.records.length > 0) {
          return (
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>
                    Name
                  </th>
                  <th>
                    Date of Birth
                  </th>
                  <th>
                    Age
                  </th>
                  <th>
                    Relationship
                  </th>
                  <th>
                    Primary
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.records.map((o) => {
                  return (
                    <tr key={"beneficiary-" + o.id}>
                      <td>
                        {o.full_name}
                      </td>
                      <td>
                        {o.date_of_birth}
                      </td>
                      <td>
                        {o.age}
                      </td>
                      <td>
                        {o.relationship}
                      </td>
                      <td>
                        {(() => {
                          if(o.is_primary) {
                            return (
                              <span className="badge badge-primary">
                                Yes
                              </span>
                            )
                          }
                        })()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        } else {
          return (
            <p>
              No records found.  
            </p>
          )
        }
      })()}
    </>
  )
}
