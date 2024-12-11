import React from "react";

export default class ApplicationFormProjectType extends React.Component {
  constructor(props) {
    super(props);
    
    this.state  = {
    }
  }

  handleProjectTypeChanged(event) {
    var data  = this.props.data;

    data.project_type_id  = event.target.value;

    this.props.updateData(data);
  }

  handleProjectTypeCategoryChange(event) {


  }

  render() {
    var projectTypeCategoryOptions  = [];

    projectTypeCategoryOptions.push(
      <option key={"project-type-category-select"}>
        -- SELECT --
      </option>
    );

    var projectTypeOptions  = [];
    projectTypeOptions.push(
      <option key={"project-type-select"}>
        -- SELECT --
      </option>
    );

    for(var i = 0; i < this.props.projectTypeCategories.length; i++) {
      if(this.props.projectTypeCategories[i].id == this.props.currentProjectTypeCategoryId) {
        for(var j = 0; j < this.props.projectTypeCategories[i].project_types.length; j++) {
          projectTypeOptions.push(
            <option key={"project-type-option-" + this.props.projectTypeCategories[i].project_types[j].id} value={this.props.projectTypeCategories[i].project_types[j].id}>
              {this.props.projectTypeCategories[i].project_types[j].name}
            </option>
          );
        }
      }
      projectTypeCategoryOptions.push(
        <option
          key={"project-type-category-option-" + i}
          value={this.props.projectTypeCategories[i].id}
        >
          {this.props.projectTypeCategories[i].name}
        </option>
      );
    }

    return  (
      <div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>
                Project Type Category
              </label>
              <select
                onChange={this.props.handleProjectTypeCategoryChanged.bind(this)}
                className="form-control"
                value={this.props.currentProjectTypeCategoryId}
                disabled={this.props.disabled}
              >
                {projectTypeCategoryOptions}
              </select>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>
                Project Type
              </label>
              <select
                className="form-control"
                disabled={this.props.disabled}
                value={this.props.data.project_type_id}
                onChange={this.handleProjectTypeChanged.bind(this)}
              >
                {projectTypeOptions}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
