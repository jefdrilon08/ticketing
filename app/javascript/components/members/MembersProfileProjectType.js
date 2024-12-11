import React, { useState, useEffect } from "react";

export default function MembersProfileProjectType(props) {
  return (
    <>
      {(() => {
        if(props.records && props.records.length > 0) {
          return (
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>
                    Project Category
                  </th>
                  <th>
                    Project Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.records.map((o) => {
                  return (
                    <tr key={"project-type-" + o.id}>
                      <td>
                        {o.project_type_category}
                      </td>
                      <td>
                        {o. project_type}
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
