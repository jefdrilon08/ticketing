module Api
  module V1
    class DashboardController < ApiController
      before_action :authenticate_user!

      def overview
        as_of = params[:as_of].try(:to_date) || Date.today
        json = Dashboard::BuildOverview.new(branches: @branches, as_of: as_of).execute!

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

        if current_branch.present?
          rr = ReadOnlyDataStore
            .repayment_rates
            .where("meta->>'branch_id' = ? AND status = ?", current_branch.id, "done")
            .order("updated_at ASC")
            .last
        end

        if rr.present?
          branch_loans_stats = ::DataStores::BuildBranchLoanStatsFromRr.new(rr_data: rr.data.with_indifferent_access).execute!
          watchlist          = ::DataStores::BuildWatchlistFromRr.new(records: rr.data["records"], as_of: rr.data["as_of"]).execute!
        end

        member_counts = ReadOnlyDataStore
          .member_counts
          .where("meta->>'branch_id' = ? AND status = ?", current_branch.id, "done")
          .order("updated_at ASC")
          .last

        render json: {
          branches:            branches_hash,
          member_counts:       member_counts,
          branch_loans_stats:  branch_loans_stats || false,
          watchlist:           watchlist || false,
          centers:             ::Branches::FetchCenters.new(branch: current_branch).execute!,
          cycle_count_summary: ::Branches::ComputeLoanCycleCountSummary.new(config: { branch: current_branch }).execute!,
        }
      end
    end
  end
end
