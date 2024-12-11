import React, { useState, useMemo } from "react";
import SkCubeLoading from "../SkCubeLoading";
import axios from 'axios';
import MonthlyPsrFinancialStatus from "./MonthlyPsrFinancialStatus";
import MonthlyPsrPortfolio from "./MonthlyPsrPortfolio";
import MonthlyPsrPrincipalPaid from "./MonthlyPsrPrincipalPaid";
import MonthlyPsrPastDue from "./MonthlyPsrPastDue";
import MonthlyPsrMemberCount from  "./MonthlyPsrMemberCount";

export default function MonthlyPsr(props) {
  const [data, setData]           = useState(null);
  const [branches]                = useState(props.branches);
  const [token]                   = useState(props.token);
  const [branchId, setBranchId]   = useState(props.branches[0].id);
  const [currentYear]             = useState(props.current_year);
  const [year, setYear]           = useState(props.current_year);
  const [isLoading, setIsLoading] = useState(false);

  const years = [];

  for(var y = currentYear; y >= currentYear - 3; y--) {
    years.push(y);
  }

  const fetchData = () => {
    setIsLoading(true);

    const payload = {
      branch_id:  branchId,
      year:       year
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': token
    }

    const options = {
      headers: headers
    }

    axios.post( 
      '/api/branch_psr_records/fetch',
      payload,
      options
    ).then((res) => {
      console.log(res.data.records);
      setData(res.data.records);
      setIsLoading(false);
    }).catch((error) => {
      setData(null); 
      setIsLoading(false);
    })
  }

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8 col-xs-12">
              <div className="form-group">
                <label>
                  Branch
                </label>
                <select
                  className="form-control"
                  value={branchId}
                  disabled={isLoading}
                  onChange={(event) => {
                    setBranchId(event.target.value); 
                  }}
                >
                  {branches.map((o) => {
                    return (
                      <option key={`branch-select-${o.id}`} value={o.id}>
                        {o.name}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
            <div className="col-md-2 col-xs-12">
              <div className="form-group">
                <label>
                  Year
                </label>
                <select
                  value={year}
                  className="form-control"
                  disabled={isLoading}
                  onChange={(event) => {
                    setYear(event.target.value);
                  }}
                >
                  {years.map((o) => {
                    return (
                      <option key={`year-${o}`} value={o}>
                        {o}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
            <div className="col-md-2 col-xs-12">
              <div className="form-group">
                <label>
                  Actions
                </label>
                <br/>
                <button 
                  className="btn btn-primary"
                  disabled={isLoading}
                  onClick={() => {
                    fetchData();
                  }}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
          <hr/>
          <div className="row">
            <div className="col">
              {(() => {
                if(isLoading) {
                  return (
                    <SkCubeLoading/>
                  )
                } else if(data) {
                  return (
                    <>
                      <MonthlyPsrFinancialStatus
                        data={data}
                      />
                      <hr/>
                      <MonthlyPsrPortfolio
                        data={data}
                      />
                      <MonthlyPsrPrincipalPaid
                        data={data}
                      />
                      <MonthlyPsrPastDue
                        data={data}
                      />
                      <MonthlyPsrMemberCount
                        data={data}
                      />
                    </>
                  )
                } else {
                  return (
                    <p>
                      Data not set
                    </p>
                  )
                }
              })()} 
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
