module Api
  class DashboardController < Api::FrontController
    before_action :authenticate_user!

    def overview
      branches = ReadOnlyBranch.where(
        id: ReadOnlyUserBranch.where(
          active: true, 
          user_id: @user.id
        ).pluck(:branch_id)
      ).order("name ASC")

      as_of = params[:as_of].try(:to_date) || Date.today

      json = Dashboard::BuildOverview.new(
        branches: branches, 
        as_of:    as_of
      ).execute!

      render json: json
    end

    def branch_markers
      cmd = ::Dashboard::BuildBranchMarkers.new(
        user: @user
      )

      cmd.execute!

      render json: cmd.data
    end

    def disbursement
      branches = ReadOnlyBranch.where(
        id: ReadOnlyUserBranch.where(
          active: true, 
          user_id: @user.id
        ).pluck(:branch_id)
      ).order("name ASC")

      # puts "params[:as_of]: " + params[:as_of].inspect
      
      as_of = params[:as_of].try(:to_date) || Date.today

     

      json = Dashboard::BuildDisbursement.new(
        branches: branches,
        as_of:    as_of
      ).execute!

      render json: json
    end

  end
end
