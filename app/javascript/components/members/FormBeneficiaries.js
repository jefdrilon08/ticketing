import React from "react";
import Modal from 'react-modal';

const customStyles  = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

export default class FormBeneficiaries extends React.Component {
  constructor(props) {
    super(props);
    
    this.state  = {
      modalIsOpen: false,
      values: null,
      errors: [],
      currentBeneficiary: {
        id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        date_of_birth: "",
        relationship: "",
        is_primary: false
      }
    }
  }

  componentDidMount() {
    fetch('/api/yml_values/production_values')
      .then(response => response.json())
      .then(data => {
        this.setState({ values: data }); 
        // console.log('Fetched values:', data); 
      })
      .catch(error => {
        console.error('Error fetching YML values:', error);
      });
  }

  validateCurrentBeneficiary() {
    const values  = this.state.values;
    var o       = this.state.currentBeneficiary; 
    var errors  = [];

    if(!o.first_name) {
      errors.push("first name required");
    }

    if(!o.last_name) {
      errors.push("last name required");
    }

    if(!o.date_of_birth) {
      errors.push("date of birth required");
    }

    //get yml_values and validate the age
    if(values === true){
        // console.log(values)
          const birthDate = new Date(o.date_of_birth);
          const currentDate = new Date();
          // console.log(birthDate);
          let age = currentDate.getFullYear() - birthDate.getFullYear();

          if (
            currentDate.getMonth() < birthDate.getMonth() ||
            (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
          ) {
            age--; //if date_of_birth has not occurred this year
          }
          // console.log(age)
          // Check if age is less than 18
          if (age < 18) {
            errors.push("Age must be 18 years or older.");
          }
      }
    //   else{
    //     console.log('activate_microinsurance:', values)
    // } for checking

    if(!o.relationship) {
      errors.push("relationship required");
    }

    this.setState({
      errors: errors
    });

    return errors;
  }

  handleCancelClicked() {
    this.setState({
      modalIsOpen: false,
      currentBeneficiary: {
        id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        date_of_birth: "",
        relationship: "",
        is_primary: false
      }
    });
  }

  renderErrors() {
    var errors  = this.state.errors;

    if(errors.length > 0) {
      var errorItems  = [];

      for(var i = 0; i < errors.length; i++) {
        errorItems.push(
          <li key={"e-" + i}>
            {errors[i]}
          </li>
        );
      }

      return  (
        <div className="callout callout-danger">
          <ul>
            {errorItems}
          </ul>
        </div>
      );
    }
  }

  handleDeleteClicked(index) {
    var data  = this.props.data;

    //data.beneficiaries.splice(index);

    var tempBeneficiaries = [];

    for(var i = 0; i < data.beneficiaries.length; i++) {
      if(i != index) {
        tempBeneficiaries.push(data.beneficiaries[i]);
      }
    }

    data.beneficiaries = tempBeneficiaries;

    this.props.updateData(data);
  };

  handleAddClicked = () => {
    this.setState({
      modalIsOpen: true,
      errors: [],
      currentBeneficiary: {
        id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        date_of_birth: "",
        relationship: "",
        data: {
          educational_attainment: "",
          course: ""
        }
      }
    });
  }

  handleConfirmSaveClicked() {
    var data  = this.props.data;

    var errors  = this.validateCurrentBeneficiary();

    if(errors.length == 0) {
      data.beneficiaries.push(this.state.currentBeneficiary);
      this.props.updateData(data);

      this.setState({
        modalIsOpen: false,
        currentBeneficiary: {
          id: "",
          first_name: "",
          middle_name: "",
          last_name: "",
          date_of_birth: "",
          relationship: "",
          is_primary: false
        }
      });
    }
  };

  handleFirstNameChanged(event) {
    var currentBeneficiary = this.state.currentBeneficiary;

    currentBeneficiary.first_name  = event.target.value.toUpperCase();

    this.setState({
      currentBeneficiary: currentBeneficiary
    });
  }

  handleMiddleNameChanged(event) {
    var currentBeneficiary = this.state.currentBeneficiary;

    currentBeneficiary.middle_name  = event.target.value.toUpperCase();

    this.setState({
      currentBeneficiary: currentBeneficiary
    });
  }

  handleLastNameChanged(event) {
    var currentBeneficiary = this.state.currentBeneficiary;

    currentBeneficiary.last_name  = event.target.value.toUpperCase();

    this.setState({
      currentBeneficiary: currentBeneficiary
    });
  }

  handleDateOfBirthChanged(event) {
    var currentBeneficiary = this.state.currentBeneficiary;

    currentBeneficiary.date_of_birth  = event.target.value;

    this.setState({
      currentBeneficiary: currentBeneficiary
    });
  }

  handleRelationshipChanged(event) {
    var currentBeneficiary = this.state.currentBeneficiary;

    currentBeneficiary.relationship  = event.target.value.toUpperCase();

    this.setState({
      currentBeneficiary: currentBeneficiary
    });
  }
  
  handlePrimaryChanged(event) {
    var currentBeneficiary  = this.state.currentBeneficiary;
    
    currentBeneficiary.is_primary = event.target.checked;

    this.setState({
      currentBeneficiary: currentBeneficiary
    });
  }

  renderRecords() {
    var beneficiaries = this.props.data.beneficiaries;

    if(beneficiaries.length > 0) {
      var records = [];

      for(var i = 0; i < beneficiaries.length; i++) {
        var name          = beneficiaries[i].last_name + ", " + beneficiaries[i].first_name;
        var date_of_birth = beneficiaries[i].date_of_birth;
        var relationship  = beneficiaries[i].relationship;

        records.push(
          <tr key={"ld-record-" + i}>
            <td>
              {name}
            </td>
            <td>
              {date_of_birth}
            </td>
            <td>
              {relationship}
            </td>
            <td>
              <center>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={this.handleDeleteClicked.bind(this, i)}
                >
                  <span className="fa fa-minus"/>
                  Del
                </button>
              </center>
            </td>
          </tr>
        );
      }

      return  (
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Relationship</th>
              <th>
                <center>
                  Actions
                </center>
              </th>
            </tr>
          </thead>
          <tbody>
            {records}
          </tbody>
        </table>
      );
    } else {
      return  (
        <p>
          No beneficiaries
        </p>
      );
    }
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          style={customStyles}
        >
          <div class="modal-header">
            <h3 class="modal-title">Beneficiary Form</h3>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>* Pangalan</label>
                <input
                  className="form-control"
                  value={this.state.currentBeneficiary.first_name}
                  onChange={this.handleFirstNameChanged.bind(this)}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Gitnang Pangalan</label>
                <input
                  className="form-control"
                  value={this.state.currentBeneficiary.middle_name}
                  onChange={this.handleMiddleNameChanged.bind(this)}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>* Apelyido</label>
                <input
                  className="form-control"
                  value={this.state.currentBeneficiary.last_name}
                  onChange={this.handleLastNameChanged.bind(this)}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>* Kapanganakan</label>
                <input
                  className="form-control"
                  type="date"
                  value={this.state.currentBeneficiary.date_of_birth}
                  onChange={this.handleDateOfBirthChanged.bind(this)}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Relasyon</label>
                <input
                  className="form-control"
                  value={this.state.currentBeneficiary.relationship}
                  onChange={this.handleRelationshipChanged.bind(this)}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Is Primary?</label>
                <input
                  type="checkbox"
                  onChange={this.handlePrimaryChanged.bind(this)}
                />
              </div>
            </div>
          </div>

          {this.renderErrors()}

          <hr/>

          <center>
            <div className="btn-group">
              <button
                className="btn btn-primary"
                onClick={this.handleConfirmSaveClicked.bind(this)}
              >
                <span className="bi bi-check"/>
                Confirm
              </button>
              <button
                className="btn btn-danger"
                onClick={this.handleCancelClicked.bind(this)}
              >
                <span className="bi bi-x"/>
                Cancel
              </button>
            </div>
          </center>
        </Modal>

        {this.renderRecords()}

        <button
          className="btn btn-info btn-sm"
          onClick={this.handleAddClicked.bind(this)}
        >
          <span className="fa fa-plus"/>
          Add
        </button>
      </div>
    );
  }
}
