import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import Select from 'react-select';
import Resizer from 'react-image-file-resizer';
import Modal from 'react-modal';

import SkCubeLoading from '../SkCubeLoading';
import ErrorDisplay from '../ErrorDisplay';
import ApplicationFormFinancialInformation from './ApplicationFormFinancialInformation';
import ApplicationFormCLIPBeneficiary from './ApplicationFormCLIPBeneficiary';
import ApplicationFormProjectType from './ApplicationFormProjectType';
import ApplicationTransferOption from './ApplicationTransferOption';

export default class ApplicationFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      isSaving: false,
      isActive: false,
      coMakers: [],
      loanProducts: [],
      loanProductTypes: [],
      loanProductTagging: [],
      currentLoanProductId: "",
      currentLoanProductTypeId: "",
      projectTypeCategories: [],
      projectTypes: [],
      optionTransfer: [],
      TransferOptions: [],
      currentProjectTypeCategoryId: "",
      currentBankTransferId: "",
      data: false,
      coMakerProfilePicture: false,
      coMakerThreeProfilePicture: false,
      memberMobileNumber: "",
      isMobileNumberValid: false,
      mobileNumberMaxLength: false,
      isMobileNumberExist: false,
      errors: false
    };
  }

  componentDidMount() {
    var context = this;

    var data  = {
      id: this.props.id,
      member_id: this.props.memberId
    }

    // Fetch co_makers
    $.ajax({
      url: "/api/v1/members/member_co_makers",
      data: {
        id: context.props.memberId
      },
      method: 'GET',
      success: function(response) {
        console.log(response);
        context.setState({
          coMakers: response.co_makers
        });
      },
      error: function(response) {
        console.log(response);
      }
    });

    // Fetch loan_products
    $.ajax({
      url: "/api/v1/members/member_loan_products",
      data: {
        id: context.props.memberId
      },
      method: 'GET',
      success: function(response) {
        console.log("Got Loan Products");
        console.log(response);
        console.log(context.state.data);
        // Set currentLoanProductId
        var data  = context.state.data;

        context.setState({
          loanProducts: response.loan_products,
          data: data
        });
      },
      error: function(response) {
        console.log(response);
      }
    });

    // Fetch loan_product_types
    $.ajax({
      url: "/api/loan_product_types",
      data: {
        loan_product_id: context.state.currentLoanProductId
      },
      method: 'GET',
      success: function(response) {
        console.log("Got Loan Product Types");
        console.log(response);
        
        var data = context.state.data;

        context.setState({
          loanProductTypes: response.loan_product_types
        });
      }
    });

    // Fetch loan_product_tagging
    $.ajax({
      url: "/api/loan_product_taggings",
      data: {
        loan_product_id: context.state.currentLoanProductId
      },
      method: 'GET',
      success: function(response) {
        console.log("Got Loan Product Types");
        console.log(response);
        
        var data = context.state.data;

        context.setState({
          loanProductTagging: response.loan_product_taggingg
        });
      }
    });

    // Fetch member_mobile_number
    $.ajax({
      url: "/api/v1/members/member_mobile_number",
      data: {
        id: context.props.memberId
      },
      method: 'GET',
      success: function(response) {
        // console.log("Got Member Mobile Number");
        // console.log(response.mobile_number);
        var mobile_number = response.mobile_number
        mobile_number = mobile_number.replace(/[&\/\\#,\-\_()$~%.'":*?<>{}]/g, '');


        if(mobile_number.substring(0,3) == "639"){
          context.setState({
            mobileNumberMaxLength: 12
          });
        }
        else if(mobile_number.substring(0,4) == "+639"){
          context.setState({
            mobileNumberMaxLength: 13
          });
        }
        else if(mobile_number.substring(0,2) == "09"){
          context.setState({
            mobileNumberMaxLength: 11
          });
        }
        else if(mobile_number.substring(0,1) == "9"){
          context.setState({
            mobileNumberMaxLength: 10
          });
        }

        var regex = /((\+63)|0|63|)[.\- ]?9[0-9]{2}[.\- ]?[0-9]{3}[.\- ]?[0-9]{4}/
        if(regex.test(mobile_number)){
          let mobileNumberExist = context.getMobileNumberExist(mobile_number); // check if mobile number is exist
          // console.log("isMobileNumberExist: ", context.state.isMobileNumberExist);
          if(!mobileNumberExist){
            context.setState({
              isMobileNumberValid: true
            });
          }
          // context.setState({
          //   isMobileNumberValid: true
          // });
        }
        else{
          context.setState({
            isMobileNumberValid: false
          });
        }

        context.setState({
          memberMobileNumber: mobile_number,
        });
      },
      error: function(response) {
        console.log(response);
      }
    });

    $.ajax({
      url: "/api/v1/loans/fetch",
      data: data,
      method: 'GET',
      success: function(response) {
        console.log(response);
        var currentProjectTypeCategoryId  = context.state.currentProjectTypeCategoryId;
        var currentBankTransferId         = context.state.currentBankTransferId;
        var projectTypes                  = [];
        var TransferOptions               = [];

        if(response.loan.project_type_id) {
          for(var i = 0; i < response.project_type_categories.length; i++) {
            for(var j = 0; j < response.project_type_categories[i].project_types.length; j++) {
              if(response.loan.project_type_id == response.project_type_categories[i].project_types[j].id) {
                currentProjectTypeCategoryId  = response.project_type_categories[i].id;
                projectTypes                  = response.project_type_categories[i].project_types; 
                console.log("projectTypes to be loaded:");
                console.log(projectTypes);
              }
            }
          }
        }
        if(response.loan.bank_id) {
          for(var i = 0; i < response.transfer_option.length; i++) {
            for(var j = 0; j < response.transfer_option[i].bank_transfers.length; j++) {
              if(response.loan.bank_id == response.transfer_option[i].bank_transfers[j].id) {
                currentBankTransferId = response.transfer_option[i].id;
                TransferOptions       = response.transfer_option[i].bank_transfers;
                console.log("Bank Transfer to be loaded:");
                console.log(TransferOptions);
              }
            }
          }
        }

        context.setState({
          isLoading: false,
          data: response.loan,
          projectTypeCategories: response.project_type_categories,
          optionTransfer: response.transfer_option,
          projectTypes: projectTypes,
          TransferOptions: TransferOptions,
          currentProjectTypeCategoryId: currentProjectTypeCategoryId,
          currentBankTransferId: currentBankTransferId,
          coMakerProfilePicture: response.loan.co_maker_relative_profile_picture_url,
          coMakerThreeProfilePicture: response.loan.co_maker_non_relative_profile_picture_url });
      },
      error: function(response) {
        console.log(response);
        alert("Something went wrong when fetching loan");
      }
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

  getMobileNumberExist(mobile_number){
    let context = this;
  
    // Fetch member_mobile_number_exist
    $.ajax({
      url: "/api/v1/members/mobile_number_exist",
      data: {
        mobile_number: mobile_number,
        id: context.props.memberId
      },
      method: 'GET',
      success: function(response) {
        // console.log("Got Member Mobile Number");
        // console.log(response);
        
        var is_mobile_number_exist = response.mobile_number_exist;

        // console.log("UYKAP: ", is_mobile_number_exist);
        context.setState({
          isMobileNumberExist: is_mobile_number_exist,
        });
        
        return is_mobile_number_exist;
      },
      error: function(response) {
        console.log(response);
      }
    });
  }

  updateData(data) {
    this.setState({
      data: data
    });
  }

  handleDatePrepared(event) {
    var data  = this.state.data;

    data.date_prepared  = event.target.value;

    this.updateData(data);
  }

  handleDateReleased(event) {
    var data  = this.state.data;

    data.date_released  = event.target.value;

    this.updateData(data);
  }

  handlePnNumber(event) {
    var data  = this.state.data;

    data.pn_number  = event.target.value;

    this.updateData(data);
  }

  handleClipNumber(event) {
    var data  = this.state.data;

    data.data.clip_number = event.target.value;

    this.updateData(data);
  }

  handlePrincipal(event) {
    var data  = this.state.data;

    data.principal  = event.target.value;

    this.updateData(data);
  }

  handleCoMakerThree(event) {
    var data  = this.state.data;

    data.data.co_maker_three = event.target.value.toUpperCase();

    this.updateData(data);
  }

  handleCoMakerTwo(event) {
    var data = this.state.data;

    data.data.co_maker_two = event.target.value.toUpperCase();

    this.updateData(data);
  }

  handleCoMakerOne(o) {
    var data  = this.state.data;

    for(var i = 0; i < this.state.coMakers.length; i++) {
      if(this.state.coMakers[i].id == o.value) {
        data.data.co_maker_one  = this.state.coMakers[i];
      }
    }

    this.updateData(data);
  }

  handleNumInstallments(event) {
    var data  = this.state.data;

    data.num_installments = event.target.value;

    this.updateData(data);
  }

  handleTerm(event) {
    var data  = this.state.data;

    data.term = event.target.value;

    this.updateData(data);
  }

  handleVoucherParticular(event) {
    var data  = this.state.data;

    data.data.voucher.particular  = event.target.value;

    this.updateData(data);
  }

  handleSave() {
    const context = this;
    const state   = context.state;

    this.setState({
      isSaving: true
    });

    const formData = new FormData();

    if(state.coMakerProfilePicture) {
      formData.append('co_maker_profile_picture', state.coMakerProfilePicture);
    }

    if(state.coMakerThreeProfilePicture) {
      formData.append('co_maker_three_profile_picture', state.coMakerThreeProfilePicture);
    }

    // FOR MOBILE NUMBER
    formData.append('mobile_number', state.memberMobileNumber);

    formData.append('payload', JSON.stringify(state.data));
    formData.append('authenticity_token', context.props.authenticityToken);

    $.ajax({
      url: "/api/v1/loans/save",
      method: "POST",
      data: formData,
      contentType: false,
      processData: false,
      cache: false,
      success: function(response) {
        window.location.href="/loans/" + response.id;
      },
      error: function(response) {
        try {
          context.setState({
            errors: JSON.parse(response.responseText),
            isSaving: false
          });
        } catch(err) {
          alert("Something went wrong");
          context.setState({
            errors: false,
            isSaving: false
          });
        }
      }
    });
  }

  handleCancel() {
    window.location.href="/members/" + this.props.memberId + "/display";
  }

  handleLoanProductType(event) {
    var data  = this.state.data;

    data.loan_product_type_id = event.target.value;

    this.updateData(data);
  }
  
  handleLoanProductTag(event) {
    var data  = this.state.data;

    data.loan_product_tagging_id = event.target.value;

    this.updateData(data);
  }
  
  renderLoanProductTagging() {
    var data                = this.state.data;
    var loanProductTagging  = this.state.loanProductTagging || [];
    var display             = [];
    console.log(loanProductTagging)
    display.push(
      <option value="" key="empty-loan-product-type">
        -- SELECT --
      </option>
    )

    for(var i = 0; i < loanProductTagging.length; i++) {
      display.push(
        <option value={loanProductTagging[i].id} key={"loan-product-tag-" + loanProductTagging[i].id}>
          {loanProductTagging[i].name}
        </option>
      )
    }

    return display;
  }

  handleLoanProduct(event) {
    var data    = this.state.data;
    var context = this;

    data.loan_product_id  = event.target.value;

    // Fetch loan_product_types
    $.ajax({
      url: "/api/loan_product_taggings",
      data: {
        loan_product_id: data.loan_product_id
      },
      method: 'GET',
      success: function(response) {
        console.log("Got Loan Product Types");
        console.log(response);
        
        var data = context.state.data;

        if(response.loan_product_tagging.length > 0) {
          data.loan_product_tagging_id = response.loan_product_tagging[0].id;
        }

        context.setState({
          loanProductTagging: response.loan_product_tagging,
          data: data
        });
      }
    })

    this.updateData(data);
  }

  renderLoanProducts() {
    var data                = this.state.data;
    var loanProducts        = this.state.loanProducts;
    var loanProductsDisplay = [];

    loanProductsDisplay.push(
      <option value="" key={"empty-loan-product"}>
        -- SELECT --
      </option>
    );

    for(var i = 0; i < loanProducts.length; i++) {
      loanProductsDisplay.push(
        <option value={loanProducts[i].id} key={"loan-product-" + loanProducts[i].id}>
          {loanProducts[i].name}
        </option>
      );
    }

    return loanProductsDisplay;
  }

  renderLoanProductTypes() {
    var data              = this.state.data;
    var loanProductTypes  = this.state.loanProductTypes || [];
    var display           = [];

    display.push(
      <option value="" key="empty-loan-product-type">
        -- SELECT --
      </option>
    )

    for(var i = 0; i < loanProductTypes.length; i++) {
      display.push(
        <option value={loanProductTypes[i].id} key={"loan-product-type-" + loanProductTypes[i].id}>
          {loanProductTypes[i].name}
        </option>
      )
    }

    return display;
  }
  

  renderNumInstallmentOptions() {
    var term  = this.state.data.term;
    var termItems = [];

    if(term == "weekly") {
      termItems.push(
        <option value={15} key={"weekly-" + 15}>
          15
        </option>
      );

      termItems.push(
        <option value={25} key={"weekly-" + 25}>
          25
        </option>
      );

      termItems.push(
        <option value={35} key={"weekly-" + 35}>
          35
        </option>
      );

      termItems.push(
        <option value={50} key={"weekly-" + 50}>
          50
        </option>
      );

      termItems.push(
        <option value={75} key={"weekly-" + 75}>
          75
        </option>
      );
      
      termItems.push(
        <option value={100} key={"weekly-" + 100}>
          100
        </option>
      );

    } else if(term == "monthly") {
      termItems.push(
        <option value={3} key={"monthly-" + 3}>
          3
        </option>
      );

      termItems.push(
        <option value={6} key={"monthly-" + 6}>
          6
        </option>
      );

      termItems.push(
        <option value={9} key={"monthly-" + 9}>
          9
        </option>
      );

      termItems.push(
        <option value={12} key={"monthly-" + 12}>
          12
        </option>
      );
    } else if(term == "semi-monthly") {
      termItems.push(
        <option value={6} key={"semi-monthly-" + 6}>
          6
        </option>
      );

      termItems.push(
        <option value={12} key={"semi-monthly-" + 12}>
          12
        </option>
      );

      termItems.push(
        <option value={18} key={"semi-monthly-" + 18}>
          18
        </option>
      );

      termItems.push(
        <option value={24} key={"semi-monthly-" + 24}>
          24
        </option>
      );
      termItems.push(
        <option value={50} key={"semi-monthly-" + 50}>
          50
        </option>
      );
    }

    return termItems;
  }

  handleProjectTypeCategoryChanged(event) {
    this.setState({
      currentProjectTypeCategoryId: event.target.value
    });
  }
  handleTransferOptionChanged(event) {
    this.setState({
      currentBankTransferId: event.target.value
    });
  }

  handleBusinessPermitAvailableChanged(event) {
    const target  = event.target;
    const value   = target.type === 'checkbox' ? target.checked : target.value;

    var data  = this.state.data;
    data.data.business_permit_available  = value || false;

    this.setState({ data: data });
  }

  handleAdvanceInsuranceChanged(event) {
    const target  = event.target;
    const value   = target.type === 'checkbox' ? target.checked : target.value;

    var data  = this.state.data;
    data.data.advance_insurance_available  = value || false;

    this.setState({ data: data });
  }
  handleShareCapitalChanged(event) {
    const target  = event.target;
    const value   = target.type === 'checkbox' ? target.checked : target.value;

    var data  = this.state.data;
    data.data.share_capital_available  = value || false;

    this.setState({ data: data });
  }
  handleServiceFeeChanged(event) {
    const target  = event.target;
    const value   = target.type === 'checkbox' ? target.checked : target.value;

    var data  = this.state.data;
    data.data.service_fee_available  = value || false;

    this.setState({ data: data });
  }
  
  handleSMSFeeChanged(event) {
    const target  = event.target;
    const value   = target.type === 'checkbox' ? target.checked : target.value;

    var data  = this.state.data;
    data.data.sms_fee_available  = value || false;

    this.setState({ data: data });
  }

  handleCoMakerThreeProfilePictureSelected(event) {
    const context         = this;
    const fileInput       = event.target.files[0];
    const fileType        = fileInput['type'];
    const validFileTypes  = ['image/gif', 'image/jpeg', 'image/png'];

    if(fileType && validFileTypes.includes(fileType)) {
      try {
        Resizer.imageFileResizer(
          fileInput,
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            console.log(uri);
            context.setState({
              coMakerThreeProfilePicture: uri
            })
          },
          "base64",
          200,
          200
        )
      } catch(err) {
        console.log(err);
        alert("Error resizing image file for co-maker");
      }
    } else {
      alert("Invalid image file!");
    }
  }

  handleCoMakerProfilePictureSelected(event) {
    const context         = this;
    const fileInput       = event.target.files[0];
    const fileType        = fileInput['type'];
    const validFileTypes  = ['image/gif', 'image/jpeg', 'image/png'];

    if(fileType && validFileTypes.includes(fileType)) {
      try {
        Resizer.imageFileResizer(
          fileInput,
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            console.log(uri);
            context.setState({
              coMakerProfilePicture: uri
            })
          },
          "base64",
          200,
          200
        )
      } catch(err) {
        console.log(err);
        alert("Error resizing image file for co-maker");
      }
    } else {
      alert("Invalid image file!");
    }
  }

  handleInputMobileNumberValidator(e){
    if(/^[0-9 +]*$/.test(e.target.value)){
      // console.log("type:", e.target.value)
      this.setState({
        memberMobileNumber: e.target.value
      });

      // VALIDATE THE MOBILE NUMBER
      var regex = /((\+63)|0|63|)[.\- ]?9[0-9]{2}[.\- ]?[0-9]{3}[.\- ]?[0-9]{4}/
      if(regex.test(e.target.value) && 
                      !(e.target.value.substring(0,5) == "+6309") && 
                      !(e.target.value.substring(0,4) == "6309") &&
                      ((e.target.value.substring(0,3) == "639") || 
                        (e.target.value.substring(0,4) == "+639") || 
                        (e.target.value.substring(0,2) == "09") || 
                        (e.target.value.substring(0,1) == "9") )
      ){
        let mobileNumberExist = this.getMobileNumberExist(e.target.value); //Check if member mobile number is exist
        if(!mobileNumberExist){
          this.setState({
            isMobileNumberValid: true
          });
        }
        // this.setState({
        //   isMobileNumberValid: true
        // });
      }
      else{
        this.setState({
          isMobileNumberValid: false
        });
      }

      // RESTRICT THE MAX LENGTH OF MOBILE NUMBER 
      if(e.target.value.substring(0,3) == "639"){
        this.setState({
          mobileNumberMaxLength: 12
        });
        // if the mobile number length exceed to limit
        if(e.target.value.length > 12){
          this.setState({
            isMobileNumberValid: false
          });
        }
      }
      else if(e.target.value.substring(0,4) == "+639"){
        this.setState({
          mobileNumberMaxLength: 13
        });

        // if the mobile number length exceed to limit
        if(e.target.value.length > 13){
          this.setState({
            isMobileNumberValid: false
          });
        }
      }
      else if(e.target.value.substring(0,2) == "09"){
        this.setState({
          mobileNumberMaxLength: 11
        });

        // if the mobile number length exceed to limit
        if(e.target.value.length > 11){
          this.setState({
            isMobileNumberValid: false
          });
        }
      }
      else if(e.target.value.substring(0,1) == "9"){
        this.setState({
          mobileNumberMaxLength: 11
        });

        // if the mobile number length exceed to limit
        if(e.target.value.length == 11 || e.target.value.length > 10){
          this.setState({
            isMobileNumberValid: false
          });
        }

        // IF THE MOBILE NUMBER IS START WITH 9
        // this.setState({
        //   isMobileNumberValid: false
        // });
      }
      else{
        this.setState({
          mobileNumberMaxLength: false
        });
      }
    }
  }

  renderCoMakerProfilePicture() {
    if(this.state.coMakerProfilePicture) {
      return (
        <img
          src={this.state.coMakerProfilePicture}
        />
      );
    } else {
      return (
        <div>
          No profile picture selected
        </div>
      );
    }
  }

  renderCoMakerThreeProfilePicture() {
    if(this.state.coMakerThreeProfilePicture) {
      return (
        <img
          src={this.state.coMakerThreeProfilePicture}
        />
      );
    } else {
      return (
        <div>
          No profile picture selected
        </div>
      );
    }
  }

  render() {
    if(this.state.isLoading) {
      return  (
        <SkCubeLoading/>
      );
    } else {
      var data  = this.state.data;
      var coMakerOne  = { 
        value: data.data.co_maker_one.id,
        label: data.data.co_maker_one.last_name + ", " + data.data.co_maker_one.first_name
      };

      var businessPermitAvailable = this.state.data.data.business_permit_available || false;
      var advanceInsuranceAvailable = this.state.data.data.advance_insurance_available || false;
      var shareCapitalAvailable = this.state.data.data.share_capital_available || false;
      var serviceFeeAvailable = this.state.data.data.service_fee_available || false;
      var smsFeeAvailable = this.state.data.data.sms_fee_available || false;

      console.log(this.props.settings)

      return  (
        <div>
          {this.renderErrorDisplay()}
          <h5>
            Co-maker Information
          </h5>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 col-xs-12">
                  <div className="form-group">
                    <label>
                      Pangalan ng Co-maker (Kamag-anak)
                    </label>
                    <input
                      className="form-control"
                      value={data.data.co_maker_two}
                      onChange={this.handleCoMakerTwo.bind(this)}
                      disabled={this.state.isSaving || this.state.isActive || !this.props.settings.use_co_maker_two }
                    />
                    <hr/>
                    <label>
                      Profile Picture (Kamag-anak)
                    </label>
                    <br/>
                    <input
                      type="file"
                      className="form-control"
                      accepts="image/*"
                      disabled={this.state.isSaving || this.state.isActive || !this.props.settings.use_co_maker_two }
                      capture="user"
                      onChange={this.handleCoMakerProfilePictureSelected.bind(this)}
                    />
                    <br/>
                    {this.renderCoMakerProfilePicture()}
                  </div>
                </div>
                <div className="col-md-4 col-xs-12">
                  <div className="form-group">
                    <label>
                      Pangalan ng Co-maker (Hindi kamag-anak / kapitbahay)
                    </label>
                    <input
                      className="form-control"
                      value={data.data.co_maker_three}
                      onChange={this.handleCoMakerThree.bind(this)}
                      disabled={this.state.isSaving || this.state.isActive || !this.props.settings.use_co_maker_three }
                    />
                    <hr/>
                    <label>
                      Profile Picture (Hindi Kamag-anak / kapitbahay)
                    </label>
                    <br/>
                    <input
                      type="file"
                      className="form-control"
                      accepts="image/*"
                      disabled={this.state.isSaving || this.state.isActive || !this.props.settings.use_co_maker_three }
                      capture="user"
                      onChange={this.handleCoMakerThreeProfilePictureSelected.bind(this)}
                    />
                    <br/>
                    {this.renderCoMakerThreeProfilePicture()}
                  </div>
                </div>
                <div className="col-md-4 col-xs-12">
                  <div className="form-group">
                    <label>
                      Pangalan ng Co-maker (Kasama sa sentro)
                    </label>
                    <Select
                      value={coMakerOne}
                      options={this.state.coMakers}
                      onChange={this.handleCoMakerOne.bind(this)}
                      isDisabled={this.state.isSaving || this.state.isActive || !this.props.settings.use_co_maker_one }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label style={{ fontWeight: "bold" }}>
                  <span style={{ color: "red" }}>
                    {"*"}
                  </span>
                  <span>
                    {" PN Number"}
                  </span>
                </label>
                <input
                  className="form-control"
                  value={data.pn_number}
                  onChange={this.handlePnNumber.bind(this)}
                  disabled={this.state.isSaving || this.state.isActive}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>
                  CLIP Number
                </label>
                <input
                  className="form-control"
                  value={data.data.clip_number}
                  onChange={this.handleClipNumber.bind(this)}
                  disabled={this.state.isSaving || this.state.isActive}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label style={{ fontWeight: "bold" }}>
                  <span style={{ color: "red" }}>
                    {"*"}
                  </span>
                  <span>
                    {" Date Prepared"}
                  </span>
                </label>
                <input
                  className="form-control"
                  type="date"
                  value={data.date_prepared}
                  onChange={this.handleDatePrepared.bind(this)}
                  disabled={this.state.isSaving || this.state.isActive}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>
                  Date Released
                </label>
                <input
                  className="form-control"
                  type="date"
                  value={data.date_released}
                  onChange={this.handleDateReleased.bind(this)}
                  disabled={this.state.isSaving || this.state.isActive}
                />
              </div>
            </div>
          </div>
          <h5>
            Loan Information
          </h5>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label style={{ fontWeight: "bold" }}>
                      <span style={{ color: "red" }}>
                        {"*"}
                      </span>
                      <span>
                        {" Halaga ng Hinihiram"}
                      </span>
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      value={data.principal}
                      onChange={this.handlePrincipal.bind(this)}
                      disabled={this.state.isSaving || this.state.isActive}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label>
                      Loan Product
                    </label>
                    <select
                      className="form-control"
                      value={data.loan_product_id || "-1"}
                      onChange={this.handleLoanProduct.bind(this)}
                      disabled={this.state.isSaving || this.state.isActive}
                    >
                      {this.renderLoanProducts()}
                    </select>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label>
                      Loan Product Tag
                    </label>
                    <select
                      className="form-control"
                      value={data.loan_product_tagging_id || "-1"}
                      onChange={this.handleLoanProductTag.bind(this)}
                      disabled={this.state.isSaving || this.state.isActive}
                    >
                      {this.renderLoanProductTagging()}
                    </select>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label>
                      Term
                    </label>
                    <select
                      className="form-control"
                      value={data.num_installments}
                      onChange={this.handleNumInstallments.bind(this)}
                    >
                      {this.renderNumInstallmentOptions()}
                    </select>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label>
                      Mode of Payment
                    </label>
                    <select
                      className="form-control"
                      value={data.term}
                      onChange={this.handleTerm.bind(this)}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="semi-monthly">Semi-monthly</option>
                    </select>
                  </div>
                </div>
              </div>
              <br />
              <div className='row'>
                <div className='col'>
                  <div className="form-group">
                    <label style={{ fontWeight: "bold" }}>
                      <span style={{ color: "red" }}>
                        {"*"}
                      </span>
                      <span>
                        {" Mobile Number"}
                      </span>
                    </label>
                    
                    <br />
                    <label style={{ color: "grey", fontWeight: "bold" }}>
                      Example: +639xxxxxxxxx | 639xxxxxxxxx | 09xxxxxxxxx | 9xxxxxxxxx
                    </label>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: 'center', gap: "10px" }}>
                      <input
                        style={{ width: "150px" }}
                        className="form-control"
                        value={this.state.memberMobileNumber}
                        maxLength={this.state.mobileNumberMaxLength}
                        onChange={e=>{this.handleInputMobileNumberValidator(e)}}
                      />
                      <label style={{ color: this.state.isMobileNumberValid ? ( !this.state.isMobileNumberExist ? "green" : "red") : "red", fontWeight: "bold" }}>
                        {this.state.isMobileNumberValid ? (!this.state.isMobileNumberExist ? "Valid Mobile Number" : "This Mobile Number Is Already Exist") : "Invalid Mobile Number"}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr/>
          <h5>
            Financial Information
          </h5>
          <div className="card">
            <div className="card-body">
              <ApplicationFormFinancialInformation
                data={this.state.data}
                updateData={this.updateData.bind(this)}
                disabled={this.state.isSaving || this.state.isActive}
                banks={this.props.banks}
              />
            </div>
          </div>
          <hr/>
          <h5>
            CLIP Beneficiary
          </h5>
          <div className="card">
            <div className="card-body">
              <ApplicationFormCLIPBeneficiary
                data={this.state.data}
                updateData={this.updateData.bind(this)}
                disabled={this.state.isSaving || this.state.isActive}
              />
            </div>
          </div>
          <h5>
            Project Type
          </h5>
          <div className="card">
            <div className="card-body">
              <ApplicationFormProjectType
                projectTypeCategories={this.state.projectTypeCategories}
                updateData={this.updateData.bind(this)}
                currentProjectTypeCategoryId={this.state.currentProjectTypeCategoryId}
                handleProjectTypeCategoryChanged={this.handleProjectTypeCategoryChanged.bind(this)}
                disabled={this.state.isSaving || this.state.isActive}
                data={this.state.data}
              />
            </div>
          </div>
          <hr/>
          <h5>
            Bank Transfer
          </h5>
          <div className="card">
            <div className="card-body">
              <ApplicationTransferOption
                optionTransfer={this.state.optionTransfer}
                updateData={this.updateData.bind(this)}
                currentBankTransferId={this.state.currentBankTransferId}
                handleTransferOptionChanged={this.handleTransferOptionChanged.bind(this)}
                disabled={this.state.isSaving || this.state.isActive}
                data={this.state.data}
              />
            </div>
          </div>
          <h5>
            Other Parameters
          </h5>
          <div className="card">
            <div className="card-body">
              <input 
                type="checkbox" 
                checked={businessPermitAvailable}
                onChange={this.handleBusinessPermitAvailableChanged.bind(this)}
              />
              <label>
                Business Permit Available
              </label>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <input 
                type="checkbox" 
                checked={advanceInsuranceAvailable}
                onChange={this.handleAdvanceInsuranceChanged.bind(this)}
              />
              <label>
                Off Insurance
              </label>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <input 
                type="checkbox" 
                checked={shareCapitalAvailable}
                onChange={this.handleShareCapitalChanged.bind(this)}
              />
              <label>
                Off Sharecapital
              </label>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <input 
                type="checkbox" 
                checked={serviceFeeAvailable}
                onChange={this.handleServiceFeeChanged.bind(this)}
              />
              <label>
                Off Service Fee
              </label>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <input 
                type="checkbox" 
                checked={smsFeeAvailable}
                onChange={this.handleSMSFeeChanged.bind(this)}
              />
              <label>
                Off SMS Fee
              </label>
            </div>
          </div>




          <hr/>
          {this.renderErrorDisplay()}
          <div className="row">
            <div className="col">
              <div className="btn-group">
                <button
                  className="btn btn-primary"
                  onClick={this.handleSave.bind(this)}
                  disabled={(this.state.isSaving || this.state.isActive) || !this.state.isMobileNumberValid || this.state.isMobileNumberExist}
                >
                  <span className="bi bi-check"/>
                  Save
                </button>
                <button
                  className="btn btn-danger"
                  onClick={this.handleCancel.bind(this)}
                  disabled={this.state.isSaving || this.state.isActive}
                >
                  <span className="bi bi-x"/>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
