import React from "react";

export default class ErrorDisplay extends React.Component {
  constructor(props) {
    super(props);
  }

  renderFullMessages() {
    var context       = this;
    var fullMessages  = this.props.errors.full_messages;

    var listItemMessages  = [];

    console.log(this.props);

    for(var i = 0; i < fullMessages.length; i++) {
      listItemMessages.push(
        <li key={"error-message-" + i}>
          {fullMessages[i]}
        </li>
      );
    }

    return listItemMessages;
  };

  render() {
    return  (
      <div className="error-display">
        <div className="alert alert-danger">
          <div className="row">
            <div className="col">
              <br/>
              <p>
                <strong>
                  The following errors occurred:
                </strong>
              </p>
              <ul>
                {this.renderFullMessages()}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
