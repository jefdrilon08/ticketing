import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import ToggleSwitch from '../utils/ToggleSwitch';
import jwtDecode from "jwt-decode";

export default function MembersProfileActions(props) {
  const [isLoading, setIsLoading]                                               = useState(false);
  const [isModalUnlockOpen, setIsModalUnlockOpen]                               = useState(false);
  const [isModalSurveyOpen, setIsModalSurveyOpen]                               = useState(false);
  const [surveyId, setSurveyId]                                                 = useState(props.surveys.length > 0 ? props.surveys[0].id : "");
  const [errors, setErrors]                                                     = useState([]);
  const [modifiable, setModifiable]                                             = useState(props.member.modifiable);
  const [isModalBalikKasapiOpen, setModalBalikKasapiOpen]                       = useState(false);
  const [isModalDelete, setIsModalDelete]                                       = useState(false);
  const [isModalReinstateOpen, setModalReinstateOpen]                           = useState(false);
  const [isModalRecognitonDateOpen, setModalRecognitonDateOpen]                 = useState(false);
  const [isModalReclassifiedOpen ,setModalReclassifiedOpen]                     = useState(false);
  const [isModalClaimsCopyPDFOpen ,setModalClaimsCopyPDFOpen]                   = useState(false);
  const [isModalResignFromInsuranceOpen, setModalResignFromInsuranceOpen]       = useState(false);
  const [dateReinstated, setDateReinstated]                                     = useState('');
  const [dateStopped, setDateStopped]                                           = useState('');
  const [dateResignedInsurance, setDateResignedInsurance]                       = useState('');
  const [reason, setReason]                                                     = useState('');
  const [dateRecognition, setDateRecognition]                                   = useState("");
  const [dateOfDeath, setDateOfDeath]                                           = useState("");
  const [reClassified, setreClassified]                                         = useState('');
  const [isModalMakePaymentOpen, setModalMakePaymentOpen]                       = useState(false);
  const [makePayment, setMakePayment]                                           = useState('');
  const [isModalProfilePictureOpen, setModalProfilePictureOpen]                 = useState(false);
  const [profilePicture, setProfilePicture]                                     = useState('');
  const [configData, setConfigData] = useState();
  const [customVariable, setCustomVariable] = useState(); // Create a new state variable

  const [selectedOptionType, setSelectedOptionType]                             = useState('CLIP');

  const [isMemberSubscribed, setIsMemberSubscribed]                             = useState(false);
  const user_MIS_BK_Role                                                        = jwtDecode(props.token).roles.includes("MIS") || jwtDecode(props.token).roles.includes("BK") || jwtDecode(props.token).roles.includes("SBK");

  const [isModalMobileNumberOpen, setModalMobileNumberOpen]                     = useState(false);
  const [mobileNumber, setMobileNumber]                                         = useState("9");
  const user_MIS_FM_Role                                                        = jwtDecode(props.token).roles.includes("MIS") || jwtDecode(props.token).roles.includes("FM") || jwtDecode(props.token).roles.includes("OAS");
  const [isMobileNumberExist, setIsMobileNumberExist]                           = useState(false);
  const [isMobileNumberValid, setIsMobileNumberValid]                           = useState(false);
  const [currentMobileNumber, setCurrentMobileNumber]                           = useState("9");
  const [success, setSuccess]                                                   = useState(false);


  useEffect(() => {
    axios.get('/api/yml_values/production_values')
      .then(response => {
        setConfigData(response.data);
        setCustomVariable(response.data); // Assign response.data to your custom variable
        console.log(response.data); // Log the value to the console
      })
      .catch(error => console.error(error));

    if(user_MIS_BK_Role){
      axios.post(
        '/api/members/is_member_subscribed',
        {
          id: props.memberId,
        },
        {
          headers: {
            'X-KOINS-HQ-TOKEN': props.token
          }
        }
      ).then((res) => {
        // console.log(res);
        setIsMemberSubscribed(res.data.is_subscribed);
      }).catch((error) => {
        console.log(error);
      });
    }

    // Fetch member_mobile_number
    if(user_MIS_FM_Role){
      axios.get(
        "/api/v1/members/member_mobile_number",
        {
          params: {
            id: props.memberId
          }
        }
      ).then((response) => {
        let mobile_number = response.data.mobile_number
        mobile_number = mobile_number.replace(/[&\/\\#,\-\_()$~%.'":*?<>{}]/g, ''); // Removes the numbers
  
        var regex_mobile_number = /((\+63)|0|63|)[.\- ]?9[0-9]{2}[.\- ]?[0-9]{3}[.\- ]?[0-9]{4}/
        if(regex_mobile_number.test(mobile_number)){
          // let mobileNumberExist = getMobileNumberExist(mobile_number); // check if mobile number is exist

          // if(!mobileNumberExist){
          //   setIsMobileNumberValid(true);
          // }

          setMobileNumber(mobile_number.slice(-10)); // GET ONLY THE LAST 10 VALUE example 9xxxxxxxx
          setCurrentMobileNumber(mobile_number.slice(-10)); // SAVE THE CURRENT MOBILE NUMBER

          setIsMobileNumberValid(true);
        }
        else{
          setIsMobileNumberValid(false);
        }

      }).catch((error) => {
        console.log(error);
      });
    }

  }, []);


  const options = [
  {
    label: "CLIP",
    value: "CLIP",
  },
  {
    label: "GPF",
    value: "GPF",
  },
  {
    label: "Members Benefit",
    value: "Members Benefit",
  }
  ];

  const handleReclassfiedClicked = () => {
    setIsLoading(true);
    const payload = {
      id: props.memberId,
      is_reclassified: reClassified
    }
    const headers = {
      'X-KOINS-HQ-TOKEN': props.token
    }
    const options = {
      headers: headers
    }
    axios.post(
      '/api/members/is_reclassified',
      payload,
      options
    ).then((res) => {
      console.log(res);
      alert("Successfully ReClassified Member");
      window.location.href="/members/" + props.memberId + "/display/";
    }).catch((error) => {
      console.log(error.response);
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }

  const handleDateRecognitionClicked = () => {
    setIsLoading(true);
    const payload = {
      id: props.memberId,
      recognition_date: dateRecognition
    }
    const headers = {
      'X-KOINS-HQ-TOKEN': props.token
    }
    const options = {
      headers: headers
    }
    axios.post(
      '/api/members/update_recognition_date',
      payload,
      options
    ).then((res) => {
      console.log(res);
      alert("Successfully Update Recognition Date");
      window.location.href="/members/" + props.memberId + "/display/";
    }).catch((error) => {
      console.log(error.response);
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }

  const handleDateofDeath = () => {
    setIsLoading(true);
    const payload = {
      id: props.memberId,
      date_of_death: dateOfDeath
    }
    const headers = {
      'X-KOINS-HQ-TOKEN': props.token
    }
    const options = {
      headers: headers
    }

    axios.post(
      '/api/members/claims_copy_pdf',
      payload,
      options
    ).then((res) => {
      console.log(res);
      alert("Generating Claims");
      headers;
      window.location.href="/members/" + props.memberId + "/claims_copy_pdf/";
    }).catch((error) => {
      console.log(error.response);
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }

  const handleProfilePictureClicked = () => {
    setIsLoading(true);

    const payload = {
      id: props.memberId,
      profile_picture: profilePicture
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': props.token
    }

    const options = {
      headers: headers
    }

    axios.post(
      '/api/members/reinstate',
      payload,
      options
    ).then((res) => {
      console.log(res);
      alert("Successfully Uploaded");
      window.location.href="/members/" + props.memberId + "/display/";
      setIsLoading(false);
    }).catch((error) => {
      console.log(error.response);
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }
  const handleReinstateClicked = () => {
    setErrors([]);
    setIsLoading(true);

    const payload = {
      id: props.memberId,
      reinstatement_date: dateReinstated,
      date_stop: dateStopped
    };

    const headers = {
      'X-KOINS-HQ-TOKEN': props.token
    };

    const options = {
      headers: headers
    };

    axios.post('/api/members/reinstate', payload, options)
      .then((res) => {
        console.log(res);
        alert("Successfully Reinstated");
        window.location.href = `/members/${props.memberId}/display/`;
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
        setErrors(error.response?.data?.errors || ["An error occurred while reinstating the member."]);
        setIsLoading(false);
      });
  }

  const handleResignedInsuranceClicked = () => {
    setIsLoading(true);

    const payload = {
      id: props.memberId,
      date_resigned: dateResignedInsurance,
      reason: reason
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': props.token
    }

    const options = {
      headers: headers
    }

    axios.post(
      '/api/members/resign',
      payload,
      options
    ).then((res) => {
      console.log(res);
      alert("Successfully Resigned");
      window.location.href="/members/" + props.memberId + "/display/";
      setIsLoading(false);
    }).catch((error) => {
      console.log(error.response);
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }

  const handleMakePaymentClicked = () => {
    setIsLoading(true);

    const payload = {
      id: props.memberId,
      type: selectedOptionType,
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': props.token
    }

    const options = {
      headers: headers
    }

    axios.post(
      '/api/members/form_make_payments',
      payload,
      options
    ).then((res) => {
      console.log(res);
      // alert("Payment");
      setModalMakePaymentOpen(false);
      window.location.href="/members/" + props.memberId + "/form_make_payments/" + selectedOptionType;
      setIsLoading(false);
    }).catch((error) => {
      console.log(error.response);
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }

  const handleCreateSurveyClicked = () => {
    setIsLoading(true);

    const payload = {
      id: props.memberId,
      survey_id: surveyId
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': props.token
    }

    const options = {
      headers: headers
    }

    axios.post(
      '/api/members/create_survey',
      payload,
      options
    ).then((res) => {
      console.log(res);
      alert("Successfully created survey!");
      window.location.href="/members/" + props.memberId + "/survey_answers/" + res.data.id + "/form";
    }).catch((error) => {
      console.log(error.response);
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }

  const handleConfirmClicked = () => {
    setIsLoading(true);

    const payload = {
      id: props.memberId
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': props.token
    }

    const options = {
      headers: headers
    }

    axios.post(
      '/api/members/unlock',
      payload,
      options
    ).then((res) => {
      window.location.href="/members/" + props.memberId + "/display/";
      setModifiable(!modifiable);
      setIsModalUnlockOpen(false);
      setIsLoading(false);
    }).catch((error) => {
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }

  const handleConfirmBalikKasapi = () => {
    setIsLoading(true);

    const payload = {
      id: props.memberId
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': props.token
    }

    const options = {
      headers: headers
    }

    axios.post(
      '/api/members/balik_kasapi',
      payload,
      options
    ).then((res) => {
      alert("Successfully change member status!");
      window.location.href="/members/" + props.memberId + "/display/";
      setModifiable(!modifiable);
      setIsModalUnlockOpen(false);
      setIsLoading(false);
    }).catch((error) => {
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }

  const handleConfirmDelete = () => {
    setIsLoading(true);

    const payload = {
    id: props.memberId
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': props.token
    }


    const options = {
    headers: headers
    }

    axios.post(
      '/api/members/delete',
      payload,
      options
    ).then((res) => { 
      alert("Successfully Delete");
      window.location.href="/members/";
      setIsModalDelete(false);
      setIsLoading(false);
      setIsLoading(false);
    }).catch((error) => {
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })

  }

  const handleMemberSubscription = () =>{
    const payload = {
      id: props.memberId
      }

      const headers = {
        'X-KOINS-HQ-TOKEN': props.token
      }

      const options = {
      headers: headers
      }

      axios.post(
        '/api/members/update_member_subscription',
        payload,
        options
      ).then((res) => { 
        setIsMemberSubscribed(res.data.is_subscribed)
      }).catch((error) => {
        setErrors(error.response.data.errors);
        setIsLoading(false);
      })
  }

  const getMobileNumberExist = (mobile_number) =>{
    setIsLoading(true);
    let mnumber_exist = false;
    // Fetch member_mobile_number_exist
    axios.get("/api/v1/members/mobile_number_exist",
    {
      params: {
        mobile_number: mobile_number,
        id: props.memberId
      }
    }).then((response) => { 
        var is_mobile_number_exist = response.data.mobile_number_exist;

        setIsMobileNumberExist(is_mobile_number_exist);
        
        mnumber_exist = is_mobile_number_exist;

    }).catch((error) => {
      console.log(error);
    })

    setIsLoading(false);
    return mnumber_exist;
  }

  const handleMobileNumberChange = (event) => { 
    let regex_numbers = /^[0-9]*$/
    let value = event.target.value
    if(regex_numbers.test(value)){
      if(value[0] == "9"){
        setMobileNumber(value);
        setIsMobileNumberExist(false);

        if(value.length == 10){

          let mobile_number = value;
          mobile_number = mobile_number.replace(/[&\/\\#,\-\_()$~%.'":*?<>{}]/g, ''); // Removes the numbers
    
          var regex_mobile_number = /((\+63)|0|63|)[.\- ]?9[0-9]{2}[.\- ]?[0-9]{3}[.\- ]?[0-9]{4}/
          if(regex_mobile_number.test(mobile_number)){
            // let mobileNumberExist = getMobileNumberExist(mobile_number); // check if mobile number is exist

            setIsMobileNumberValid(true);

            // setMobileNumber(mobile_number.slice(-10)); // GET ONLY THE LAST 10 VALUE example 9xxxxxxxx
          }
          else{
            setIsMobileNumberValid(false);
          }

        }
        else{
          setIsMobileNumberValid(false);
        }
      }
      else{
        setIsMobileNumberValid(false);
      }
    }
  }

  const handleMobileNumberClicked = () =>{
    setIsLoading(true);
    
    axios.post("/api/v1/members/update_mobile_number",
    { 
      mobile_number: mobileNumber,
      id: props.memberId
    }).then((response) => { 
        if(response.status == 200){
          if(!response.data.mobile_number_exist){
            setIsLoading(false);
            setSuccess(true);

            // alert("Successfully changed member mobile number!");
            window.location.href="/members/" + props.memberId + "/display/";
          }
          else{
            setIsMobileNumberExist(true);
            setIsLoading(false);
          }
          
        }

        
    }).catch((error) => {
      console.log(error);
      alert(error.message);
      setIsLoading(false);
    })
  }

  return (
    <>

      <Modal 
        show={isModalReinstateOpen}
      >
        <Modal.Header>
          <Modal.Title>Reinstate Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="form-group">
              <label>Reinstatement Date</label>
              <input
                className="form-control"
                value={dateReinstated}
                disabled={isLoading}
                type="date"
                onChange={(event) => setDateReinstated(event.target.value)}
              />
              <label>Date Stop</label>
              <input
                className="form-control"
                value={dateStopped}
                disabled={isLoading}
                type="date"
                onChange={(event) => setDateStopped(event.target.value)}
              />
            </div>
          </div>
          {errors.length > 0 && (
            <div className="alert alert-danger mt-3">
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={handleReinstateClicked}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button 
            variant="secondary"
            onClick={() => setModalReinstateOpen(false)}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={isModalReclassifiedOpen}
      >
        <Modal.Header>
          <Modal.Title>
            Reclassified Member
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="form-group">
              <label>
               Please select "YES" to ReClassified this Member
              </label>
              <select
                id="dropdown"
                className="form-control"
                value={reClassified}
                disabled={isLoading}
                onChange={(event) => { setreClassified(event.target.value) } }
              >
                <option value="">-- Select --</option>
                <option value="YES">YES</option>
              </select>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => {
              handleReclassfiedClicked();
            }}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button 
            variant="secondary"
            onClick={() => { 
              setModalReclassifiedOpen(false) 
            }}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>

      </Modal>


      <Modal
        show={isModalRecognitonDateOpen}
      >
        <Modal.Header>
          <Modal.Title>
            Members Recognition Date
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="form-group">
              <label>
               Change Recognition Date
              </label>
              <input
                className="form-control"
                value={dateRecognition}
                disabled={isLoading}
                type="date"
                onChange={(event) => { setDateRecognition(event.target.value) } }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => {
              handleDateRecognitionClicked();
            }}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button 
            variant="secondary"
            onClick={() => { 
              setModalRecognitonDateOpen(false) 
            }}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={isModalClaimsCopyPDFOpen}
      >
        <Modal.Header>
          <Modal.Title>
            Claim Copy PDF
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="form-group">
              <label>
                Date of Death
              </label>
              <input
                className="form-control"
                value={dateOfDeath}
                disabled={isLoading}
                type="date"
                onChange={(event) => { setDateOfDeath(event.target.value) } }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => {
              handleDateofDeath();
            }}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button 
            variant="secondary"
            onClick={() => { 
              setModalClaimsCopyPDFOpen(false) 
            }}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={isModalProfilePictureOpen}
      >
        <Modal.Header>
          <Modal.Title>
            Profile Picture
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="form-group">
              <label>
               Profile Picture
              </label>
              <input
                className="form-control"
                value={profilePicture}
                disabled={isLoading}
                type="fileInput"
              
                onChange={(event) => { setProfilePicture(event.target.value) } }

              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => {
              handleProfilePictureClicked();
            }}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button 
            variant="secondary"
            onClick={() => { 
              setModalProfilePictureOpen(false) 
            }}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>

      </Modal>

      <Modal show={isModalMobileNumberOpen} style={{top: "20%"}}>
        <Modal.Header>
          <Modal.Title>
            Change Mobile Number
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="form-group">
              <div style={{display: "flex", flexDirection: "row", gap: 10, alignItems: "center", fontSize: 20}}>
                <label>
                +63
                </label>
                <input
                  className="form-control"
                  value={mobileNumber}
                  disabled={isLoading}
                  type="text"
                  maxLength={10}
                  onChange={(event) => handleMobileNumberChange(event)}
                />
              </div>
              <div style={{display: "flex", flexDirection: "row", gap: 10, alignItems: "center", marginTop: 10}}>
                <label>
                  Status: 
                </label>
                {isLoading ? (<label style={{color: "#333333"}}>Loading...</label>):(
                  <>
                    {success ? (<label style={{color: "green"}}>Success</label>):(
                      <label style={{ color: isMobileNumberValid ? ( !isMobileNumberExist ? "green" : "red") : "red", fontWeight: "bold" }}>
                        {isMobileNumberValid ? (!isMobileNumberExist ? "Valid mobile number" : "This mobile number is already exist") : "Invalid mobile number"}
                      </label>
                    )}
                  </>                  
                )}
                
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => {
              handleMobileNumberClicked();
            }}
            onKeyDown={(event)=>{
              if (event.key === 'Enter') {
                handleMobileNumberClicked();
              }
            }}
            disabled={isLoading || (currentMobileNumber == mobileNumber) || !isMobileNumberValid || isMobileNumberExist || mobileNumber.length != 10}
          >
            Confirm
          </Button>
          <Button 
            variant="secondary"
            onClick={() => { 
              setModalMobileNumberOpen(false) 
            }}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>

      </Modal>

      <Modal
        show={isModalMakePaymentOpen}
      >
        <Modal.Header>
          <Modal.Title>
            Make Payment
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="form-group">
              <select className="form-control" 
                onChange={e => {setSelectedOptionType(e.target.value)
                  console.log("value: ", e.target.value);
                } }>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>              
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => {
              handleMakePaymentClicked();
            }}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button 
            variant="secondary"
            onClick={() => { 
              setModalMakePaymentOpen(false) 
            }}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={isModalSurveyOpen}
      >
        <Modal.Header>
          <Modal.Title>
            New Member Survey
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Select a Survey Type
          </p>
          <select
            value={surveyId}
            onChange={(event) => {
              setSurveyId(event.target.value);
            }}
            className="form-control"
          >
            {props.surveys.map((o) => {
                return (
                  <option value={o.id} key={`survey-${o.id}`}>
                    {o.name}
                  </option>
                )
              })
            }
          </select>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => {
              handleCreateSurveyClicked();
            }}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button 
            variant="secondary"
            onClick={() => { 
              setIsModalSurveyOpen(false) 
            }}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={isModalResignFromInsuranceOpen}
      >
        <Modal.Header>
          <Modal.Title>
            Resigned From Insurance
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="form-group">
              <label>
               Date Resigned
              </label>
              <input
                className="form-control"
                value={dateResignedInsurance}
                disabled={isLoading}
                type="date"
                onChange={(event) => { setDateResignedInsurance(event.target.value) } }
              />
              <label>
               Reason of resignation
              </label>
              <input
                className="form-control"
                value={reason}
                disabled={isLoading}
                type="text"
                onChange={(event) => { setReason(event.target.value) } }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => {
              handleResignedInsuranceClicked();
            }}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button 
            variant="secondary"
            onClick={() => { 
              setModalResignFromInsuranceOpen(false) 
            }}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={isModalUnlockOpen}
      >
        <Modal.Header>
          <Modal.Title>
            Unlock to Modify
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Are you sure you want to unlock this member?
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => { handleConfirmClicked() }}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button 
            variant="secondary"
            onClick={() => { setIsModalUnlockOpen(false) }}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal
        show={isModalBalikKasapiOpen}
      >
        <Modal.Header>
          <Modal.Title>
            Unlock to Modify
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Ibalik kasapi ang miyembro?
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => { handleConfirmBalikKasapi() }}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button 
            variant="secondary"
            onClick={() => { setModalBalikKasapiOpen(false) }}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row">
        <div className="col">
          <div className="note note-info">
            <strong>
              Profile Picture
            </strong>
            <p>
              Mag Upload ng Porfile Picture
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setModalProfilePictureOpen(true)
              }}
            >
              Upload Profile Picture
            </button>     
          </div>
        </div>
      </div>
      <hr/>

      <div className="row">
        <div className="col">
          <div className="note note-info">
            <strong>
              Member Survey
            </strong>
            <p>
              Gumawa ng bagong survey.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setIsModalSurveyOpen(true)
              }}
            >
              New Survey
            </button>
          </div>
        </div>
      </div>

      <hr/>

      {user_MIS_BK_Role && (
        <>
        <div className="row">
          <div className="col">
            <div className="note note-info">
              <strong>
                Member Subscriptions
              </strong>
              <p>
                Subscription status ng member.
              </p>
              <ToggleSwitch
                name={`member-subscription-id`}
                checked={isMemberSubscribed}
                onChange={handleMemberSubscription}
              />
            </div>
          </div>
        </div>
        <hr/>
        </>
      )}

      {user_MIS_FM_Role && (
        <>
        <div className="row">
          <div className="col">
            <div className="note note-info">
              <strong>
                Change Mobile Number
              </strong>
              <p>
                Palitan ang mobile number ni member.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setModalMobileNumberOpen(true)
                }}
              >
                Change Mobile Number
              </button>     
            </div>
          </div>
        </div>
        <hr/>
        </>
      )}
      

      <div className="row">
        <div className="col">
          <div className="note note-info">
            <strong>
              Modify
            </strong>
            <p>
              Palitan ang impormasyon ukol sa myembrong ito.
            </p>
            {(() => {
              if(props.member.modifiable) {
                return (
                  <button
                    className="btn btn-secondary"
                    onClick={() => { window.location.href=`/members/form?id=${props.memberId}` }}
                  >
                    Edit Record
                  </button>
                )
              } else {
                return (
                  <button
                    className="btn btn-warning"
                    onClick={() => { setIsModalUnlockOpen(true) }}
                  >
                    <span className="bi bi-padlock"/>
                    Unlock to Modify
                  </button>
                )
              }
            })()}
          </div>
        </div>
      </div>

      {(() => {
        if(props.member.modifiable){
          return (
            <div className="row">
              <div className="col">
                <div className="note note-info">
                  <strong>
                    Member Recognition Date
                  </strong>
                  <p>
                    Palitan ang impormasyon ukol sa myembrong ito.
                  </p>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setModalRecognitonDateOpen(true)
                    }}
                  >
                    Edit Recognition Date
                  </button>
                </div>
              </div>
            </div>
          )
        }
      })()}
      
      <hr/>
      <div className="row">
        <div className="col">
          <div className="note note-info">
            <strong>
              Modify
            </strong>
            <p>
              Palitan ang status ng miyember Resing/Balik kasapi.
            </p>
            {(() => {
              if(props.member.status == "active") {
                return (
                  <button
                    className="btn btn-secondary"
                    onClick={() => { window.location.href=`/members/${props.memberId}/form_resignation` }}
                  >
                    Resign Member
                  </button>
                )
              } else if(props.member.status == "resigned") {
                return (
                  <button
                    className="btn btn-warning"
                    onClick={() => { setModalBalikKasapiOpen(true) }}
                  >
                    <span className="bi bi-padlock"/>
                    Balik Kasapi
                  </button>
                )
              }
            })()}
          </div>
        </div>
      </div>

      <hr/>

      <div className="row">
        <div className="col">
          <div className="note note-info">
            <strong>
              Generate Blip Form
            </strong>
            <p>
              Generate BLIP FORM PDF
            </p>
            <button
              className="btn btn-primary"
              onClick={() => { window.location.href=`/members/${props.memberId}/blip_form_pdf` }}
            >
              Generate BLIP Form
            </button>     
          </div>
        </div>
      </div>
      <hr/>

      <div className="row">
        <div className="col">
          <div className="note note-info">
            <strong>
              Reinstatement
            </strong>
            <p>
              Reinstate member
            </p>
            {(() => {
              if(props.member.data["reinstatement"] == null ) {
                return (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setModalReinstateOpen(true)
                    }}
                  >
                    Reinstate
                  </button>
                )
              } else if(props.member.data["reinstatement"]["is_reinstated"] == true || props.member.status == "pending"){
                return (
                  <button
                    className="btn btn-secondary"
                    onClick={() => { setModalReinstateOpen(false) }}
                  >
                    <span className="bi bi-padlock"/>
                    Already Reinstated OR Pending Status
                  </button>
                )
              }            
            })()}
          </div>
        </div>
      </div>
 

      {(() => {
        if (customVariable == true) {
          <hr/>
          return(
            <div className="row">
              <div className="col">
                <div className="note note-info">
                  <strong>
                    Reclassified
                  </strong>
                  <p>
                    Reclassified Member
                  </p>
                    <button
                      className="btn btn-primary"
                        onClick={() => {
                          setModalReclassifiedOpen(true)
                        }}
                        >
                      Reclassified
                    </button>
                </div>
              </div>
            </div>
          )   
        }
      })()}

      <hr/>
      <div className="row">
        <div className="col">
          <div className="note note-info">
            <strong>
              Claims Copy PDF
            </strong>
            <p>
              Claims Copy PDF
            </p>
              <button
                className="btn btn-primary"
                  onClick={() => {
                    setModalClaimsCopyPDFOpen(true)
                  }}
                  >
                Claims Copy PDF
              </button>
          </div>
        </div>
      </div>
      <hr/>

      <div className="row">
        <div className="col">
          <div className="note note-info">
            <strong>
              Resigned From Insurance
            </strong>
            <p>
              Resigned From Insurance
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setModalResignFromInsuranceOpen(true)
              }}
            >
              Resigned From Insurance
            </button>     
          </div>
        </div>
      </div>
      <hr/>

      <div className="row">
        <div className="col">
          <div className="note note-info">
            <strong>
              Clip Make Payment
            </strong>
            {/* <p>
              Clip Make Payment
            </p> */}
            <br/>
            <br/>
            <button
              className="btn btn-primary"
              onClick={() => {
                setModalMakePaymentOpen(true)
              }}
            >
              Clip Make Payment
            </button>     
          </div>
        </div>
      </div>
      <hr/>

      <div className="row">
        <div className="col">
          <div className="note note-info">
            {(() => {
              if(props.member.status == "pending" && props.member.identification_number == null) {
                return (
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                setIsModalDelete(true)
              }}
                  >
                    Delete member
                  </button>
                )
              } else if(props.member.status == "active") {
                return (
                  <button
                    className="btn btn-secondary"
                    onClick={() => { setIsModalDelete(false) }}
                  >
                    <span className="bi bi-padlock"/>
                    Delete Member
                  </button>
                )
              }
            })()}
          </div>
        </div>
      </div>
      <Modal
        show={isModalDelete}
      >
        <Modal.Header>
          <Modal.Title>
            Delete Member
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Are you sure you want to delete this member?
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => { handleConfirmDelete() }}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button 
            variant="secondary"
            onClick={() => { setIsModalDelete(false) }}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
