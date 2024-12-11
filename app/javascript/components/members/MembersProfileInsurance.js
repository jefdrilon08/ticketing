import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function MembersProfileInsurance(props) {
  const [configData, setConfigData] = useState();

  useEffect(() => {
    axios.get('/api/yml_values/production_values')
      .then(response => {
        setConfigData(response.data);
        setCustomVariable(response.data); // Assign response.data to your custom variable
        console.log(response.data); // Log the value to the console
      })
      .catch(error => console.error(error));
  }, []);


  return (
    <table className="table table-bordered table-hover table-sm">
      <thead>
        <tr>
          <th>
            Type
          </th>
          {(() => {
              if(JSON.stringify(configData, null, 2) == 'true') {
                return (
                  <th className="text-end">
                    Total Payment
                  </th>
                )
              }
              else {
                <th className="text-end">
                  Balance
                </th>
              }   
          })()}
        </tr>
      </thead>
      <tbody>
        {props.records.map((o) => {
          return (
            <tr key={`insurance-${o.id}`}>
              <td>
                <a href={`/insurance_accounts/${o.id}`}>
                  <strong>
                    {o.type}
                  </strong>
                </a>
              </td>
              <td className="text-end">
                {o.balance}
              </td>
            </tr>
          )
        })}
        <tr>
          <td>
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
