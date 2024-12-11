import React from 'react';
import $ from 'jquery';

import SkCubeLoading from '../SkCubeLoading';
import {numberAsPercent, numberWithCommas} from '../utils/helpers';

import ManagementOverviewMii from './ManagementOverviewMii';

export default class DashboardManagementMii extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
    }
  }

  componentDidMount() {
    var context = this;
  }

  render() {
    return (
      <div>
        <ManagementOverviewMii
        />
      </div>
    );
  }
}
