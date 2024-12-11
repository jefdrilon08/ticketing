import React, { useState, useEffect } from "react";

export default function MembersProfileSurveyAnswers(props) {
  if(props.records.length > 0) {
    return (
      <table className="table table-bordered table-hover table-sm">
        <thead>
          <tr>
            <th>
              Survey
            </th>
            <th className="text-center">
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {props.records.map((o) => {
            return (
              <tr key={`survey-answer-${o.id}`}>
                <td>
                  <a href={`/members/${props.memberId}/survey_answers/${o.id}`}>
                    {o.survey_name}
                  </a>
                </td>
                <td className="text-center">
                  {o.updated_at}
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
        No survey answers found.
      </p>
    )
  }
}
