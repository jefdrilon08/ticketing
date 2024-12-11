import React from 'react';
import $ from 'jquery';
import moment from 'moment';

import SkCubeLoading from '../SkCubeLoading';
import ErrorDisplay from '../ErrorDisplay';

export default class SurveyAnswerUIDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      isSaving: false,
      id: this.props.id,
      data: false,
      errors: false
    };
  }

  componentDidMount() {
    this.fetchSurveyAnswerData();
  }

  fetchSurveyAnswerData() {
    var context = this;
    var state   = context.state;

    console.log(state);

    $.ajax({
      url: "/api/v1/members/fetch_survey_answer",
      method: 'GET',
      data: {
        survey_answer_id: state.id
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
        alert("Error in fetching survey answer");
      }
    });
  }

  save() {
    var context = this;
    var state   = context.state;
    var data    = context.state.data;

    this.setState({
      isSaving: true,
      errors: false
    });

    $.ajax({
      url: "/api/v1/members/save_survey_answer",
      method: 'POST',
      data: {
        authenticity_token: context.props.authenticityToken,
        data: JSON.stringify(data),
        id: context.props.id
      },
      success: function(response) {
        window.location.href="/members/" + context.props.memberId + "/survey_answers/" + state.id;
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

  updateData(data) {
    this.setState({
      data: data
    });
  }

  handleSave() {
    this.save();
  }

  handleCancel() {
    window.location.href="/members/" + this.props.memberId + "/survey_answers/" + this.state.id;
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

  handleOptionSelected(question, option) {
    console.log(question);
    console.log(option);

    var data    = this.state.data;

    for(var i = 0; i < data.data.answers.length; i++) {
      if(data.data.answers[i].survey_question.id == question.id) {
        data.data.answers[i].answer = option.content;
        data.data.answers[i].score  = option.score;
      }
    }

    this.updateData(data);
  }

  renderQuestions() {
    var data  = this.state.data;

    var questionDisplay = [];

    for(var i = 0; i < data.data.answers.length; i++) {
      var o               = data.data.answers[i];
      var question        = o.survey_question;
      var options         = o.survey_question.data.options;
      var optionsDisplay  = [];
      console.log(o);

      for(var j = 0; j < options.length; j++) {
        optionsDisplay.push(
          <div key={"answer-" + i + "-" + j}>
            <input
              type="radio"
              name={"question-" + question.id + "-options"}
              value={options[j].content}
              onChange={this.handleOptionSelected.bind(this, question, options[j])}
              checked={o.answer == options[j].content}
            />
            {options[j].content}
          </div>
        );
      }

      questionDisplay.push(
        <div key={"answer-" + i}>
          <h4>
            {o.survey_question.content}
          </h4>
          {optionsDisplay}
        </div>
      );
    }

    return  (
      <div>
        {questionDisplay}
      </div>
    );
  }

  render() {
    var data  = this.state.data;
    console.log(data);

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
            <div className="col">
              <h3>
                {data.meta.survey.name}
              </h3>
              <hr/>
              {this.renderQuestions()}
              <hr/>
              <div className="btn-group">
                <button
                  className="btn btn-success"
                  disabled={this.state.isSaving}
                  onClick={this.handleSave.bind(this)}
                >
                  <span className="bi bi-check"/>
                  Save
                </button>
                <button
                  className="btn btn-danger"
                  disabled={this.state.isSaving}
                  onClick={this.handleCancel.bind(this)}
                >
                  <span className="bi bi-x"/>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
