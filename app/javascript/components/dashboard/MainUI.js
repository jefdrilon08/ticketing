import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import SkCubeLoading from '../SkCubeLoading';

// DASHBOARDS
import DashboardOAS from './DashboardOAS';
import DashboardMII from './DashboardMII';
import DashboardManagementMii from './DashboardManagementMii';

import ManagementOverview from './ManagementOverview';
import Disbursement from './Disbursement';

export default function MainUI(props) {
  const [token]                                 = useState(props.token);
  const [isError, setIsError]                   = useState(false);
  const [isLoading, setIsLoading]               = useState(true);
  const [roles, setRoles]                       = useState(props.roles);
  const [username, setUsername]                 = useState(props.username);
  const [isMicroinsurance, setIsMicroinsurance] = useState(props.is_microinsurance);

  if(isMicroinsurance) {
    return (
      <>
        <DashboardManagementMii/>
        <DashboardMII/>
      </>
    )
  } else {
    return (
      <>
        {/* <div class="row">
          <div class="col-4">
            <h2>System Tickets</h2>
          </div>
          <div class="col-4">
            <h2>Concern Tickets</h2>
          </div>
          <div class="col-4">
              fgfdhcvbdf          
          </div>
        </div> */}
      </>
    )
  }
}
