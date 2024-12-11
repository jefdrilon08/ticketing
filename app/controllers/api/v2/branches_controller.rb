module Api
  module V2
    class BranchesController < ApiController
      before_action :authenticate_app_request!
      before_action :authenticate_core_user!

      def save_daily_branch_metric
        branch_id = params[:branch_id]
        as_of     = params[:as_of].try(:to_date)

        cmd = ::Branches::ValidateSaveDailyBranchMetric.new(
                branch_id: branch_id,
                as_of: as_of
              )

        cmd.execute!

        if cmd.errors[:full_messages].any?
          render json: cmd.errors, status: 400
        else
          @daily_branch_metric  = ReadOnlyDailyBranchMetric.where(
                                    branch_id: branch_id,
                                    as_of: as_of
                                  ).first

          if @daily_branch_metric.blank?
            branch  = ReadOnlyBranch.find(branch_id)
            cluster = branch.cluster
            area    = cluster.area

            @daily_branch_metric  = DailyBranchMetric.new(
                                      cluster:                    cluster,
                                      area:                       area,
                                      branch:                     branch, 
                                      as_of:                      as_of,
                                      principal:                  0.00,
                                      interest:                   0.00,
                                      total:                      0.00,
                                      principal_due:              0.00,
                                      interest_due:               0.00,
                                      total_due:                  0.00,
                                      principal_paid:             0.00,
                                      interest_paid:              0.00,
                                      principal_paid_due:         0.00,
                                      portfolio:                  0.00,
                                      interest_paid_due:          0.00,
                                      total_paid_due:             0.00,
                                      total_paid:                 0.00,
                                      principal_balance:          0.00,
                                      interest_balance:           0.00,
                                      total_balance:              0.00,
                                      overall_principal_balance:  0.00,
                                      overall_interest_balance:   0.00,
                                      overall_balance:            0.00,
                                      principal_rr:               0.0,
                                      interest_rr:                0.0,
                                      total_rr:                   0.0,
                                      par_amount:                 0.00,
                                      par:                        0.0,
                                      num_days_par:               0,
                                      status:                     "processing",
                                      data:                       {
                                                                    pure_savers: {
                                                                      male: 0, female: 0, others: 0, total: 0
                                                                    },
                                                                    loaners: {
                                                                      male: 0, female: 0, others: 0, total: 0
                                                                    },
                                                                    active_members: {
                                                                      male: 0, female: 0, others: 0, total: 0
                                                                    }
                                                                  }
                                    )

            @daily_branch_metric.save!
          end
          
          ProcessSaveDailyBranchMetric.perform_later({
            branch_id: branch_id,
            as_of: as_of
          })

          render json: { message: "ok" }
        end
      end
    end
  end
end
