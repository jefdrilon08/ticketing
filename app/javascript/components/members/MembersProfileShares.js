import React, { useState, useEffect } from "react";

export default function MembersProfileShares(props) {
  if(props.records.length >= 0) {
    return (
      <>
        <a
          href={`/members/${props.memberId}/member_shares/new`}
          className="btn btn-primary btn-sm"
        >
          New Certificate
        </a>
        <hr/>
        <table className="table table-bordered table-hover table-sm">
          <thead>
            <tr>
              <th>
                Certificate Number
              </th>
              <th>
                Date of Issue
              </th>
              <th className="text-center">
                Number of Shares
              </th>
              <th className="text-center">
                Shares For
              </th>
              <th className="text-center">
                Is Void
              </th>
              {(() => {
                if(props.roles.includes("BK") || props.roles.includes("SBK") || props.roles.includes("MIS")) {
                  return (
                    <th className="text-center">
                      Actions
                    </th>
                  )
                }
              })()}
            </tr>
          </thead>
          <tbody>
            {props.records.map((o) => {
              return (
                <tr key={`share-${o.id}`}>
                  <td>
                    <a href={`/members/${props.memberId}/member_shares/${o.id}`}>
                      <strong>
                        {o.certificate_number}
                      </strong>
                    </a>
                  </td>
                  <td>
                    {o.date_of_issue}
                  </td>
                  <td className="text-center">
                    {o.number_of_shares}
                  </td>
                  <td className="text-center">
                    {o.certificate_for}
                  </td>
                  <td>
                    {(() => {
                      if(o.is_void) {
                        return (
                          <div className="badge badge-danger">
                            <span className="bi bi-check"/>
                          </div>
                        )
                      }
                    })()}
                  </td>
                  {(() => {
                    if(props.roles.includes("BK") || props.roles.includes("SBK") || props.roles.includes("MIS")) {
                      return (
                        <td className="text-center">
                          <a 
                            data-confirm="Are you sure?"
                            className="btn btn-sm btn-danger"
                            data-method="delete"
                            href={`/members/${props.memberId}/member_shares/${o.id}`}
                          >
                            Void Share
                          </a>
                        </td>
                      )
                    }
                  })()}
                </tr>
              )
            })}
          </tbody>
        </table>
      </>
    )
  } else {
    return (
      <p>
        No shares found.
      </p>
    )
  }
}
