import React from 'react';
import $ from 'jquery';

import SkCubeLoading from '../SkCubeLoading';
import ErrorDisplay from '../ErrorDisplay';

import FormApplicationHeader from './FormApplicationHeader';
import FormPersonalInfo from './FormPersonalInfo';
import FormNumChildren from './FormNumChildren';
import FormContactNumbers from './FormContactNumbers';
import FormGovernmentIdentificationNumbers from './FormGovernmentIdentificationNumbers';
import FormSpouse from './FormSpouse';
import FormExperience from './FormExperience';
import FormRecruit from './FormRecruit';
import FormBankAccounts from './FormBankAccounts';
import FormLegalDependents from './FormLegalDependents';
import FormBeneficiaries from './FormBeneficiaries';
import FormReferrals from './FormReferrals';

export default class FormDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      formDisabled: false,
      data: false,
      memberId: props.id,
      authenticityToken: props.authenticityToken,
      branches: [],
      centers: [],
      membershipArrangements: props.membershipArrangements || [],
      membershipTypes: props.membershipTypes || [],
      referrers: props.referrers || [],
      coordinators: props.coordinators || [],
      authError: false,
      currentMembershipType: {
        value: "",
        label: ""
      },
      currentBranch: {
        value: "",
        label: ""
      },
      currentCenter: {
        value: "",
        label: ""
      },
      currentMembershipArrangement: {
        value: "",
        label: ""
      },
      currentReferrer: {
        value: "",
        label: ""
      },
       currentCoordinator: {
        value: "",
        label: ""
      },
      currentMemberType: "Regular",
      errors: false
    };
  }

  componentDidMount() {
    this.fetch();
  }

  updateCurrentMemberType(o) {
    var data          = this.state.data;
    data.member_type  = o;

    this.setState({
      currentMemberType: data.member_type,
      data: data
    });
  }

  updateCurrentCenter(o) {
    var data          = false;
    var currentCenter = o;

    if(this.state.data) {
      data  = this.state.data;
      data.center_id    = o.value;
      data.center_name  = o.label;

      currentCenter = {
        value: data.center_id,
        label: data.center_name
      }
    }

    this.setState({
      currentCenter: currentCenter,
      data: data
    });
  }

  updateCurrentMembershipArrangement(o) {
    var data  = this.state.data;
    data.membership_arrangement_id    = o.value;
    data.membership_arrangement_name  = o.label;

    this.setState({
      data: data,
      currentMembershipArrangement: o
    });
  }

  updateCurrentMembershipType(o) {
    var data  = this.state.data;
    data.membership_type_id   = o.value;
    data.membership_type_name = o.label;

    this.setState({
      data: data,
      currentMembershipType: o
    });
  }

  updateCurrentReferrer(o) {
    var data  = this.state.data;
    data.referrer_id   = o.value;
    data.referrer_name = o.label;

    this.setState({
      data: data,
      currentReferrer: o
    });
  }

  updateCurrentCoordinator(o) {
    var data  = this.state.data;
    data.coordinator_id   = o.value;
    data.coordinator_name = o.label;

    this.setState({
      data: data,
      currentCoordinator: o
    });
  }

  updateCurrentBranch(o) {
    var centers = [];
    for(var i = 0; i < this.state.branches.length; i++) {
      if(this.state.branches[i].id == o.value) {
        for(var j = 0; j < this.state.branches[i].centers.length; j++) {
          centers = this.state.branches[i].centers;
        }
      }
    }

    var data  = false;
    if(this.state.data) {
      data              = this.state.data;
      data.branch_id    = o.value;
      data.branch_name  = o.label;
    }

    var currentCenter = {
      value: "",
      label: ""
    }

    if(centers.length > 0) {
      currentCenter.value = centers[0].id;
      currentCenter.label = centers[0].name;
    }

    this.setState({
      data: data,
      currentBranch: o,
      centers: centers,
      currentCenter: currentCenter
    });

  }

  fetchBranches() {
    var context = this;

    $.ajax({
      url: "/api/v1/branches",
      method: "GET",
      data: {
        
      },
      dataType: 'json',
      success: function(response) {
        var tempCurrentBranch = {
          value: response.branches[0].id,
          label: response.branches[0].name
        };

        var tempCurrentCenter = {
          value: response.branches[0].centers[0].id,
          label: response.branches[0].centers[0].name
        }

        context.updateCurrentBranch(tempCurrentBranch);
        context.updateCurrentCenter(tempCurrentCenter);

        context.setState({
          branches: response.branches,
          centers: response.branches[0].centers,
          currentBranch: tempCurrentBranch,
          currentCenter: tempCurrentCenter
        });
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching branches");

        context.setState({
          branches: []
        });
      }
    });
  }

  save() {
    var context = this;
    var state   = context.state;

    //console.log(data);

    $.ajax({
      url: "/api/v1/members/save",
      method: "POST",
      dataType: 'json',
      data: {
        id: state.memberId,
        member_data: JSON.stringify(state.data),
        authenticity_token: state.authenticityToken
      },
      success: function(response) {
        window.location.href="/members/" + response.id + "/display"
      },
      error: function(response) {
        try {
          context.setState({
            errors: JSON.parse(response.responseText),
            formDisabled: false
          });
        } catch(err) {
          alert("Something went wrong");
          context.setState({
            errors: false,
            formDisabled: false
          });
        }
      }
    });
  }

  fetch() {
    var context = this;

    $.ajax({
      url: "/api/v1/members/fetch",
      method: "GET",
      data: {
        id: context.state.memberId
      },
      dataType: 'json',
      success: function(response) {
        console.log(response);

        var centers = [];

        if(response.branches.length > 0) {
          centers = response.branches[0].centers;
        }

        context.setState({
          isLoading: false,
          data: response,
          branches: response.branches,
          centers: centers,
          currentMemberType: response.member_type,
          currentBranch: {
            value: response.branch_id,
            label: response.branch_name
          },
          currentCenter: {
            value: response.center_id,
            label: response.center_name
          },
          currentMembershipArrangement: {
            value: response.membership_arrangement_id,
            label: response.membership_arrangement_name
          },
          currentMembershipType: {
            value: response.membership_type_id,
            label: response.membership_type_name
          },
          currentReferrer: {
            value: response.referrer_id,
            label: response.referrer_name
          },
          currentCoordinator: {
            value: response.coordinator_id,
            label: response.coordinator_name
          }
        });
      },
      error: function(response) {
        console.log(response);

        context.setState({
          authError: JSON.parse(response.responseText),
          errors: JSON.parse(response.responseText),
          isLoading: false,
          data: false
        });
      }
    });
  }

  handleSave() {
    var context = this;
    var state   = context.state;

    context.setState({
      formDisabled: true,
      errors: false
    });

    context.save();
  }

  handleCancel() {
    var context = this;
    var state   = context.state;

    if(state.id) {
      window.location.href="/members/" + state.id;
    } else {
      window.location.href="/members";
    }
  }

  updateData(data) {
    this.setState({
      data: data
    });
  }

  renderErrorDisplay() {
    if(this.state.errors) {
      return  (
        <ErrorDisplay
          errors={this.state.errors}
        />
      );
    }
  }

  render() {
    var context = this;
    var state   = context.state;

    var currentCenter                 = state.currentCenter;
    var currentBranch                 = state.currentBranch;
    var currentMemberType             = state.currentMemberType;
    var currentMembershipArrangement  = state.currentMembershipArrangement;
    var currentMembershipType         = state.currentMembershipType;

    var currentReferrer               = state.currentReferrer;
    var currentCoordinator            = state.currentCoordinator;

    var memberTypes             = this.props.memberTypes;
    var membershipArrangements  = this.props.membershipArrangements;
    var membershipTypes         = this.props.membershipTypes;
    var referrers               = this.props.referrers;
    var coordinators            = this.props.coordinators;

    if(state.isLoading) {
      return  (
        <SkCubeLoading/>
      );
    } else if(state.authError != false) {
      return  (
        <div>
          {this.renderErrorDisplay()}
        </div>
      );
    } else if(state.data != false) {
      return (
        <div id="member-form">
          <h2>Member Form</h2>
          <hr/>
          {this.renderErrorDisplay()}
          <div className="row">
            <div className="col">
              <FormApplicationHeader
                data={state.data}
                currentBranch={currentBranch}
                currentCenter={currentCenter}
                currentMemberType={currentMemberType}
                currentMembershipArrangement={currentMembershipArrangement}
                currentMembershipType={currentMembershipType}
                branches={state.branches}
                centers={state.centers}
                memberTypes={memberTypes}
                membershipArrangements={membershipArrangements}
                membershipTypes={membershipTypes}
                updateData={this.updateData.bind(this)}
                formDisabled={state.formDisabled}
                updateCurrentBranch={this.updateCurrentBranch.bind(this)}
                updateCurrentCenter={this.updateCurrentCenter.bind(this)}
                updateCurrentMemberType={this.updateCurrentMemberType.bind(this)}
                updateCurrentMembershipArrangement={this.updateCurrentMembershipArrangement.bind(this)}
                updateCurrentMembershipType={this.updateCurrentMembershipType.bind(this)}
              />    

              <div className="card">
                <div className="card-header">
                  Personal na Impormasyon
                </div>
                <div className="card-body">
                  <FormPersonalInfo
                    data={state.data}
                    updateData={this.updateData.bind(this)}
                    formDisabled={state.formDisabled}
                  />

                  <FormNumChildren
                    data={state.data}
                    updateData={this.updateData.bind(this)}
                    formDisabled={state.formDisabled}
                  />

                  <FormContactNumbers
                    data={state.data}
                    updateData={this.updateData.bind(this)}
                    formDisabled={state.formDisabled}
                  />

                  <FormGovernmentIdentificationNumbers
                    data={state.data}
                    updateData={this.updateData.bind(this)}
                    formDisabled={state.formDisabled}
                  />
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  Kasalukuyang Bangko
                </div>
                <div className="card-body">
                  <FormBankAccounts
                    data={state.data}
                    updateData={this.updateData.bind(this)}
                    formDisabled={state.formDisabled}
                  />
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  Personal na Impormasyon ng Asawa o Kinakasama (Common-law Spouse)
                </div>
                <div className="card-body">
                  <FormSpouse
                    data={state.data}
                    updateData={this.updateData.bind(this)}
                    formDisabled={state.formDisabled}
                  />
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  Personal na Impormasyon ng mga Legal na Dependents
                </div>
                <div className="card-body">
                  <FormLegalDependents
                    data={state.data}
                    updateData={this.updateData.bind(this)}
                    formDisabled={state.formDisabled}
                  />
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  Personal na Impormasyon sa mga Beneficiaries
                </div>
                <div className="card-body">
                  <FormBeneficiaries
                    data={state.data}
                    updateData={this.updateData.bind(this)}
                    formDisabled={state.formDisabled}
                  />
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  Background sa Pahiraman
                </div>
                <div className="card-body">
                  <FormExperience
                    data={state.data}
                    updateData={this.updateData.bind(this)}
                    formDisabled={state.formDisabled}
                  />
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  Referrals
                </div>
                <div className="card-body">
                  <FormReferrals
                    data={state.data}
                    currentReferrer={currentReferrer}
                    currentCoordinator={currentCoordinator}
                    referrers={referrers}
                    coordinators={coordinators}
                    updateData={this.updateData.bind(this)}
                    formDisabled={state.formDisabled}
                    updateCurrentReferrer={this.updateCurrentReferrer.bind(this)}
                    updateCurrentCoordinator={this.updateCurrentCoordinator.bind(this)}
                  />
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  Recruit
                </div>
                <div className="card-body">
                  <FormRecruit
                    data={state.data}
                    updateData={this.updateData.bind(this)}
                    formDisabled={state.formDisabled}
                  />
                </div>
              </div>

            </div>
          </div>
          <div className="row">
            <div className="col">
              {this.renderErrorDisplay()}
              <div className="btn-group">
                <button 
                  className="btn btn-primary" 
                  onClick={this.handleSave.bind(this)}
                  disabled={this.state.formDisabled}
                >
                  <span className="bi bi-check"/>
                  Save Record
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={this.handleCancel.bind(this)}
                  disabled={this.state.formDisabled}
                >
                  <span className="bi bi-x"/>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      <div>
        No data
      </div>
    }
  }
}
