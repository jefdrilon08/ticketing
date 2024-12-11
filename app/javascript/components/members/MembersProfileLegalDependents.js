import React, { useState, useEffect } from "react";

export default function MembersProfileLegalDependents(props) {
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
                    Gender
                  </th>
                  <th>
                    Relationship
                  </th>
                  <th>
                    Educational Attainment
                  </th>
                  <th>
                    Course
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.records.map((o) => {
                  return (
                    <tr key={"legal-dependent-" + o.id}>
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
                        {o.gender}
                      </td>
                      <td>
                        {o.relationship}
                      </td>
                      <td>
                        {o.educational_attainment}
                      </td>
                      <td>
                        {o.course}
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
