import React, { useState, useEffect } from "react";

export default function MembersProfileSavings(props) {
  return (
    <table className="table table-bordered table-hover table-sm">
      <thead>
        <tr>
          <th>
            Type
          </th>
          <th className="text-end">
            Maintaining Balance 
          </th>
          <th className="text-end">
            Current Balance
          </th>
        </tr>
      </thead>
      <tbody>
        {props.records.map((o) => {
          return (
            <tr key={`savings-${o.id}`}>
              <td>
                <a href={`/savings_accounts/${o.id}`}>
                  <strong>
                    {o.type}
                  </strong>
                </a>
              </td>
              <td className="text-end">
                {o.maintaining_balance}
              </td>
              <td className="text-end">
                {o.current_balance}
              </td>
            </tr>
          )
        })}
        <tr>
          <td colSpan="2">
            <strong>
              Total
            </strong>
          </td>
          <td className="text-end">
            <strong>
              {props.total}
            </strong>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
