module Branches
  class SaveDailyBranchMetric
    def initialize(branch:, as_of:)
      @branch   = branch
      @cluster  = @branch.cluster
      @area     = @cluster.area
      @as_of    = as_of

      @daily_branch_metric  = DailyBranchMetric.where(
                                branch_id: @branch.id,
                                as_of: @as_of
                              ).first

      if @daily_branch_metric.blank?
        @daily_branch_metric  = DailyBranchMetric.new(
                                  cluster:                    @cluster,
                                  area:                       @area,
                                  branch:                     @branch, 
                                  as_of:                      @as_of,
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
                                  status:                     "processing"
                                )

        @data = {
          pure_savers: {
            male: 0, female: 0, others: 0, total: 0
          },
          loaners: {
            male: 0, female: 0, others: 0, total: 0
          },
          active_members: {
            male: 0, female: 0, others: 0, total: 0
          },
          inactive_members: {
            male: 0, female: 0, others: 0, total: 0
          }
        }
      else
        @data = @daily_branch_metric.data.with_indifferent_access
      end

      @daily_branch_metric.data = @data
    end

    def execute!
      data_stores = ReadOnlyDataStore
        .select("DISTINCT ON (meta->>'data_store_type', meta->>'branch_id') *")
        .where("meta->>'data_store_type' IN (?) AND meta->>'branch_id' = ? AND DATE(meta->>'as_of') <= ? AND status = ?", %w[REPAYMENT_RATES MEMBER_COUNTS], @branch.id, @as_of, "done")
        .order(Arel.sql("meta->>'data_store_type', meta->>'branch_id', DATE(meta->>'as_of') DESC, updated_at DESC"))
      
    

      rr = data_stores.find { |ds| ds.meta["branch_id"] == @branch.id && ds.meta["data_store_type"] == "REPAYMENT_RATES" }
      mc = data_stores.find { |ds| ds.meta["branch_id"] == @branch.id && ds.meta["data_store_type"] == "MEMBER_COUNTS" }

      if rr.present?
        build_rr!(rr)
      end

      if mc.present?

        build_mc!(mc)
      end

      @daily_branch_metric.status = "done"

      @daily_branch_metric.save!

      @daily_branch_metric
    end

    private

    def build_rr!(rr)
      # RESET TO 0.00
      @daily_branch_metric.principal                   = 0.00 
      @daily_branch_metric.interest                    = 0.00 
      @daily_branch_metric.total                       = 0.00 
      @daily_branch_metric.principal_due               = 0.00 
      @daily_branch_metric.interest_due                = 0.00 
      @daily_branch_metric.total_due                   = 0.00 
      @daily_branch_metric.principal_paid              = 0.00 
      @daily_branch_metric.interest_paid               = 0.00 
      @daily_branch_metric.portfolio                   = 0.00 
      @daily_branch_metric.principal_paid_due          = 0.00 
      @daily_branch_metric.interest_paid_due           = 0.00 
      @daily_branch_metric.total_paid_due              = 0.00 
      @daily_branch_metric.total_paid                  = 0.00 
      @daily_branch_metric.principal_balance           = 0.00 
      @daily_branch_metric.interest_balance            = 0.00 
      @daily_branch_metric.total_balance               = 0.00 
      @daily_branch_metric.overall_principal_balance   = 0.00 
      @daily_branch_metric.overall_interest_balance    = 0.00 
      @daily_branch_metric.overall_balance             = 0.00 
      @daily_branch_metric.par_amount                  = 0.00
      @daily_branch_metric.principal_rr                = 0.00

      rr.data["records"].each do |r|
        @daily_branch_metric.principal                  += r["principal"].to_f.round(2)
        @daily_branch_metric.interest                   += r["interest"].to_f.round(2)
        @daily_branch_metric.total                      += r["total"].to_f.round(2)
        @daily_branch_metric.principal_due              += r["principal_due"].to_f.round(2)
        @daily_branch_metric.interest_due               += r["interest_due"].to_f.round(2)
        @daily_branch_metric.total_due                  += r["total_due"].to_f.round(2)
        @daily_branch_metric.principal_paid             += r["principal_paid"].to_f.round(2)
        @daily_branch_metric.interest_paid              += r["interest_paid"].to_f.round(2)
        @daily_branch_metric.portfolio                  += (r["principal"].to_f - r["principal_paid"].to_f).round(2)
        @daily_branch_metric.principal_paid_due         += r["principal_paid_due"].to_f.round(2)
        @daily_branch_metric.interest_paid_due          += r["interest_paid_due"].to_f.round(2)
        @daily_branch_metric.total_paid_due             += r["total_paid_due"].to_f.round(2)
        @daily_branch_metric.total_paid                 += r["total_paid"].to_f.round(2)
        @daily_branch_metric.principal_balance          += r["principal_balance"].to_f.round(2)
        @daily_branch_metric.interest_balance           += r["interest_balance"].to_f.round(2)
        @daily_branch_metric.total_balance              += r["total_balance"].to_f.round(2)
        @daily_branch_metric.overall_principal_balance  += r["overall_principal_balance"].to_f.round(2)
        @daily_branch_metric.overall_interest_balance   += r["overall_interest_balance"].to_f.round(2)
        @daily_branch_metric.overall_balance            += (r["overall_principal_balance"].to_f + r["overall_interest_balance"]).to_f.round(2)

        # Par Amount. Add if num_days_par > 0
        if r["par"].to_f > 0
          @daily_branch_metric.par_amount += r["overall_principal_balance"].to_f.round(2)
        end
      end

      # Compute principal
      @daily_branch_metric.principal_rr = (@daily_branch_metric.principal_paid_due / @daily_branch_metric.principal_due).round(4)

      if @daily_branch_metric.principal_paid_due > 0
      else
        @daily_branch_metric.principal_rr = 0.00
      end

      if @daily_branch_metric.principal_rr > 1
        @daily_branch_metric.principal_rr = 1
      end

      if @daily_branch_metric.principal_rr >= 1 and @daily_branch_metric.principal_paid < @daily_branch_metric.principal_due
        @daily_branch_metric.principal_rr = 0.99
      end

      # Compute par
      @daily_branch_metric.par = (@daily_branch_metric.par_amount / @daily_branch_metric.portfolio).round(4)
    end

    def build_mc!(mc)
      
      counts = mc.data["counts"]
      
      
      @data = @daily_branch_metric.data.with_indifferent_access
      
      @daily_branch_metric.data["member_counts_as_of"] = @as_of

      @data[:pure_savers][:male]   = counts["pure_savers"]["male"]
      @data[:pure_savers][:female] = counts["pure_savers"]["female"]
      @data[:pure_savers][:others] = counts["pure_savers"]["others"]
      @data[:pure_savers][:total]  = counts["pure_savers"]["total"]

      @data[:loaners][:male]   = counts["loaners"]["male"]
      @data[:loaners][:female] = counts["loaners"]["female"]
      @data[:loaners][:others] = counts["loaners"]["others"]
      @data[:loaners][:total]  = counts["loaners"]["total"]

      @data[:active_members][:male]   = counts["active_members"]["male"]
      @data[:active_members][:female] = counts["active_members"]["female"]
      @data[:active_members][:others] = counts["active_members"]["others"]
      @data[:active_members][:total]  = counts["active_members"]["total"]

      
      if counts["inactive_members"].present?
        @data[:inactive_members][:male]   = counts["inactive_members"]["male"]
        @data[:inactive_members][:female] = counts["inactive_members"]["female"]
        @data[:inactive_members][:others] = counts["inactive_members"]["others"]
        @data[:inactive_members][:total]  = counts["inactive_members"]["total"]
      end



      @daily_branch_metric.data = @data
    end
  end
end
