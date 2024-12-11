import React from 'react';
import $ from 'jquery';
import moment from 'moment';

import SkCubeLoading from '../../../SkCubeLoading';
import ErrorDisplay from '../../../ErrorDisplay';
import {numberWithCommas} from '../../../utils/helpers';

import OptionEditor from './OptionEditor';

export default class SurveyUIComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      isSaving: false,
      surveyId: this.props.surveyId,
      data: false,
      errors: false
    };
  }

  componentDidMount() {
    this.fetchSurveyQuestionData();
  }

  fetchSurveyQuestionData() {
    var context = this;
    var state   = context.state;

    console.log(state);

    $.ajax({
      url: "/api/v1/administration/survey_questions/fetch",
      method: 'GET',
      data: {
        survey_id: this.props.surveyId,
        id: this.props.id
      },
      success: function(response) {
        console.log(response);
        context.setState({
          isLoading: false,
          data: response
        });
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching survey question");
      }
    });
  }

  save() {
    var context = this;
    var data    = context.state.data;

    this.setState({
      isSaving: true,
      errors: false
    });

    $.ajax({
      url: "/api/v1/administration/survey_questions/save",
      method: 'POST',
      data: {
        authenticity_token: context.props.authenticityToken,
        data: JSON.stringify(data),
        survey_id: context.props.surveyId,
        id: context.props.id
      },
      success: function(response) {
        window.location.href="/administration/surveys/" + context.props.surveyId;
      },
      error: function(response) {
        try {
          context.setState({
            errors: JSON.parse(response.responseText),
            isSaving: false
          });
        } catch(err) {
          alert("Something went wrong");
          context.setState({
            errors: false,
            isSaving: false
          });
        }
      }
    });
  }

  handleContentChanged(event) {
    var data      = this.state.data;
    data.content  = event.target.value;

    this.updateData(data);
  }

  handleQuestionTypeChanged(event) {
    var data            = this.state.data;
    data.question_type  = event.target.value;

    this.updateData(data);
  }

  handlePriorityChanged(event) {
    var data      = this.state.data;
    data.priority = event.target.value;

    this.updateData(data);
  }

  updateData(data) {
    this.setState({
      data: data
    });
  }

  handleAddOption() {
    var data  = this.state.data;

    data.data.options.push(
      {
        content: "",
        score: 0
      }
    )

    this.updateData(data);
  }

  removeOption(index) {
    var data  = this.state.data;

    data.data.options.splice(index, 1);

    this.updateData(data);
  }

  renderOptions() {
    var questionType  = this.state.data.question_type;

    if(questionType == "options") {
      var options         = this.state.data.data.options;
      var optionsDisplay  = [];

      for(var i = 0; i < options.length; i++) {
        optionsDisplay.push(
          <OptionEditor
            key={"option-" + i}
            index={i}
            option={options[i]}
            removeOption={this.removeOption.bind(this)}
            isSaving={this.state.isSaving}
          />
        );
      }

      return  (
        <div>
          <div className="row">
            <div className="col">
              <h4>
                Options ({options.length})
              </h4>
            </div>
            <div className="col">
              <div className="text-end">
                <div className="btn-group">
                  <a 
                    href="#" 
                    className="btn"
                    onClick={this.handleAddOption.bind(this)}
                  >
                    <span className="fa fa-plus"/>
                    Add Option
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {optionsDisplay}
            </div>
          </div>
        </div>
      );
    } else if(questionType == "free_text") {
      return  (
        <p>
          Free text for answers
        </p>
      );
    }
  }

  renderErrorDisplay() {
    if(this.state.errors) {
      return  (
        <ErrorDisplay
          errors={this.state.errors}
        />
      );
    }
  }

  render() {
    var data  = this.state.data;

    if(this.state.isLoading) {
      return (
        <div>
          <SkCubeLoading/>
        </div>
      );
    } else {
      var data  = this.state.data;
      return (
        <div>
          {this.renderErrorDisplay()}
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label>
                  Content
                </label>
                <input
                  className="form-control"
                  value={data.content}
                  onChange={this.handleContentChanged.bind(this)}
                  disabled={this.state.isSaving}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>
                  Type
                </label>
                <select
                  className="form-control"
                  value={data.question_type}
                  onChange={this.handleQuestionTypeChanged.bind(this)}
                  disabled={this.state.isSaving}
                >
                  <option value="options">Options</option>
                  <option value="free_text">Free Text</option>
                </select>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label>
                  Priority
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={data.priority}
                  onChange={this.handlePriorityChanged.bind(this)}
                  disabled={this.state.isSaving}
                />
              </div>
            </div>
          </div>
          <hr/>
          {this.renderOptions()}
          <hr/>
          <div className="row">
            <div className="col">
              <center>
                <div className="btn-group">
                  <button
                    className="btn btn-success"
                    disabled={this.props.isSaving}
                    onClick={this.save.bind(this)}
                  >
                    <span className="bi bi-check"/>
                    Save Question
                  </button>
                  <button
                    className="btn btn-danger"
                    disabled={this.props.isSaving}
                  >
                    <span className="bi bi-x"/>
                    Cancel
                  </button>
                </div>
              </center>
            </div>
          </div>
        </div>
      );
    }
  }
}
