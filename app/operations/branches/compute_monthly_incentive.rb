module Branches
  class ComputeMonthlyIncentive
    def initialize(config:)
      @config = config
      @year   = @config[:year] || Date.today.year
      @month  = @config[:month] || Date.today.month
      @branch = @config[:branch]
      @as_of  = Date.new(@year, @month, -1)

      prev_month  = @as_of - 1.month

      @previous_as_of = Date.new(prev_month.year, prev_month.month, -1)
      @previous_year  = @previous_as_of.year
      @previous_month = @previous_as_of.month
      @previous_day   = @previous_as_of.day

      @ds_repayment_rate  = DataStore.repayment_rates.where(
                              "meta->>'branch_id' = ? AND CAST(meta->>'as_of' AS DATE) <= ?",
                              @branch.id,
                              @as_of
                            ).order(
                              "CAST(meta->>'as_of' AS DATE) ASC"
                            ).last

      @ds_monthly_new_and_resigned  = DataStore.monthly_new_and_resigned.where(
                                        "meta->>'branch_id' = ? AND CAST(meta->>'as_of' AS DATE) <= ?",
                                        @branch.id,
                                        @as_of
                                      ).order(
                                        "CAST(meta->>'as_of' AS DATE) ASC"
                                      ).last

      @ds_member_counts = DataStore.member_counts.where(
                            "data->'branch'->>'id' = ? AND CAST(data->>'as_of' AS DATE) <= ?",
                            @branch.id,
                            @as_of
                          ).order(
                            "CAST(data->>'as_of' AS DATE) ASC"
                          ).last

      @prev_ds_monthly_new_and_resigned = DataStore.monthly_new_and_resigned.where(
                                            "meta->>'branch_id' = ? AND CAST(meta->>'as_of' AS DATE) <= ?",
                                            @branch.id,
                                            @previous_as_of
                                          ).order(
                                            "CAST(meta->>'as_of' AS DATE) ASC"
                                          ).last

      @prev_ds_member_counts  = DataStore.member_counts.where(
                                  "data->'branch'->>'id' = ? AND CAST(data->>'as_of' AS DATE) <= ?",
                                  @branch.id,
                                  @previous_as_of
                                ).order(
                                  "CAST(data->>'as_of' AS DATE) ASC"
                                ).last

      # Check if we have the necessary information
      if @ds_repayment_rate.blank? || @ds_repayment_rate.meta.with_indifferent_access[:as_of].try(:to_date).year.to_i != @year.to_i || @ds_repayment_rate.meta.with_indifferent_access[:as_of].try(:to_date).month.to_i != @month.to_i
        raise "no repayment rate report found. as_of: #{@as_of}"
      end

      if @ds_monthly_new_and_resigned.blank? || @ds_monthly_new_and_resigned.meta.with_indifferent_access[:as_of].try(:to_date).year.to_i != @year.to_i || @ds_monthly_new_and_resigned.meta.with_indifferent_access[:as_of].try(:to_date).month.to_i != @month.to_i
        raise "no monthly new and resigned found. as_of: #{@as_of}"
      end

      if @ds_member_counts.blank? || @ds_member_counts.data.with_indifferent_access[:as_of].try(:to_date).year.to_i != @year.to_i || @ds_member_counts.data.with_indifferent_access[:as_of].try(:to_date).month.to_i != @month.to_i
        raise "no member counts found. as_of: #{@as_of}"
      end

      if @prev_ds_monthly_new_and_resigned.blank? || @prev_ds_monthly_new_and_resigned.meta.with_indifferent_access[:as_of].try(:to_date).year.to_i != @previous_year.to_i || @prev_ds_monthly_new_and_resigned.meta.with_indifferent_access[:as_of].try(:to_date).month.to_i != @previous_month.to_i
        raise "no preivous monthly new and resigned found. as_of: #{@as_of}"
      end

      if @prev_ds_member_counts.blank? || @prev_ds_member_counts.data.with_indifferent_access[:as_of].try(:to_date).year.to_i != @previous_year.to_i || @prev_ds_member_counts.data.with_indifferent_access[:as_of].try(:to_date).month.to_i != @previous_month.to_i
        raise "no previous member counts found. as_of: #{@as_of}"
      end

      @data_rr  = @ds_repayment_rate.data.with_indifferent_access
      @officers = @data_rr[:records].map{ |o| o[:officer] }.uniq

      @data_monthly_new_and_resigned          = @ds_monthly_new_and_resigned.data.with_indifferent_access
      @previous_data_monthly_new_and_resigned = @prev_ds_monthly_new_and_resigned.data.with_indifferent_access

      @data_member_counts           = @ds_member_counts.data.with_indifferent_access
      @previous_data_member_counts  = @prev_ds_member_counts.data.with_indifferent_access

      @data = {
        year: @year,
        month: @month,
        as_of: @as_of,
        officers: @officers,
        branch: {
          id: @branch.id,
          name: @branch.name
        },
        records: []
      }
    end

    def execute!
      @officers.each do |officer|
        officer_data  = {
          officer: officer,
          resigned_members: [],
          new_members: [],
          loaners: [],
          pure_savers: [],
          active_members: [],
          loan_disbursements: [],
          amount_disbursed: 0.00,
          count_resigned_members: 0,
          count_new_members: 0,
          count_loaners: 0,
          count_pure_savers: 0,
          count_active_members: 0,
          count_loan_disbursements: 0,
          loans: [],
          principal: 0.00,
          interest: 0.00,
          total: 0.00,
          principal_due: 0.00,
          interest_due: 0.00,
          total_due: 0.00,
          principal_paid: 0.00,
          interest_paid: 0.00,
          principal_paid_due: 0.00,
          interest_paid_due: 0.00,
          total_paid_due: 0.00,
          total_paid: 0.00,
          principal_balance: 0.00,
          interest_balance: 0.00,
          total_balance: 0.00,
          overall_principal_balance: 0.00,
          overall_interest_balance: 0.00,
          overall_balance: 0.00,
          principal_rr: 0.00,
          interest_rr: 0.00,
          total_rr: 0.00,
          par: 0.00,
          par_amount: 0.00,
          principal_past_due: 0.00,
          interest_past_due: 0.00,
          total_past_due: 0.00,
          principal_portfolio: 0.00,
          interest_portfolio: 0.00,
          total_portfolio: 0.00
        }

        officer_data[:resigned_members] = @data_monthly_new_and_resigned[:resigned_members].select{ |m|
                                            m[:officer][:id] == officer[:id]
                                          }

        officer_data[:previous_resigned_members]  = @previous_data_monthly_new_and_resigned[:resigned_members].select{ |m|
                                                      m[:officer][:id] == officer[:id]
                                                    }

        officer_data[:count_resigned_members]           = officer_data[:resigned_members].size
        officer_data[:previous_count_resigned_members]  = officer_data[:previous_resigned_members].size

        officer_data[:new_members]  = @data_monthly_new_and_resigned[:new_members].select{ |m|
                                        m[:officer][:id] == officer[:id]
                                      }

        officer_data[:previous_new_members] = @previous_data_monthly_new_and_resigned[:new_members].select{ |m|
                                                m[:officer][:id] == officer[:id]
                                              }

        officer_data[:count_new_members]          = officer_data[:new_members].size
        officer_data[:previous_count_new_members] = officer_data[:previous_new_members].size

        # Loan disbursements
        officer_data[:loan_disbursements]       = compute_loan_disbursements!(officer)
        officer_data[:count_loan_disbursements] = officer_data[:loan_disbursements].size
        officer_data[:amount_disbursed]         = Loan.where(
                                                    id: officer_data[:loan_disbursements].map{ |o| o[:id] }
                                                  ).sum(:principal)

        # Active loans
        officer_data[:loaners]       = compute_loaners!(officer)
        officer_data[:count_loaners] = officer_data[:loaners].size

        officer_data[:previous_loaners]       = compute_previous_loaners!(officer)
        officer_data[:previous_count_loaners] = officer_data[:previous_loaners].size

        # Pure savers
        officer_data[:pure_savers]        = compute_pure_savers!(officer)
        officer_data[:count_pure_savers]  = officer_data[:pure_savers].size

        officer_data[:previous_pure_savers]       = compute_previous_pure_savers!(officer)
        officer_data[:previous_count_pure_savers] = officer_data[:previous_pure_savers].size

        # Active members
        officer_data[:active_members]        = compute_active_members!(officer)
        officer_data[:count_active_members]  = officer_data[:active_members].size

        officer_data[:previous_active_members]        = compute_previous_active_members!(officer)
        officer_data[:previous_count_active_members]  = officer_data[:previous_active_members].size

        # Previous count
        officer_data[:previous_member_count]  = officer_data[:previous_count_loaners] + officer_data[:previous_count_pure_savers] + officer_data[:previous_count_active_members]

        # Loans (from repayment rates)
        officer_data[:loans]  = compute_loans!(officer)

        # Compute loan particulars
        officer_data[:loans].each do |o|
          officer_data[:principal]                  += o[:principal].to_f.round(2)
          officer_data[:interest]                   += o[:interest].to_f.round(2)
          officer_data[:total]                      += o[:total].to_f.round(2)
          officer_data[:principal_due]              += o[:principal_due].to_f.round(2)
          officer_data[:interest_due]               += o[:interest_due].to_f.round(2)
          officer_data[:total_due]                  += o[:total_due].to_f.round(2)
          officer_data[:principal_paid]             += o[:principal_paid].to_f.round(2)
          officer_data[:interest_paid]              += o[:interest_paid].to_f.round(2)
          officer_data[:principal_paid_due]         += o[:principal_paid_due].to_f.round(2)
          officer_data[:interest_paid_due]          += o[:interest_paid_due].to_f.round(2)
          officer_data[:total_paid_due]             += o[:total_paid_due].to_f.round(2)
          officer_data[:total_paid]                 += o[:total_paid].to_f.round(2)
          officer_data[:principal_balance]          += o[:principal_balance].to_f.round(2)
          officer_data[:interest_balance]           += o[:interest_balance].to_f.round(2)
          officer_data[:total_balance]              += o[:total_balance].to_f.round(2)
          officer_data[:overall_principal_balance]  += o[:overall_principal_balance].to_f.round(2)
          officer_data[:overall_interest_balance]   += o[:overall_interest_balance].to_f.round(2)
          officer_data[:overall_balance]            += o[:overall_balance].to_f.round(2)
        end

        # RR = Paid Due - Balance / Paid Due
        officer_data[:principal_rr] = ((officer_data[:principal_paid_due] - officer_data[:principal_balance]) / officer_data[:principal_paid_due])
        officer_data[:interest_rr]  = ((officer_data[:interest_paid_due] - officer_data[:interest_balance]) / officer_data[:interest_paid_due])
        officer_data[:total_rr]     = ((officer_data[:total_paid_due] - officer_data[:total_balance]) / officer_data[:total_paid_due])

        # Adjust to 1 if over 100%
        if officer_data[:principal_rr] > 1
          officer_data[:principal_rr] = 1
        end

        if officer_data[:interest_rr] > 1
          officer_data[:interest_rr] = 1
        end

        if officer_data[:total_rr] > 1
          officer_data[:total_rr] = 1
        end

        # Par amount:  overall_*_balance
        officer_data[:par_amount] = officer_data[:principal_balance]
        
        # Past due amount: *_balance
        officer_data[:principal_past_due] = officer_data[:principal_balance]
        officer_data[:interest_past_due]  = officer_data[:interest_balance]
        officer_data[:total_past_due]     = (officer_data[:principal_past_due] + officer_data[:interest_past_due]).round(2)

        # Par rate
        officer_data[:par]  = officer_data[:principal_balance] / officer_data[:principal]

        # Portfolio
        officer_data[:principal_portfolio]  = (officer_data[:principal] - officer_data[:principal_paid_due]).round(2)
        officer_data[:interest_portfolio]   = (officer_data[:interest] - officer_data[:interest_paid_due]).round(2)
        officer_data[:total_portfolio]      = (officer_data[:principal_portfolio] + officer_data[:interest_portfolio]).round(2)

        @data[:records] << officer_data
      end

      @data
    end

    private

    def compute_loan_disbursements!(officer)
      loan_ids  = @data_rr[:records].select{ |o|
                    o[:officer][:id] == officer[:id]
                  }.map{ |o|
                    o[:id]
                  }.uniq

      Loan.where(
        "id IN (?) AND extract(month FROM date_released) = ? AND extract(year FROM date_released) = ?", 
        loan_ids,
        @month,
        @year
      ).map{ |o|
        {
          id: o.id,
          principal: o.principal,
          interest: o.interest,
          date_released: o.date_released,
          pn_number: o.pn_number,
          member: {
            id: o.member.id,
            first_name: o.member.first_name,
            middle_name: o.member.middle_name,
            last_name: o.member.last_name
          }
        }
      }
    end

    def compute_previous_loaners!(officer)
      @previous_data_member_counts[:counts][:loaners][:members].select{ |o|
        o[:officer][:id] == officer[:id]
      }
    end

    def compute_loaners!(officer)
      @data_member_counts[:counts][:loaners][:members].select{ |o|
        o[:officer][:id] == officer[:id]
      }
    end

    def compute_pure_savers!(officer)
      @data_member_counts[:counts][:pure_savers][:members].select{ |o|
        o[:officer][:id] == officer[:id]
      }
    end

    def compute_previous_pure_savers!(officer)
      @previous_data_member_counts[:counts][:pure_savers][:members].select{ |o|
        o[:officer][:id] == officer[:id]
      }
    end

    def compute_active_members!(officer)
      @data_member_counts[:counts][:active_members][:members].select{ |o|
        o[:officer][:id] == officer[:id]
      }
    end

    def compute_previous_active_members!(officer)
      @previous_data_member_counts[:counts][:active_members][:members].select{ |o|
        o[:officer][:id] == officer[:id]
      }
    end

    def compute_loans!(officer)
      @data_rr[:records].select{ |o|
        o[:officer][:id] == officer[:id]
      }
    end
  end
end
