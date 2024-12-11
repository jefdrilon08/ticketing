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

export default class FormLegalDependents extends React.Component {
  constructor(props) {
    super(props);
    
    this.state  = {
      modalIsOpen: false,
      errors: [],
      currentLegalDependent: {
        id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        date_of_birth: "",
        relationship: "",
        age: "",
        data: {
          educational_attainment: "",
          course: ""
        },
        gender: ""
      }
    }
  }

  validateCurrentLegalDependent() {
    var o       = this.state.currentLegalDependent;
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

    if(!o.relationship) {
      errors.push("relationship required");
    }

    if(!o.gender) {
      errors.push("gender required");
    }

    this.setState({
      errors: errors
    });

    return errors;
  }

  handleCancelClicked() {
    this.setState({
      modalIsOpen: false,
      currentLegalDependent: {
        id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        date_of_birth: "",
        relationship: "",
        data: {
          educational_attainment: "",
          course: ""
        },
        gender: ""
      }
    });
  }

  handleDeleteClicked(index) {
    var data  = this.props.data;

    data.legal_dependents.splice(index, 1);

    this.props.updateData(data);
  };

  handleAddClicked() {
    this.setState({
      modalIsOpen: true,
      errors: [],
      currentLegalDependent: {
        id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        date_of_birth: "",
        relationship: "",
        age: "",
        data: {
          educational_attainment: "",
          course: ""
        },
        gender: ""
      }
    });
  }

  handleConfirmSaveClicked() {
    var data    = this.props.data;
    var errors  = this.validateCurrentLegalDependent();

    console.log("Adding current legal dependent:");
    console.log(this.state.currentLegalDependent);

    if(errors.length == 0) {
      data.legal_dependents.push(this.state.currentLegalDependent);
      this.props.updateData(data);

      this.setState({
        modalIsOpen: false,
        currentLegalDependent: {
          id: "",
          first_name: "",
          middle_name: "",
          last_name: "",
          date_of_birth: "",
          relationship: "",
          data: {
            educational_attainment: "",
            course: ""
          },
          gender: ""
        }
      });
    }
  };

  handleFirstNameChanged(event) {
    var currentLegalDependent = this.state.currentLegalDependent;

    currentLegalDependent.first_name  = event.target.value.toUpperCase();

    this.setState({
      currentLegalDependent: currentLegalDependent
    });
  }

  handleMiddleNameChanged(event) {
    var currentLegalDependent = this.state.currentLegalDependent;

    currentLegalDependent.middle_name  = event.target.value.toUpperCase();

    this.setState({
      currentLegalDependent: currentLegalDependent
    });
  }

  handleLastNameChanged(event) {
    var currentLegalDependent = this.state.currentLegalDependent;

    currentLegalDependent.last_name  = event.target.value.toUpperCase();

    this.setState({
      currentLegalDependent: currentLegalDependent
    });
  }

  handleDateOfBirthChanged(event) {
    var currentLegalDependent = this.state.currentLegalDependent;

    currentLegalDependent.date_of_birth = event.target.value;
    currentLegalDependent.age           = this.getAge(currentLegalDependent.date_of_birth);

    this.setState({
      currentLegalDependent: currentLegalDependent
    });
  }

  handleGenderChanged(event) {
    var currentLegalDependent = this.state.currentLegalDependent;

    currentLegalDependent.gender = event.target.value;

    this.setState({
      currentLegalDependent: currentLegalDependent
    });
  }

  getAge(dateString) 
  {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  handleRelationshipChanged(event) {
    var currentLegalDependent = this.state.currentLegalDependent;

    currentLegalDependent.relationship  = event.target.value;

    this.setState({
      currentLegalDependent: currentLegalDependent
    });
  }

  handleEducationalAttainmentChanged(event) {
    var currentLegalDependent = this.state.currentLegalDependent;

    currentLegalDependent.data.educational_attainment = event.target.value;

    this.setState({
      currentLegalDependent: currentLegalDependent
    });
  }

  handleCourseChanged(event) {
    var currentLegalDependent = this.state.currentLegalDependent;

    currentLegalDependent.data.course  = event.target.value.toUpperCase();

    this.setState({
      currentLegalDependent: currentLegalDependent
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

  renderRecords() {
    var legalDependents = this.props.data.legal_dependents;

    if(legalDependents.length > 0) {
      var records = [];

      for(var i = 0; i < legalDependents.length; i++) {
        var name                    = legalDependents[i].last_name + ", " + legalDependents[i].first_name;
        var relationship            = legalDependents[i].relationship;
        var date_of_birth           = legalDependents[i].date_of_birth;
        var educational_attainment  = legalDependents[i].data.educational_attainment;
        var course                  = legalDependents[i].data.course;
        var age                     = legalDependents[i].age;
        var gender                  = legalDependents[i].gender;

        records.push(
          <tr key={"ld-record-" + i}>
            <td>
              {name}
            </td>
            <td>
              {date_of_birth}
            </td>
            <td>
              {age}
            </td>
            <td>
              {relationship}
            </td>
            <td>
              {educational_attainment}
            </td>
            <td>
              {course}
            </td>
            <td>
              {gender}
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
              <th>Age</th>
              <th>Gender</th>
              <th>Relationship</th>
              <th>Educational Attainment</th>
              <th>Course</th>
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
          No legal dependents
        </p>
      );
    }
  }

  render() {
    var currentLegalDependent = this.state.currentLegalDependent;

    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          style={customStyles}
        >
          
          <div class="modal-header">
            <h5>
              Impormasyon ng legal na dependent
            </h5>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>* Pangalan</label>
                <input
                  className="form-control"
                  value={currentLegalDependent.first_name}
                  onChange={this.handleFirstNameChanged.bind(this)}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Gitnang Pangalan</label>
                <input
                  className="form-control"
                  value={currentLegalDependent.middle_name}
                  onChange={this.handleMiddleNameChanged.bind(this)}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>* Apelyido</label>
                <input
                  className="form-control"
                  value={currentLegalDependent.last_name}
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
                  value={currentLegalDependent.date_of_birth}
                  onChange={this.handleDateOfBirthChanged.bind(this)}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>* Kasarian</label>
                <select
                  className="form-control"
                  value={currentLegalDependent.gender}
                  onChange={this.handleGenderChanged.bind(this)}
                >
                  <option value="">-- SELECT --</option>
                  <option value="Male">MALE</option>
                  <option value="Female">FEMALE</option>
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Relasyon</label>
                <select
                  className="form-control"
                  value={currentLegalDependent.relationship}
                  onChange={this.handleRelationshipChanged.bind(this)}
                >
                  <option value="">-- SELECT --</option>
                  <option value="Child">ANAK</option>
                  <option value="Spouse">ASAWA</option>
                  <option value="Parent">MAGULANG</option>
                  <option value="Sibling">KAPATID</option>
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Antas ng Pag-aaral</label>
                <select
                  className="form-control"
                  value={currentLegalDependent.educational_attainment}
                  onChange={this.handleEducationalAttainmentChanged.bind(this)}
                >
                  <option value="">-- SELECT --</option>
                  <option value="elementary">Elementary</option>
                  <option value="high school">High School</option>
                  <option value="college">College</option>
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Kurso</label>
                <input
                  className="form-control"
                  value={currentLegalDependent.course}
                  onChange={this.handleCourseChanged.bind(this)}
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
