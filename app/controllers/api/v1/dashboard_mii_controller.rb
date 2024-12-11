module Api
  module V1
    class DashboardMiiController < ApiController
      before_action :authenticate_user!

      def overview_mii
        as_of = params[:as_of].try(:to_date) || Date.today
        json = Dashboard::BuildOverviewMii.new(branches: @branches, as_of: as_of).execute!

        render json: json
      end

      
      def index
        branches_hash = @branches
          .includes(:centers)
          .map do |b|
            {
              id:      b.id,
              name:    b.name,
              centers: b.centers.map { |c| { id: c.id, name: c.name } },
            }
          end

        current_branch = if params[:branch_id].present?
                           @branches.find { |b| b.id == params[:branch_id] }
                         else
                           @branches.first
                         end

        # rr = DataStore
        #   .repayment_rates
        #   .where("meta->>'branch_id' = ? AND status = ?", current_branch.id, "done")
        #   .order("(meta->>'as_of')::date ASC")
        #   .last

        # if rr.present?
        #   branch_loans_stats = ::DataStores::BuildBranchLoanStatsFromRr.new(rr_data: rr.data.with_indifferent_access).execute!
        #   watchlist          = ::DataStores::BuildWatchlistFromRr.new(records: rr.data["records"], as_of: rr.data["as_of"]).execute!
        # end

        member_counts = DataStore
          .member_counts
          .where("meta->>'branch_id' = ? AND status = ?", current_branch.id, "done")
          .order(Arel.sql("(meta->>'as_of')::date ASC"))
          .last

        render json: {
          branches:            branches_hash,
          member_counts:       member_counts,
          # branch_loans_stats:  branch_loans_stats || false,
          # watchlist:           watchlist || false,
          centers:             ::Branches::FetchCenters.new(branch: current_branch).execute!,
          # cycle_count_summary: ::Branches::ComputeLoanCycleCountSummary.new(config: { branch: current_branch }).execute!,
        }
      end
    end
  end
end
