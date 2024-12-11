import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import ErrorList from '../ErrorList';
import MembersProfileHome from './MembersProfileHome';
import MembersProfileLoans from './MembersProfileLoans';
import MembersProfileSavings from './MembersProfileSavings';
import MembersProfileInsurance from './MembersProfileInsurance';
import MembersProfileEquities from './MembersProfileEquities';
import MembersProfileSurveyAnswers from './MembersProfileSurveyAnswers';
import MembersProfileShares from './MembersProfileShares';
import MembersProfileAttachmentFiles from './MembersProfileAttachmentFiles';
import MembersProfileMembershipPayments from './MembersProfileMembershipPayments';
import MembersProfileMyKoins from './MembersProfileMyKoins';
import MembersProfileActions from './MembersProfileActions';

export default function MembersProfile(props) {
  const [member]                        = useState(props.member);
  const [data]                          = useState(props.data);
  const [isResigned]                    = useState(props.is_resigned);
  const [isReinstated]                  = useState(props.reinstated);
  const [dateOfMembership]              = useState(props.date_of_membership);
  const [memberAge]                     = useState(props.member_age);
  const [dateOfBirth]                   = useState(props.date_of_birth);
  const [dateResigned]                  = useState(props.date_resigned);
  const [previousDateResigned]          = useState(props.previous_date_resigned);
  const [membershipType]                = useState(props.membership_type);
  const [membershipArrangement]         = useState(props.membership_arrangement);
  const [recognitionDate]               = useState(props.recognition_date);
  const [lengthOfStay]                  = useState(props.length_of_stay);
  const [branch]                        = useState(props.branch);
  const [center]                        = useState(props.center);
  const [profilePictureUrl]             = useState(props.profile_picture_url);
  const [memberData]                    = useState(props.member_data);
  const [activeLoans]                   = useState(props.active_loans);
  const [pendingLoans]                  = useState(props.pending_loans);
  const [forVerificationLoans]          = useState(props.for_verification_loans);
  const [paidLoans]                     = useState(props.paid_loans);
  const [verifiedLoans]                 = useState(props.verified_loans);
  const [inProcessLoans]                = useState(props.in_process_loans);
  const [writeoffLoans]                 = useState(props.writeoff_loans);
  const [forwriteoffLoans]              = useState(props.for_writeoff_loans);
  const [savingsAccounts]               = useState(props.savings_accounts);
  const [insuranceAccounts]             = useState(props.insurance_accounts);
  const [equityAccounts]                = useState(props.equity_accounts);
  const [memberShares]                  = useState(props.member_shares);
  const [membershipPayments]            = useState(props.membership_payments);
  const [surveys]                       = useState(props.surveys);
  const [surveyAnswers]                 = useState(props.survey_answers);
  const [loanBalance]                   = useState(props.loan_balance);
  const [loanCycles]                    = useState(props.loan_cycles);
  const [missingAccounts]               = useState(props.missing_accounts);
  const [token]                         = useState(props.token);
  const [address]                       = useState(props.address);
  const [legalDependents]               = useState(props.legal_dependents);
  const [beneficiaries]                 = useState(props.beneficiaries);
  const [resignationRecords]            = useState(props.resignation_records);
  const [entryPointLoanCycleCount]      = useState(props.entry_point_loan_cycle_count);
  const [totalSavings]                  = useState(props.total_savings);
  const [totalInsurance]                = useState(props.total_insurance);
  const [totalEquity]                   = useState(props.total_equity);
  const [roles]                         = useState(props.roles);
  const [attachmentFiles]               = useState(props.attachment_files);
  const [loanProductsForRestructuring]  = useState(props.loan_products_for_restructuring);
  const [coMakers]                      = useState(props.co_makers);
  const [projectType]                   = useState(props.project_type);
  const [accruedInterest]               = useState(props.accrued_interest_data);
  const [faceAmount]                    = useState(props.face_amount);
  const [fromMobileApp]                 = useState(props.from_mobile_app);

  const [configData, setConfigData] = useState();

  useEffect(() => {
    axios.get('/api/yml_values/production_values')
      .then(response => setConfigData(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col">
            <div className="card">
              <div className="rounded-top text-white d-flex flex-row" style={ { backgroundColor: "#000", height: "200px" } }>
                <div className="ms-4 d-flex flex-column" style={{ width: "150px" }}>
                  <img 
                    src={profilePictureUrl}
                    className="img-fluid img-thumbnail mt-4 mb-2"
                    style={{ width: "150px", zIndex: "1", objectFit: "cover", overflow: "hidden" }}
                  />
                </div>
                <div className="ms-4 mt-4">
                  <h3>
                    {member.last_name}, {member.first_name} {member.middle_name}
                  </h3>
                  <p>
                    {member.identification_number}
                  </p>
                  {(() => {
                    if(JSON.stringify(configData, null, 2) == 'true') {
                      if(fromMobileApp == "yes") {
                        return (
                          <button class="btn btn-primary">
                            Mobile App
                          </button>
                        )
                      }
                    }
                  })()}
                </div>
              </div>
            </div>
            <div className="card">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a href="#home" role="tab" data-bs-toggle="tab" aria-controls="profile" className="nav-link active show">
                    Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#loans" role="tab" data-bs-toggle="tab" aria-controls="loans" className="nav-link">
                    Loans
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#savings_accounts" role="tab" data-bs-toggle="tab" aria-controls="savings_accounts" className="nav-link">
                    Savings
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#insurance_accounts" role="tab" data-bs-toggle="tab" aria-controls="insurance_accounts" className="nav-link">
                    Insurance
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#equity_accounts" role="tab" data-bs-toggle="tab" aria-controls="equity_accounts" className="nav-link">
                    Equity
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#survey_answers" role="tab" data-bs-toggle="tab" aria-controls="survey_answers" className="nav-link">
                    Surveys
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#shares" role="tab" data-bs-toggle="tab" aria-controls="shares" className="nav-link">
                    Shares
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#attachments" role="tab" data-bs-toggle="tab" aria-controls="attachments" className="nav-link">
                    Attachment Files
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#membership_payments" role="tab" data-bs-toggle="tab" aria-controls="membership_payments" className="nav-link">
                    Membership Payments
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#mykoins" role="tab" data-bs-toggle="tab" aria-controls="mykoins" className="nav-link">
                    My KOINS
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#actions" role="tab" data-bs-toggle="tab" aria-controls="actions" className="nav-link">
                    Actions
                  </a>
                </li>
              </ul>
              
              <div className="tab-content border-start border-bottom border-end">
                <div id="home" className="home p-3 tab-pane active show" role="tabpanel">
                  <MembersProfileHome
                    member={member}
                    data={data}
                    branch={branch}
                    center={center}
                    isResigned={isResigned}
                    isReinstated={isReinstated}
                    dateOfMembership={dateOfMembership}
                    dateResigned={dateResigned}
                    previousDateResigned={previousDateResigned}
                    membershipType={membershipType}
                    membershipArrangement={membershipArrangement}
                    recognitionDate={recognitionDate}
                    lengthOfStay={lengthOfStay}
                    faceAmount={faceAmount}
                    memberAge={memberAge}
                    dateOfBirth={dateOfBirth}
                    address={address}
                    legalDependents={legalDependents}
                    beneficiaries={beneficiaries}
                    resignationRecords={resignationRecords}
                    projectType={projectType}
                  />
                </div>
                <div id="loans" className="home p-3 tab-pane" role="tabpanel">
                  <MembersProfileLoans
                    memberId={member.id}
                    token={token}
                    activeLoans={activeLoans}
                    pendingLoans={pendingLoans}
                    forVerificationLoans={forVerificationLoans}
                    verifiedLoans={verifiedLoans}
                    inProcessLoans={inProcessLoans}
                    writeoffLoans={writeoffLoans}
                    paidLoans={paidLoans}
                    entryPointLoanCycleCount={entryPointLoanCycleCount}
                    loanProductsForRestructuring={loanProductsForRestructuring}
                    coMakers={coMakers}
                    accruedInterest={accruedInterest}
                    forwriteoffLoans={forwriteoffLoans}
                  />
                </div>
                <div id="savings_accounts" className="home p-3 tab-pane" role="tabpanel">
                  <MembersProfileSavings
                    records={savingsAccounts || []}
                    total={totalSavings}
                  />
                </div>
                <div id="insurance_accounts" className="home p-3 tab-pane" role="tabpanel">
                  <MembersProfileInsurance
                    records={insuranceAccounts || []}
                    total={totalInsurance}
                  />
                </div>
                <div id="equity_accounts" className="home p-3 tab-pane" role="tabpanel">
                  <MembersProfileEquities
                    records={equityAccounts || []}
                    total={totalEquity}
                  />
                </div>
                <div id="survey_answers" className="home p-3 tab-pane" role="tabpanel">
                  <MembersProfileSurveyAnswers
                    records={surveyAnswers || []}
                    memberId={member.id}
                  />
                </div>
                <div id="shares" className="home p-3 tab-pane" role="tabpanel">
                  <MembersProfileShares
                    records={memberShares || []}
                    memberId={member.id}
                    roles={roles}
                  />
                </div>
                <div id="attachments" className="home p-3 tab-pane" role="tabpanel">
                  <MembersProfileAttachmentFiles
                    records={attachmentFiles || []}
                    memberId={member.id}
                    roles={roles}
                  />
                </div>
                <div id="membership_payments" className="home p-3 tab-pane" role="tabpanel">
                  <MembersProfileMembershipPayments
                    records={membershipPayments || []}
                    memberId={member.id}
                    roles={roles}
                  />
                </div>
                <div id="mykoins" className="home p-3 tab-pane" role="tabpanel">
                  <MembersProfileMyKoins
                    memberId={member.id}
                    token={token}
                  />
                </div>
                <div id="actions" className="home p-3 tab-pane" role="tabpanel">
                  <MembersProfileActions
                    member={member}
                    memberId={member.id}
                    surveys={surveys}
                    token={token}
                    roles={roles}
                    status={member.status}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
