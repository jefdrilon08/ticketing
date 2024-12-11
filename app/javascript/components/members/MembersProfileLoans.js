import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Select from 'react-select';
import ErrorList from '../ErrorList';

export default function MembersProfileLoans(props) {
  console.log(props.accruedInterest);
  const [memberId]                                          = useState(props.memberId);
  const [isLoading, setIsLoading]                           = useState(false);
  const [isModalRestructureOpen, setIsModalRestructureOpen] = useState(false);
  const [errors, setErrors]                                 = useState([]);
  const [loanProductId, setLoanProductId]                   = useState("");
  const [rActiveLoans, setRActiveLoans]                     = useState([]);
  const [activeLoans]                                       = useState(props.activeLoans || []);
  const [coMaker, setCoMaker]                               = useState("");
  const [coMakerMemberId, setCoMakerMemberId]               = useState("");
  const [pnNumber, setPnNumber]                             = useState("");
  const [clipNumber, setClipNumber]                         = useState("");
  const [coMakers]                                          = useState(props.coMakers || []);
  const [datePrepared, setDatePrepared]                     = useState("");
  const [term, setTerm]                                     = useState("weekly");
  const [numInstallments, setNumInstallments]               = useState(25);
  const [clipFirstName, setClipFirstName]                   = useState("");
  const [clipMiddleName, setClipMiddleName]                 = useState("");
  const [clipLastName, setClipLastName]                     = useState("");
  const [clipDateOfBirth, setClipDateOfBirth]               = useState("");
  const [clipRelationship, setClipRelationship]             = useState("");
  const [token]                                             = useState(props.token);
  const [accruedInterest]                                   = useState(props.accruedInterest || []);



  const handleConfirmClicked = () => {
    setIsLoading(true);
    setErrors([]);

    const payload = {
      co_maker:                   coMaker,
      co_maker_id:                coMakerMemberId,
      loan_product_id:            loanProductId,
      member_id:                  memberId,
      active_loan_ids:            rActiveLoans.map((o) => { return o.value }),
      pn_number:                  pnNumber,
      clip_number:                clipNumber,
      date_prepared:              datePrepared,
      num_installments:           numInstallments,
      term:                       term,
      beneficiary_first_name:     clipFirstName,
      beneficiary_middle_name:    clipMiddleName,
      beneficiary_last_name:      clipLastName,
      beneficiary_relationship:   clipRelationship,
      beneficiary_date_of_birth:  clipDateOfBirth,

    }


    const headers = {
      'X-KOINS-HQ-TOKEN': token
    }

    const options = {
      headers: headers
    }

    axios.post(
      '/api/loans/restructure',
      payload,
      options
    ).then((res) => {
      console.log(res);
  
      window.location.href = `/loans/${res.data.id}`;
    }).catch((error) => {
      console.log(error.response.data);
      setErrors(error.response.data.errors);
      setIsLoading(false);
    })
  }

  const termsMappings = {
    "weekly":       { label: "Weekly", options: [15, 25, 35, 50, 75] },
    "monthly":      { label: "Monthly", options: [3, 6, 9, 12] },
    "semiMonthly": { label: "Semi-monthly", options: [6, 12, 18, 24] }
  }

  const handleTermChanged = (val) => {
    if(val == "weekly") {
      setNumInstallments(termsMappings.weekly.options[0]);
    } else if(val == "monthly") {
      setNumInstallments(termsMappings.monthly.options[0]);
    } else if(val == "semi-monthly") {
      setNumInstallments(termsMappings.semiMonthly.options[0]);
    }

    setTerm(val);
  }

  useEffect(() => {
    if(props.loanProductsForRestructuring.length > 0) {
      setLoanProductId(props.loanProductsForRestructuring[0].id);
    }

    if(coMakers.length > 0) {
      setCoMakerMemberId(coMakers[0].id);
    }

    if(!datePrepared) {
      d = formatDate(new Date());
      setDatePrepared(d);
    }
  }, []);

  const formatDate = (d) => {
    let month = d.getMonth() + 1;

    if(month < 10) {
      month = `0${month}`;
    }

    let date  = d.getDate();

    if(date < 10) {
      date = `0${date}`;
    }

    let year  = d.getFullYear();

    return `${year}-${month}-${date}`;
  }

  const activeLoanOptions = activeLoans.map((o) => {
    return {
      value: o.id,
      label: o.loan_product
    }
  });

  return (
    <>
      <Modal
        show={isModalRestructureOpen}
        size={"lg"}
      >
        <Modal.Header>
          <Modal.Title>
            Restructure Loans
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>
                  Loan Product
                </label>
                <select 
                  value={loanProductId}
                  onChange={(event) => { setLoanProductId(event.target.value) }}
                  className="form-control"
                  disabled={isLoading}
                >
                  {props.loanProductsForRestructuring.map((o) => {
                    return (
                      <option key={`r-loan-product-${o.id}`} value={o.id}>
                        {o.name}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div className="form-group">
                <label>
                  Active Loans
                </label>
                <Select
                  options={activeLoanOptions}
                  isMulti={true}
                  value={rActiveLoans}
                  disabled={isLoading}
                  onChange={(val) => { setRActiveLoans(val) }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4"/>
          <h5>
            Co-maker Information
          </h5>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Pangalan ng Co-maker (Kamag-anak)
                </label>
                <input
                  value={coMaker}
                  onChange={(event) => { setCoMaker(event.target.value) }}
                  className="form-control"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  Pangalan ng Co-maker (Kasama sa sentro)
                </label>
                <select
                  value={coMakerMemberId}
                  onChange={(event) => { setCoMakerMemberId(event.target.value) }}
                  disabled={isLoading}
                  className="form-control"
                >
                  {coMakers.map((o) => {
                    return (
                      <option value={o.id} key={`co-maker-${o.id}`}>
                        {o.name}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  PN Number
                </label>
                <input
                  className="form-control"
                  value={pnNumber}
                  disabled={isLoading}
                  onChange={(event) => { setPnNumber(event.target.value) }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>
                  CLIP Number
                </label>
                <input
                  className="form-control"
                  value={clipNumber}
                  disabled={isLoading}
                  onChange={(event) => { setClipNumber(event.target.value) }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>
                  Date Prepared
                </label>
                <input
                  className="form-control"
                  value={datePrepared}
                  disabled={isLoading}
                  type="date"
                  onChange={(event) => { setDatePrepared(event.target.value) } }
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>
                  Term
                </label>
                <select
                  className="form-control"
                  value={numInstallments}
                  disabled={isLoading}
                  onChange={(event) => { setNumInstallments(event.target.value) } }
                >
                  {(() => {
                    if(term == "weekly") {
                      return (
                        termsMappings.weekly.options.map((o, i) => {
                          return (
                            <option key={`term-${i}`} value={o}>
                              {o}
                            </option>
                          )
                        })
                      )
                    } else if(term == "monthly") {
                      return (
                        termsMappings.monthly.options.map((o, i) => {
                          return (
                            <option key={`term-${i}`} value={o}>
                              {o}
                            </option>
                          )
                        })
                      )
                    } else if(term == "semi-monthly") {
                      return (
                        termsMappings.semiMonthly.options.map((o, i) => {
                          return (
                            <option key={`term-${i}`} value={o}>
                              {o}
                            </option>
                          )
                        })
                      )
                    }
                  })()}
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>
                  Mode of Payment
                </label>
                <select
                  className="form-control"
                  value={term}
                  disabled={isLoading}
                  onChange={(event) => { handleTermChanged(event.target.value) } }
                >
                  <option value="weekly">
                    Weekly
                  </option>
                  <option value="monthly">
                    Monthly
                  </option>
                  <option value="semi-monthly">
                    Semi-monthly
                  </option>
                </select>
              </div>
            </div>
          </div>
          <h4 className="mt-4">
            CLIP Beneficiary
          </h4>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>
                      First Name
                    </label>
                    <input
                      className="form-control"
                      value={clipFirstName}
                      disabled={isLoading}
                      onChange={(event) => { setClipFirstName(event.target.value) }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>
                      Middle Name
                    </label>
                    <input
                      className="form-control"
                      value={clipMiddleName}
                      disabled={isLoading}
                      onChange={(event) => { setClipMiddleName(event.target.value) }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>
                      Last Name
                    </label>
                    <input
                      className="form-control"
                      value={clipLastName}
                      disabled={isLoading}
                      onChange={(event) => { setClipLastName(event.target.value) }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Date of Birth
                    </label>
                    <input
                      className="form-control"
                      value={clipDateOfBirth}
                      disabled={isLoading}
                      type="date"
                      onChange={(event) => { setClipDateOfBirth(event.target.value) }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Relationship
                    </label>
                    <input
                      className="form-control"
                      value={clipRelationship}
                      disabled={isLoading}
                      onChange={(event) => { setClipRelationship(event.target.value) }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {(() => {
            if(errors.length > 0) {
              return (
                <ErrorList errors={errors} />
              )
            }
          })()}
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
            onClick={() => { setIsModalRestructureOpen(false) }}
            disabled={isLoading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <h6>
        Active Loans &nbsp;
        <small className="text-muted">
          Entry Point Loan Cycle Count: {props.entryPointLoanCycleCount}
        </small>
      </h6>
      {(() => {
        if(props.activeLoans.length > 0) {
          return (
            <table className="table table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th>
                    PN Number
                  </th>
                  <th>
                    Loan Product
                  </th>
                  <th className="text-center">
                    Cycle
                  </th>
                  <th className="text-end">
                    Total Due
                  </th>
                  <th className="text-end">
                    Total Paid
                  </th>
                  <th className="text-end">
                    Total Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.activeLoans.map((o) => {
                  return (
                    <tr key={"active-loan-" + o.id}>
                      <td>
                        <a href={`/loans/${o.id}`}>
                          <strong>
                            {o.pn_number}
                          </strong>
                        </a>
                      </td>
                      <td className="text-muted">
                        {o.loan_product}
                      </td>
                      <td className="text-center">
                        {o.cycle}
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_dues}
                        </strong>
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_paid}
                        </strong>
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_balance}
                        </strong>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        } else {
          return (
            <p>
              No loans found.
            </p>
          )
        }
      })()}
      <button
        className="btn btn-primary"
        disabled={isLoading}
        onClick={() => { setIsModalRestructureOpen(true) }}
      >
        Restructure
      </button>
      <hr/>
      <h6>
        Accrued Interest
      </h6>
       {(() => {
        if(props.accruedInterest && props.accruedInterest.length > 0) {
          return (
            <table className="table table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th>
                    PN Number
                  </th>
                  <th>
                    Loan Product
                  </th>
                  <th className="text-center">
                    Accrued Interest
                  </th>
                  <th className="text-end">
                    Total Paid
                  </th>
                  <th className="text-end">
                    Total Balance
                  </th>
                  <th className="text-end">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.accruedInterest.map((o) => {
                  return (
                    <tr key={"accrued-interest-data-" + o.id}>
                      <td>
                        <a href={`/loans/${o.id}`}>
                          <strong>
                            {o.pn_number}
                          </strong>
                        </a>
                      </td>
                      <td className="text-muted">
                        {o.loan_product}
                      </td>
                      <td className="text-center">
                        {o.total_accrued_interest}
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_accrued_interest_balance}
                        </strong>
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_balance_accrued_interest}
                        </strong>
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.status}
                        </strong>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        } else {
          return (
            <p>
              No Accrued Interest found.
            </p>
          )
        }
      })()}
          
      <hr/>
      <h6>
        For Verification &nbsp;
        <small className="text-muted">
          Online
        </small>
      </h6>
      {(() => {
        if(props.forVerificationLoans.length > 0) {
          return (
            <table className="table table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th>
                    PN Number
                  </th>
                  <th>
                    Loan Product
                  </th>
                  <th className="text-center">
                    Cycle
                  </th>
                  <th className="text-end">
                    Total Due
                  </th>
                  <th className="text-end">
                    Total Paid
                  </th>
                  <th className="text-end">
                    Total Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.forVerificationLoans.map((o) => {
                  return (
                    <tr key={"forVerification-loan-" + o.id}>
                      <td>
                        <a href={`/loans/${o.id}`}>
                          <strong>
                            {o.pn_number}
                          </strong>
                        </a>
                      </td>
                      <td className="text-muted">
                        {o.loan_product}
                      </td>
                      <td className="text-center">
                        {o.cycle}
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_dues}
                        </strong>
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_paid}
                        </strong>
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_balance}
                        </strong>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        } else {
          return (
            <p>
              No loans found.
            </p>
          )
        }
      })()}

      <hr/>
      <h6>
        Verified &nbsp;
        <small className="text-muted">
          Online
        </small>
      </h6>
      {(() => {
        if(props.verifiedLoans.length > 0) {
          return (
            <table className="table table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th>
                    PN Number
                  </th>
                  <th>
                    Loan Product
                  </th>
                  <th className="text-center">
                    Cycle
                  </th>
                  <th className="text-end">
                    Total Due
                  </th>
                  <th className="text-end">
                    Total Paid
                  </th>
                  <th className="text-end">
                    Total Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.verifiedLoans.map((o) => {
                  return (
                    <tr key={"verified-loan-" + o.id}>
                      <td>
                        <a href={`/loans/${o.id}`}>
                          <strong>
                            {o.pn_number}
                          </strong>
                        </a>
                      </td>
                      <td className="text-muted">
                        {o.loan_product}
                      </td>
                      <td className="text-center">
                        {o.cycle}
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_dues}
                        </strong>
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_paid}
                        </strong>
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_balance}
                        </strong>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        } else {
          return (
            <p>
              No loans found.
            </p>
          )
        }
      })()}

      <hr/>
      <h6>
        In Process &nbsp;
        <small className="text-muted">
          Online
        </small>
      </h6>
      {(() => {
        if(props.inProcessLoans.length > 0) {
          return (
            <table className="table table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th>
                    PN Number
                  </th>
                  <th>
                    Loan Product
                  </th>
                  <th className="text-center">
                    Cycle
                  </th>
                  <th className="text-end">
                    Total Due
                  </th>
                  <th className="text-end">
                    Total Paid
                  </th>
                  <th className="text-end">
                    Total Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.inProcessLoans.map((o) => {
                  return (
                    <tr key={"inProcess-loan-" + o.id}>
                      <td>
                        <a href={`/loans/${o.id}`}>
                          <strong>
                            {o.pn_number}
                          </strong>
                        </a>
                      </td>
                      <td className="text-muted">
                        {o.loan_product}
                      </td>
                      <td className="text-center">
                        {o.cycle}
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_dues}
                        </strong>
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_paid}
                        </strong>
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_balance}
                        </strong>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        } else {
          return (
            <p>
              No loans found.
            </p>
          )
        }
      })()}

      <hr/>
      <h6>
        Pending
      </h6>
      {(() => {
        if(props.pendingLoans.length > 0) {
          return (
            <table className="table table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th>
                    PN Number
                  </th>
                  <th>
                    Loan Product
                  </th>
                  <th className="text-center">
                    Cycle
                  </th>
                  <th className="text-end">
                    Total Due
                  </th>
                  <th className="text-end">
                    Total Paid
                  </th>
                  <th className="text-end">
                    Total Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.pendingLoans.map((o) => {
                  return (
                    <tr key={"pending-loan-" + o.id}>
                      <td>
                        <a href={`/loans/${o.id}`}>
                          <strong>
                            {o.pn_number}
                          </strong>
                        </a>
                      </td>
                      <td className="text-muted">
                        {o.loan_product}
                      </td>
                      <td className="text-center">
                        {o.cycle}
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_dues}
                        </strong>
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_paid}
                        </strong>
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_balance}
                        </strong>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        } else {
          return (
            <p>
              No loans found.
            </p>
          )
        }
      })()}

      <hr/>
      <h6>
        Written-off Loans
      </h6>
      {(() => {
        if(props.writeoffLoans.length > 0) {
          return (
            <table className="table table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th>
                    PN Number
                  </th>
                  <th>
                    Loan Product
                  </th>
                  <th className="text-center">
                    Cycle
                  </th>
                  <th className="text-end">
                    Total Paid
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.writeoffLoans.map((o) => {
                  return (
                    <tr key={"writeoff-loan-" + o.id}>
                      <td>
                        <a href={`/loans/${o.id}`}>
                          <strong>
                            {o.pn_number}
                          </strong>
                        </a>
                      </td>
                      <td className="text-muted">
                        {o.loan_product}
                      </td>
                      <td className="text-center">
                        {o.cycle}
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_paid}
                        </strong>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        } else {
          return (
            <p>
              No loans found.
            </p>
          )
        }
      })()}


      <hr/>
      <h6>
        Loans for Write-off
      </h6>
      {(() => {
        if(props.forwriteoffLoans.length > 0) {
          return (
            <table className="table table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th>
                    PN Number
                  </th>
                  <th>
                    Loan Product
                  </th>
                  <th className="text-center">
                    Cycle
                  </th>
                  <th className="text-end">
                    Total Paid
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.forwriteoffLoans.map((o) => {
                  return (
                    <tr key={"for-writeoff-loan-" + o.id}>
                      <td>
                        <a href={`/loans/${o.id}`}>
                          <strong>
                            {o.pn_number}
                          </strong>
                        </a>
                      </td>
                      <td className="text-muted">
                        {o.loan_product}
                      </td>
                      <td className="text-center">
                        {o.cycle}
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_paid}
                        </strong>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        } else {
          return (
            <p>
              No loans found.
            </p>
          )
        }
      })()}
      <h6>
        Paid Loans
      </h6>
      {(() => {
        if(props.paidLoans.length > 0) {
          return (
            <table className="table table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th>
                    PN Number
                  </th>
                  <th>
                    Loan Product
                  </th>
                  <th className="text-center">
                    Cycle
                  </th>
                  <th className="text-end">
                    Total Paid
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.paidLoans.map((o) => {
                  return (
                    <tr key={"paid-loan-" + o.id}>
                      <td>
                        <a href={`/loans/${o.id}`}>
                          <strong>
                            {o.pn_number}
                          </strong>
                        </a>
                      </td>
                      <td className="text-muted">
                        {o.loan_product}
                      </td>
                      <td className="text-center">
                        {o.cycle}
                      </td>
                      <td className="text-end">
                        <strong>
                          {o.total_paid}
                        </strong>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        } else {
          return (
            <p>
              No loans found.
            </p>
          )
        }
      })()}
    </>
  )
}
