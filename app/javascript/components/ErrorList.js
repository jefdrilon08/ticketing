import React from "react";

export default function ErrorList(props) {
  if(props.errors && props.errors.length > 0) {
    return (
      <div className="alert alert-danger">
        <div className="row">
          <div className="col">
            <br/>
            <p>
              <strong>
                The following errors occurred:
              </strong>
            </p>
            <ul>
              {props.errors.map((e, i) => {
                return (
                  <li key={`error-${i}`}>
                    {e}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <></>
    )
  }
}
