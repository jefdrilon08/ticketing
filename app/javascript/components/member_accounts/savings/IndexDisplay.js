import React from 'react';
import $ from 'jquery';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import SkCubeLoading from '../../SkCubeLoading';

import {numberWithCommas} from '../../utils/helpers';

export default class IndexDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      data: false
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {
    var context = this;

    $.ajax({
      url: "/api/v1/savings_accounts",
      method: "GET",
      data: {
      },
      dataType: 'json',
      success: function(response) {
        var savings_accounts  = response.savings_accounts;
        console.log(response);

        context.setState({
          isLoading: false,
          data: savings_accounts
        });
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching savings data");

        context.setState({
          isLoading: true,
          data: false
        });
      }
    });
  }

  renderTable() {
    var context = this;
    var state   = context.state;

    if(!state.isLoading && state.data != false) {
      return  (
        <ReactTable
          columns={[
            {
              Header: "Member Name",
              accessor: "member_full_name",
              Cell: row => (
                <strong>
                  <a href={"/members/" + row.original.member_id} target={"_blank"}>
                    {row.original.member_full_name}
                    <br/>
                    <small className="text-muted">
                      {row.original.member_identification_number}
                    </small>
                  </a>
                </strong>
              )
            },
            {
              Header: "Account Type",
              accessor: "subtype",
              Cell: row => (
                <center>
                  {row.original.subtype}
                </center>
              )
            },
            {
              Header: "Balance",
              accessor: "balance",
              Cell: row => (
                <strong>
                  <div className="text-end">
                    {numberWithCommas(row.original.balance)}
                    <br/>
                    <small className="text-muted">
                      Maintaining Balance: {numberWithCommas(row.original.maintaining_balance)}
                    </small>
                  </div>
                </strong>
              )
            }
          ]}
          data={state.data}
        />
      );
    }
  }

  render() {
    var context = this;
    var state   = context.state;

    if(state.isLoading) {
      return  (
        <SkCubeLoading/>
      );
    } else if(state.data != false) {
      return (
        <div>
          {context.renderTable()}
        </div>
      );
    } else {
      <div>
        No data
      </div>
    }
  }
}
