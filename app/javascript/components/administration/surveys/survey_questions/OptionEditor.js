import React from 'react';

export default class OptionEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: this.props.index,
      option: this.props.option
    }
  }

  removeOption() {
    this.props.removeOption(this.state.index);
  }

  handleContentChanged(event) {
    var option      = this.state.option;
    var index       = this.state.index;

    option.content  = event.target.value;

    this.setState({
      option: option
    });

    this.props.updateOption(option, index);
  }

  handleScoreChanged(event) {
    var option      = this.state.option;
    option.score    = event.target.value;

    this.setState({
      option: option
    });
  }

  render() {
    var style = {
      marginBottom: "10px"
    };

    return  (
      <div style={style}>
        <div className="row">
          <div className="col-md-10">
            <div className="form-group">
              <label>
                Option {this.props.index + 1}
              </label>
              <input
                className="form-control"
                value={this.props.option.content}
                onChange={this.handleContentChanged.bind(this)}
                disabled={this.props.isSaving}
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <label>
                Score
              </label>
              <input
                className="form-control"
                type="number"
                value={this.props.option.score}
                onChange={this.handleScoreChanged.bind(this)}
                disabled={this.props.isSaving}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <button
              className="btn btn-danger btn-sm"
              onClick={this.removeOption.bind(this)}
            >
              <span className="bi bi-x"/>
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }
}
