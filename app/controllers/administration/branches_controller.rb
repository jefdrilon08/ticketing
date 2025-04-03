module Administration
  class BranchesController < ApplicationController
    before_action :authenticate_user!
    before_action :authorize_access!, only: [:edit, :update, :new, :create]

    def index
      if current_user.is_mis?
        sql = "
          SELECT 
            branches.*, 
            count(centers.*) AS center_count
          FROM branches 
          INNER JOIN centers
          ON centers.branch_id = branches.id
          GROUP BY branches.id
          ORDER BY branches.name ASC
        "
        @branches = Branch.find_by_sql(sql)
      else
        ids = ReadOnlyUserBranch.where(active: true, user_id: current_user.id).pluck(:branch_id)

        if ids.empty?
          @branches = [] # Return an empty array if no branches are found
        else
          sql = "
            SELECT 
              branches.*, 
              count(centers.*) AS center_count
            FROM branches 
            INNER JOIN centers
            ON centers.branch_id = branches.id
            WHERE branches.id IN (#{ids.map { |id| "'#{id}'" }.join(',')})
            GROUP BY branches.id
            ORDER BY branches.name ASC
          "
          @branches = Branch.find_by_sql(sql)
        end
      end

      @subheader_items = [
        { text: "Administration" },
        { text: "Branches" }
      ]

      if helpers.is_mis_user?
        @subheader_side_actions = [
          {
            id: "btn-new",
            link: new_administration_branch_path,
            class: "fa fa-plus",
            text: "New Branch"
          }
        ]
      end
    end

    def new
      @branch = Branch.new

      @subheader_items = [
        { text: "Administration" },
        { is_link: true, path: administration_branches_path, text: "Branches" },
        { text: "New" }
      ]

      @subheader_side_actions = []
    end

    def create
      @branch = Branch.new(branch_params)

      respond_to do |format|
        if @branch.save
          format.html { redirect_to administration_branches_path, notice: "Branch was successfully created." }
          format.js   # Render create.js.erb for AJAX requests
        else
          @subheader_items = [
            { text: "Administration" },
            { is_link: true, path: administration_branches_path, text: "Branches" },
            { text: "New" }
          ]

          @subheader_side_actions = []

          format.html { render :new, status: :unprocessable_entity }
          format.js   # Render create.js.erb for AJAX requests with errors
        end
      end
    end

    def edit
      @branch = Branch.find(params[:id])

      @subheader_items = [
        { text: "Administration" },
        { is_link: true, path: administration_branches_path, text: "Branches" },
        { text: "Edit #{@branch.name}" }
      ]

      @subheader_side_actions = []
    end

    def update
      @branch = Branch.find(params[:id])

      if @branch.update(branch_params)
        redirect_to administration_branches_path, notice: "Branch was successfully updated."
      else
        @subheader_items = [
          { text: "Administration" },
          { is_link: true, path: administration_branches_path, text: "Branches" },
          { text: "Edit #{@branch.name}" }
        ]

        @subheader_side_actions = []

        render :edit, status: :unprocessable_entity
      end
    end

    def show
      @branch = ReadOnlyBranch.find(params[:id])

      cmd = ::Branches::BuildBranchHash.new(branch: @branch)
      cmd.execute!

      @payload = {
        id: @branch.id,
        data: cmd.data,
        token: current_user.generate_jwt
      }
    end

    def authorize_access!
      valid_roles = Settings.try(:module_authorization_roles).try(:administration) || []

      if current_user.current_roles.intersection(valid_roles).size == 0
        redirect_to root_path
      end
    end

    private

    def branch_params
      params.require(:branch).permit(:name, :description, :active)
    end
  end
end