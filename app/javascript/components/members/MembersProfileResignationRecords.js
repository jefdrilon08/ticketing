import React, { useState, useEffect } from "react";

export default function MembersProfileResignationRecords(props) {
  return (
    <>
      {(() => {
        if(props.records && props.records.length > 0) {
          return (
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>
                    Date Resigned
                  </th>
                  <th>
                    Type
                  </th>
                  <th>  
                    Reason
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
                {props.records.map((o, i) => {
                  return (
                    <tr key={"resignation-record-" + i}>
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
