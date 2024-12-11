import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ErrorList from '../ErrorList';
import axios from 'axios';

export default function ClosingRecordsControls(props) {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors]           = useState([]);
  const [token]                       = useState(props.token);
      
  const isComplete = () => {
    numComplete = 0;

    if(props.closingRecords.length > 0) {
      props.closingRecords.forEach((o) => {
        if(o.status == "done") {
          numComplete += 1;
        }
      });

      return numComplete == props.closingRecords.length;
    } else {
      return false;
    }
  }

  const handleConfirmation = () => {
    props.setIsLoading(true);

    setErrors([]);

    const payload = {
      branch_id:      props.branchId,
      closing_date:   props.closingDate
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': token
    }

    const options = {
      headers: headers
    }

    axios.post(
      '/api/branches/close',
      payload,
      options
    ).then((res) => {
      console.log(res);
      alert("Successfully closed branch!");
      props.setIsLoading(false);
      setModalIsOpen(false);
    }).catch((error) => {
      console.log(error.response.data);
      setErrors(error.response.data.errors);
      props.setIsLoading(false);
    })
  }

  return (
    <>
      <Modal
        show={modalIsOpen}
        onHide={() => { setModalIsOpen(false) }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Confirm Closing
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to close {props.branchName}?
          </p>
          <ErrorList errors={errors}/>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => handleConfirmation()}
            disabled={props.isLoading}
          >
            Confirm
          </Button>
          <Button
            variant="secondary"
            onClick={() => { setModalIsOpen(false) }}
            disabled={props.isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {(() => {
        if(isComplete()) {
          return (
            <div className="card">
              <div className="card-body">
                <h4>
                  Close Branch
                </h4>
                <button 
                  className="btn btn-primary"
                  onClick={() => { setModalIsOpen(true) }}
                >
                  Close {props.branchName}
                </button>
              </div>
            </div>
          )
        }
      })()}
    </>
  )
}
