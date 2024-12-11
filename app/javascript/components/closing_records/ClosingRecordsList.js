import React from "react";

export default function ClosingRecordsList(props) {
  const renderRecords = () => {
    if(props.closingRecords.length > 0) {
      return (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>
                Record Type
              </th>
              <th>
                Closing Date
              </th>
              <th>
                Status
	      </th>
	      <th>
		Action
	      </th>
            </tr>
          </thead>
          <tbody>
            {props.closingRecords.map((o, i) => {	    
	       return (
                <tr key={`cr-${i}`}>
                  <td>
                    <a href={o.path} target="_blank">
                      {o.type}
                    </a>
                  </td>
                  <td>
                    {o.closing_date}
                  </td>
		  <td>
                    {o.status == "done"
                      ? <span className="badge bg-success">Done</span>
                      : <span className="badge bg-secondary">Pending</span>
		     }
		  </td>
		  <td>
		    {o.status === "done" && (
                      <span
                        className="badge bg-danger"
                        onClick={() => props.handleRemoveRecord(o)}
                      >
                        Remove
	      	      </span>
		    )}
		    {o.branch_id}  
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
          No closing records found.
        </p>
      )
    }
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label>
              Branch
            </label>
            <select
              className="form-control"
              disabled={props.isLoading}
              onChange={(event) => { props.handleBranchChanged(event.target.value) }}
              value={props.branchId}
            >
              {props.branches.map((o) => {
                return (
                  <option
                    value={o.id}
                    key={"branch-selection-" + o.id}
                  >
                    {o.name + " (" + o.current_date + ")"}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>
              Closing Date
            </label>
            <input
              className="form-control"
              value={props.currentDate}
              onChange={(event) => { props.handleCurrentDateChanged(event.target.value) }}
              type="date"
              disabled={props.isLoading}
            />
          </div>
        </div>
      </div>
      <div className="mt-2"/>
      {renderRecords()}
    </>
  )
}
