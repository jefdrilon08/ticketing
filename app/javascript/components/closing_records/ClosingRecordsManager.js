import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import ErrorList from '../ErrorList';
import ClosingRecordsList from './ClosingRecordsList';
import ClosingRecordsControls from './ClosingRecordsControls';

export default function ClosingRecordsManager(props) {
  const [recordTypes] = useState([
    "TRIAL_BALANCE",
    "REPAYMENT_RATES",
    "GENERAL_LEDGER",
    "BALANCE_SHEET",
    "INCOME_STATEMENT",
    "SOA_FUNDS",
    "SOA_EXPENSES",
    "SOA_LOANS",
    "MANUAL_AGING",
    "PERSONAL_FUNDS",
    "MEMBER_COUNTS"
  ]);

  const [modalNewIsOpen, setModalNewIsOpen] = useState(false);
  const [isLoading, setIsLoading]           = useState(false);
  const [recordType, setRecordType]         = useState(recordTypes[0]);
  const [currentDate, setCurrentDate]       = useState("");
  const [errors, setErrors]                 = useState([]);
  const [branches]                          = useState(props.branches);
  const [branchId, setBranchId]             = useState(props.branches[0].id);
  const [token]                             = useState(props.token);
  const [records, setRecords]               = useState([]);
  const [closingRecords, setClosingRecords] = useState([]);
  const [dataStoreId, setDataStoreId]       = useState("");
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
  const [recordToRemove, setRecordToRemove] = useState(null);


  const handleRemoveRecord = (o) => {
    setRecordToRemove(o);
    setRemoveModalIsOpen(true);
  };

  const confirmRemoveRecord = () => {
    setIsLoading(true);

    const payload = {
	data_store_id: recordToRemove.data_store_id,
      	type: recordToRemove.type
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': token
    }

    const options = {
      headers: headers
    }

    axios.post(
      '/api/closing_records/remove',
      payload,
      options
    ).then((res) => {
	    //
      console.log(res);
      setIsLoading(false);
      setRemoveModalIsOpen(false);
      loadRecords(branchId, currentDate, recordType);
      loadClosingRecords(branchId, currentDate, recordType);
      setRecordToRemove(null);
    }).catch((error) => {
      console.log(error.response.data);
      setErrors(error.response.data.errors);
      setIsLoading(false);
    });
  };

  const handleCurrentDateChanged = (newCurrentDate) => {
    setIsLoading(true);
    setErrors([]);
    setCurrentDate(newCurrentDate);

    loadRecords(branchId, newCurrentDate, recordType);
    loadClosingRecords(branchId, newCurrentDate, recordType);
  }

  const branchName = () => {
    name = "";

    branches.forEach((o) => {
      if(o.id == branchId) {
        name = o.name;
      }
    });

    return name;
  }

  const loadClosingRecords = (_branchId, _currentDate, _recordType) => {
    const payload = {
      branch_id:    _branchId,
      closing_date: _currentDate,
      record_type:  _recordType
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': token
    }

    const options = {
      headers: headers,
      params: payload
    }

    axios.get(
      '/api/closing_records/',
      options
    ).then((res) => {
      console.log(res.data.records);
      setClosingRecords(res.data.records);
      setIsLoading(false);

      if(res.data.records.length > 0) {
        setDataStoreId(res.data.records[0].id)
      } else {
        setDataStoreId("")
      }
    }).catch((error) => {
      console.log(error.response.data);
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }

  const loadRecords = (_branchId, _currentDate, _recordType) => {
    const payload = {
      branch_id:    _branchId,
      closing_date: _currentDate,
      record_type:  _recordType
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': token
    }

    const options = {
      headers: headers,
      params: payload
    }

    axios.get(
      '/api/closing_records/records',
      options
    ).then((res) => {
      console.log(res.data.records);
      setRecords(res.data.records);
      setIsLoading(false);

      if(res.data.records.length > 0) {
        console.log(res.data.records[0].id);
        setDataStoreId(res.data.records[0].id)
      } else {
        setDataStoreId("")
      }
    }).catch((error) => {
      console.log(error.response.data);
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }

  const handleRegisterConfirm = () => {
    setIsLoading(true);
    setErrors([]);

    const payload = {
      branch_id:      branchId,
      closing_date:   currentDate,
      record_type:    recordType,
      data_store_id:  dataStoreId
    }

    const headers = {
      'X-KOINS-HQ-TOKEN': token
    }

    const options = {
      headers: headers
    }

    axios.post(
      '/api/closing_records',
      payload,
      options
    ).then((res) => {
      console.log(res);
      setIsLoading(false);
      setModalNewIsOpen(false);
      loadRecords(branchId, currentDate, recordType);
      loadClosingRecords(branchId, currentDate, recordType);
    }).catch((error) => {
      console.log(error.response.data);
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }

  const handleBranchChanged = (val) => {
    setBranchId(val);
    loadRecords(val, currentDate, recordType);
    loadClosingRecords(val, currentDate, recordType);
  }

  useEffect(() => {
    loadRecords(branchId, currentDate, recordType);
  }, [])
  
  return (
	  <>
 <Modal
        show={removeModalIsOpen}
        onHide={() => { setRemoveModalIsOpen(false) }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Confirm Removal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
		  Are you sure you want to remove this record ?<br/>
		  type: {recordToRemove?.type}?<br/>
		  ID: {recordToRemove?.data_store_id}    
	  </p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="danger"
            onClick={confirmRemoveRecord}
            disabled={props.isLoading}
          >
            Remove Record
          </Button>
          <Button
            variant="secondary"
            onClick={() => { setRemoveModalIsOpen(false) }}
            disabled={props.isLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={modalNewIsOpen}
        onHide={() => { setModalNewIsOpen(false) }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Register Closing Record
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>
                  Branch
                </label>
                <select 
                  className="form-control" 
                  value={branchId} 
                  onChange={(event) => { handleBranchChanged(event.target.value) } }
                  disabled={isLoading}
                >
                  {branches.map((o, i) => {
                    return (
                      <option key={"branch-" + o.id} value={o.id}>
                        {o.name + " (" + o.current_date + ")"}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>
                  Record Type
                </label>
                <select 
                  className="form-control" 
                  value={recordType} 
                  onChange={(event) => { setRecordType(event.target.value); loadRecords(branchId, currentDate, event.target.value); } }
                  disabled={isLoading}
                >
                  {recordTypes.map((o, i) => {
                    return (
                      <option key={"record-" + i} value={o}>
                        {o}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>
                  Closing Date
                </label>
                <input
                  className="form-control"
                  value={currentDate}
                  onChange={(event) => { handleCurrentDateChanged(event.target.value) }}
                  type="date"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>
                  Record
                </label>
                <select 
                  className="form-control" 
                  value={dataStoreId} 
                  onChange={(event) => { setDataStoreId(event.target.value) } }
                  disabled={isLoading}
                >
                  {records.map((o, i) => {
                    return (
                      <option key={"record-" + i} value={o.id}>
                        {o.label}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
          </div>
          <ErrorList errors={errors}/>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary"
            onClick={() => handleRegisterConfirm()}
            disabled={isLoading}
          >
            Register
          </Button>
          <Button
            variant="secondary"
            onClick={() => { setModalNewIsOpen(false) }}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <h2>
        Closing Records
      </h2>
      <Button 
        className="btn btn-primary"
        onClick={() => { setModalNewIsOpen(!modalNewIsOpen) }}
      >
        Register Closing Record
      </Button>
      <hr/>
      <h2>
        Records
      </h2>
      <ClosingRecordsList 
        closingRecords={closingRecords} 
	handleRemoveRecord={handleRemoveRecord}
        branches={branches}
        isLoading={isLoading}
        handleBranchChanged={handleBranchChanged}
        handleCurrentDateChanged={handleCurrentDateChanged}
        branchId={branchId}
      />
      <ClosingRecordsControls
        closingRecords={closingRecords}
        token={token}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        branchId={branchId}
        closingDate={currentDate}
        branchName={branchName()}
      />
    </>
  )
}
