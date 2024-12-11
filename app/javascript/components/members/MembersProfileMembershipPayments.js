import React, { useState, useEffect } from "react";

export default function MembersProfileMembershipPayments(props) {
  if(props.records.length > 0) {
    return (
      <table className="table table-bordered table-sm table-hober">
        <thead>
          <tr>
            {(() => {
              if(props.roles.includes("MIS")) {
                return (
                  <th>
                    ID
                  </th>
                )
              }
            })()}
            <th>
              Date Approved
            </th>
            <th>
              Name
            </th>
            <th>
              Type
            </th>
            <th className="text-end">
              Amount
            </th>
            <th className="text-center">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {props.records.map((o) => {
            return (
              <tr key={`membership-payment-${o.id}`}>
                {(() => {
                  if(props.roles.includes("MIS")) {
                    return (
                      <td>
                        {o.id}
                      </td>
                    )
                  }
                })()}
                <td>
                  {o.date_paid}
                </td>
                <td>
                  {o.membership_name}
                </td>
                <td>
                  {o.membership_type}
                </td>
                <td className="text-end">
                  {o.amount}
                </td>
                <td className="text-center">
                  {o.status}
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
}
