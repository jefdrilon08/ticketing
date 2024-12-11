module Api
  module V2
    class DashboardController < ApiController
      before_action :authenticate_app_request!
      before_action :authenticate_core_user!

      def generate_accounting_report
        branch_id           = params[:branch_id]
        start_date          = params[:start_date].try(:to_date)
        end_date            = params[:end_date].try(:to_date)
        accounting_fund_id  = params[:accounting_fund_id]

        cmd = ::Dashboard::ValidateGenerateAccountingReport.new(
                config: {
                  branch_id: branch_id,
                  start_date: start_date,
                  end_date: end_date,
                  user: @core_user
                }
              )

        cmd.execute!

        if cmd.errors[:full_messages].any?
          render json: cmd.errors, status: 400
        else
          branch          = ReadOnlyBranch.find(branch_id)
          accounting_fund = ReadOnlyAccountingFund.find_by_id(params[:accounting_fund_id])

          ::Dashboard::GenerateAccountingReport.new(
            config: {
              branch: branch,
              start_date: start_date,
              end_date: end_date,
              accounting_fund: accounting_fund,
              user: @core_user
            }
          ).execute!

          render json: { message: "ok" }
        end
      end

      def generate_daily_report
        branch_id = params[:branch_id]
        as_of     = params[:as_of].try(:to_date)

        cmd = ::Dashboard::ValidateGenerateDailyReport.new(
                config: {
                  branch_id: branch_id,
                  as_of: as_of
                }
              )

        cmd.execute!

        if cmd.errors[:full_messages].any?
          render json: cmd.errors, status: 400
        else
          branch = ReadOnlyBranch.find(branch_id)

          ::Dashboard::GenerateDailyReport.new(
            config: {
              branch: branch,
              as_of: as_of
            }
          ).execute!

          render json: { message: "ok" }
        end
      end
    end
  end
end
