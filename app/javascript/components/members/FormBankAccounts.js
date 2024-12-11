import React from "react";

export default class FormBankAccounts extends React.Component {
  constructor(props) {
    super(props);
    
    this.state  = {
      currentBank: {
        bank: "",
        type: "SAVINGS"
      }
    }
  }

  renderBanks() {
    var banks = this.props.data.data.banks;

    if(banks.length > 0) {
      var banksDisplay  = [];

      for(var i = 0; i < banks.length; i++) {
        banksDisplay.push(
          <tr key={"bank-" + i}>
            <td>
              {banks[i].bank}
            </td>
            <td>
              {banks[i].type}
            </td>
            <td>
              <button 
                className="btn btn-danger btn-sm"
                onClick={this.handleDeleteClicked.bind(this, i)}
              >
                <span className="bi bi-x"/>
                Del
              </button>
            </td>
          </tr>
        );
      }

      return (
        <table className="table table-hover table-sm">
          <thead>
            <tr>
              <th>
                Bank
              </th>
              <th>
                Type
              </th>
              <th width={"10%"}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {banksDisplay}
          </tbody>
        </table>
      );
    } else {
      return  (
        <p>
          No banks found.
        </p>
      );
    }
  }

  handleDeleteClicked(index) {
    var data  = this.props.data;

    data.data.banks.splice(index);

    this.props.updateData(data);
  };

  handleAddClicked() {
    var data  = this.props.data;

    data.data.banks.push(this.state.currentBank);

    this.props.updateData(data);

    this.setState({
      currentBank: {
        bank: "",
        type: "SAVINGS"
      }
    });
  };

  handleBankChanged(event) {
    var currentBank = this.state.currentBank;
    var bank        = event.target.value;

    currentBank.bank  = bank.toUpperCase();

    this.setState({
      currentBank: currentBank
    });
  };

  handleTypeChanged(event) {
    var currentBank = this.state.currentBank;
    var type        = event.target.value;

    currentBank.type  = type.toUpperCase();

    this.setState({
      currentBank: currentBank
    });
  };

  render() {
    return (
      <div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>
                Bank
              </label>
              <input
                type="text"
                className="form-control"
                value={this.state.currentBank.bank}
                disabled={this.props.formDisabled}
                onChange={this.handleBankChanged.bind(this)}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>
                Type
              </label>
              <select
                className="form-control"
                value={this.state.currentBank.type}
                disabled={this.props.formDisabled}
                onChange={this.handleTypeChanged.bind(this)}
              >
                <option value="SAVINGS">SAVINGS</option>
                <option value="CURRENT">CURRENT</option>
                <option value="CHECKING">CHECKING</option>
                <option value="OTHERS">OTHERS</option>
              </select>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>
                Actions
              </label>
              <div className="form-group">
                <div className="btn-group">
                  <button
                    className="btn btn-primary btn-block"
                    disabled={this.props.formDisabled}
                    onClick={this.handleAddClicked.bind(this)}
                  >
                    <span className="fa fa-plus" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr/>
        {this.renderBanks()}
      </div>
    );
  }
}
