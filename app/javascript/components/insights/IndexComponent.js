import React from "react";
import Controls from "./Controls";
import Portfolio from "./Portfolio";

export default class IndexComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      settings: props.settings,
      branches: props.branches,
      authenticityToken: props.authenticityToken,
      currentBranches: [],
      currentInterval: {
        value: "daily",
        label: "Daily"
      },
      startDate: props.startDate,
      endDate: props.endDate,
      isLoading: false,
      dataPortfolio: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
      ]
    }
  }

  handleBranchesChanged(selection) {
    this.setState({
      currentBranches: selection
    });
  }

  handleIntervalChanged(selection) {
    this.setState({
      currentInterval: selection
    });
  }

  handleStartDateChanged(o) {
    var d = o.target.value;

    this.setState({
      startDate: d
    });
  }

  handleEndDateChanged(o) {
    var d = o.target.value;

    this.setState({
      endDate: d
    });
  }

  render() {
    var context = this.state;

    var portfolio = <div/>;
    if(context.settings.portfolio) {
      portfolio = <Portfolio
                    isLoading={context.isLoading}
                    data={context.dataPortfolio}
                  />
    }

    return  <div>
              <Controls
                branches={this.state.branches}
                currentBranches={this.state.currentBranches}
                currentInterval={this.state.currentInterval}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                handleBranchesChanged={this.handleBranchesChanged.bind(this)}
                handleIntervalChanged={this.handleIntervalChanged.bind(this)}
                handleStartDateChanged={this.handleStartDateChanged.bind(this)}
                handleEndDateChanged={this.handleEndDateChanged.bind(this)}
              />
              {portfolio}
            </div>
  }
}
