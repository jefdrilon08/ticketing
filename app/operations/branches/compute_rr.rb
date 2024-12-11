module Branches
  class ComputeRr
    attr_accessor :result, :data

    def initialize(config:)
      @config = config
      @branch = @config[:branch]
      #@as_of  = Date.today
      @as_of  = @config[:as_of].try(:to_date) || Date.today

      #@manual_aging = @config[:manual_aging] || false
      @manual_aging = false

      @data = {
        branch: {
          id: @branch.id,
          name: @branch.name
        },
        as_of: @as_of,
        loan_products: [],
        centers: [],
        officers: [],
        records: [],
        total_principal: 0.00,
        total_principal_paid: 0.00,
        total_overall_principal_balance: 0.00,
        total_interest: 0.00,
        total_interest_paid: 0.00,
        total_overall_interest_balance: 0.00,
        total_total_paid: 0.00,
        total_principal_due: 0.00,
        total_total_due: 0.00,
        total_principal_balance: 0.00,
        total_total_balance: 0.00,
        total_overall_balance: 0.00,
        total_rr: 0,
        total_principal_rr: 0,
        total_principal_paid_due: 0.00,
        total_interest_paid_due: 0.00,
        total_paid_due: 0.00
      }
    end

    def execute!
      #query_result!
      query_result_offset!
      build_result!

      @data[:loan_products] = @data[:records].map{ |o|
                                o[:loan_product]
                              }.uniq

      @data[:centers] = @data[:records].map{ |o|
                          o[:center]
                        }.uniq

      @data[:officers]  = @data[:records].map{ |o|
                            o[:officer]
                          }.uniq

      # Compute totals
      @data[:records].each do |r|
        @data[:total_principal] += r[:principal].to_f
        @data[:total_principal_paid] += r[:principal_paid].to_f
        @data[:total_principal_paid_due] += r[:principal_paid_due].to_f
        @data[:total_overall_principal_balance] += r[:overall_principal_balance].to_f
        @data[:total_interest] += r[:interest].to_f
        @data[:total_interest_paid] += r[:interest_paid].to_f
        @data[:total_overall_interest_balance] += r[:overall_interest_balance].to_f
        @data[:total_total_paid] += r[:total_paid].to_f
        @data[:total_principal_due] += r[:principal_due].to_f
        @data[:total_total_due] += r[:total_due].to_f
        @data[:total_total_balance] += r[:total_balance].to_f
        @data[:total_principal_balance] += r[:principal_balance].to_f
        @data[:total_paid_due] += r[:total_paid_due].to_f
      end

      @data[:total_overall_balance] = @data[:total_overall_principal_balance] + @data[:total_overall_interest_balance]
      @data[:total_rr] = @data[:total_paid_due] / @data[:total_total_due]

      @data[:total_principal_rr] = @data[:total_principal_paid_due] / @data[:total_principal_due]

      if @data[:total_principal_rr] > 1
        @data[:total_principal_rr] = 1
      end

      @data
    end

    private

    def build_result!
      @result.each do |r|
        amorts  = []

        if r.fetch("amorts").present?
          JSON.parse(r.fetch("amorts")).each do |o|
            o.each do |oo|
              amorts << oo["due_date"]
            end
          end
        end

        amorts    = amorts.uniq
        max_amort = amorts.map{ |d| d.to_date }.max

        latest_transaction_date = r.try(:fetch, "latest_transaction_date").try(:to_date)

        principal_paid      = r.fetch("principal_paid").to_f.round(2)
        interest_paid       = r.fetch("interest_paid").to_f.round(2)
        total_paid          = r.fetch("total_paid").to_f.round(2)
        principal_due       = r.fetch("principal_due").to_f.round(2)
        interest_due        = r.fetch("interest_due").to_f.round(2)
        total_due           = (principal_due + interest_due).round(2)
        principal_paid_due  = principal_paid >= principal_due ? principal_due : principal_paid
        interest_paid_due   = interest_paid >= interest_due ? interest_due : interest_paid
        total_paid_due      = (principal_paid_due.to_f.round(2) + interest_paid_due.to_f.round(2)).to_f.round(2)

        overall_principal_balance = r.fetch("overall_principal_balance").to_f.round(2)

        if overall_principal_balance < 0
          overall_principal_balance = 0.00
        end

        overall_interest_balance  = r.fetch("overall_interest_balance").to_f.round(2)

        if overall_interest_balance < 0
          overall_interest_balance  = 0.00
        end

        overall_balance           = (overall_principal_balance + overall_interest_balance).to_f.round(2)

        principal_rr  = (principal_paid_due / principal_due).round(4)
        interest_rr   = (interest_paid_due / interest_due).round(4)
        total_rr      = (total_paid_due / total_due).round(4) 

        # Repayment rate
        if principal_paid_due > 0
        else
          principal_rr  = 0.00;
        end

        if interest_paid_due > 0
        else
          interest_rr  = 0.00;
        end

        if total_paid_due > 0
        else
          total_rr  = 0.00;
        end

        # Clear repayment rates
        if principal_rr > 1
          principal_rr = 1
        end

        if principal_rr >= 1 and principal_paid < principal_due
          principal_rr = 0.99
        end

        if interest_rr > 1
          interest_rr = 1
        end

        if interest_rr >= 1 and interest_paid < interest_due
          interest_rr = 0.99
        end

        if total_rr > 1
          total_rr = 1
        end

        if total_rr >= 1 and total_paid < total_due
          total_rr = 0.99
        end

        principal_balance = r.fetch("principal_balance").to_f.round(2)

        if principal_balance < 0
          principal_balance = 0.00
        end

        interest_balance  = r.fetch("interest_balance").to_f.round(2)

        if interest_balance < 0
          interest_balance  = 0.00
        end

        total_balance     = (principal_balance + interest_balance).to_f.round(2)

        principal         = r.fetch("principal").to_f.round(2)
        interest          = r.fetch("interest").to_f.round(2)
        total             = r.fetch("total").to_f.round(2)
        par               = (principal_balance / principal)

        first_date_of_payment = r.fetch("first_date_of_payment").to_date

        num_days_par  = 0

        if par > 0 and max_amort.present? and latest_transaction_date.present?
          num_days_par  = (@as_of - max_amort).to_i

          if num_days_par == 0
            num_days_par = 1
          end
        elsif par > 0 and latest_transaction_date.blank?
          num_days_par  = (@as_of - first_date_of_payment).to_i

          if num_days_par == 0
            num_days_par = 1
          end
        elsif latest_transaction_date.blank?
          l_id = r.fetch("id")
          first_amort = AmortizationScheduleEntry.where(loan_id: l_id).order(:due_date).first.due_date
          #num_days_par  = (@as_of - first_date_of_payment).to_i
          num_days_par  = (@as_of - first_amort).to_i
          #if num_days_par == 0
            #num_days_par = 1
          #end
        elsif par > 0 and latest_transaction_date.present?
          num_days_par  = (@as_of - first_date_of_payment).to_i

          if num_days_par == 0
            num_days_par = 1
          end
        end

        temp_r  = {
          id: r.fetch("id"),
          pn_number: r.fetch("pn_number"),
          date_released: r.fetch("date_released"),
          maturity_date: r.fetch("maturity_date"),
          loan_product: {
            id: r.fetch("loan_product_id"),
            name: r.fetch("loan_product_name")
          },
          member: {
            id: r.fetch("member_id"),
            first_name: r.fetch("member_first_name"),
            last_name: r.fetch("member_last_name"),
            middle_name: r.fetch("member_middle_name"),
            identification_number: r.fetch("member_identification_number")
          },
          branch: {
            id: r.fetch("branch_id"),
            name: r.fetch("branch_name")
          },
          center: {
            id: r.fetch("center_id"),
            name: r.fetch("center_name")
          },
          officer: {
            id: r.fetch("user_id"),
            first_name: r.fetch("user_first_name"),
            last_name: r.fetch("user_last_name")
          },
          principal:                  principal,
          interest:                   interest,
          total:                      total,
          principal_due:              principal_due,
          interest_due:               interest_due,
          total_due:                  total_due,
          principal_paid:             principal_paid,
          interest_paid:              interest_paid,
          total_paid:                 total_paid,
          principal_paid_due:         principal_paid_due,
          interest_paid_due:          interest_paid_due,
          total_paid_due:             total_paid_due,
          principal_balance:          principal_balance,
          interest_balance:           interest_balance,
          total_balance:              total_balance,
          overall_principal_balance:  overall_principal_balance,
          overall_interest_balance:   overall_interest_balance,
          overall_balance:            overall_balance,
          principal_rr:               principal_rr,
          interest_rr:                interest_rr,
          total_rr:                   total_rr,
          par:                        par,
          num_days_par:               num_days_par,
          latest_transaction_date:    latest_transaction_date,
          first_date_of_payment:      first_date_of_payment
        }
      
        @data[:records] << temp_r
        #sort by last_name
        @data[:records] = @data[:records].sort_by { |hash|hash[:member][:last_name]}
      end
    end

    def query_result_offset!
      @result = ::Branches::QueryRr.new(
        branch: @branch,
        as_of: @as_of,
        manual_aging: @manual_aging
      ).execute!
    end

    def query_result!
      @result = ReportingDbLoan.connection.execute(<<-EOS).to_a
                  SELECT
                    loans.id,
                    loans.pn_number,
                    loans.date_released,
                    loans.first_date_of_payment,
                    loans.maturity_date,
                    ROUND(loans.principal, 2) AS principal,
                    ROUND(loans.interest, 2) AS interest,
                    ROUND(loans.principal + loans.interest, 2) AS total,
                    lp.id AS loan_product_id,
                    lp.name AS loan_product_name,
                    m.id AS member_id,
                    m.identification_number AS member_identification_number,
                    m.first_name AS member_first_name,
                    m.middle_name AS member_middle_name,
                    m.last_name AS member_last_name,
                    b.id AS branch_id,
                    b.name AS branch_name,
                    c.id AS center_id,
                    c.name AS center_name,
                    u.id AS user_id,
                    u.first_name AS user_first_name,
                    u.last_name AS user_last_name,
                    u.identification_number AS user_identification_number,
                    tt.total_principal_paid AS principal_paid,
                    tt.total_interest_paid AS interest_paid,
                    ROUND((tt.total_principal_paid + tt.total_interest_paid), 2) AS total_paid,
                    at.principal AS principal_due,
                    at.interest AS interest_due,
                    ROUND(at.principal + at.interest, 2) AS total_due,
                    ROUND(at.principal - COALESCE(tt.total_principal_paid, 0.00), 2) AS principal_balance,
                    ROUND(at.interest - COALESCE(tt.total_interest_paid, 0.00), 2) AS interest_balance,
                    ROUND(principal_balance + interest_balance, 2) AS total_balance,
                    ROUND(loans.principal - COALESCE(tt.total_principal_paid, 0.00), 2) AS overall_principal_balance,
                    ROUND(loans.interest - COALESCE(tt.total_interest_paid, 0.00), 2) AS overall_interest_balance,
                    tt.transacted_at AS latest_transaction_date,
                    tt.amorts
                  FROM
                    loans
                  LEFT OUTER JOIN
                    (
                      SELECT 
                        subsidiary_id, 
                        ROUND(SUM(COALESCE(CAST(data->>'total_principal_paid' AS decimal), 0.00)), 2) AS total_principal_paid,
                        ROUND(SUM(CAST(data->>'total_interest_paid' AS decimal)),2 ) AS total_interest_paid,
                        DATE(MAX(transacted_at)) AS transacted_at,
                        json_agg(data->'amort_entries') AS amorts
                      FROM
                        account_transactions
                      WHERE
                        account_transactions.transaction_type = 'loan_payment'
                      AND
                        account_transactions.status = 'approved'
                      AND 
                        DATE(account_transactions.transacted_at) <= '#{@as_of}'
                      AND
                        account_transactions.amount > 0
                      GROUP BY 1
                    ) tt ON loans.id = tt.subsidiary_id
                  LEFT JOIN
                    (
                      SELECT
                        loan_id,
                        ROUND(SUM(principal), 2) AS principal,
                        ROUND(SUM(interest), 2) AS interest
                      FROM
                        amortization_schedule_entries
                      WHERE
                        amortization_schedule_entries.due_date #{@manual_aging ? '<=' : '<'} '#{@as_of}'
                      GROUP BY 1
                    ) at ON loans.id = at.loan_id
                  INNER JOIN centers c ON loans.center_id = c.id
                  INNER JOIN users u ON u.id = loans.user_id
                  INNER JOIN branches b ON b.id = loans.branch_id
                  INNER JOIN loan_products lp ON lp.id = loans.loan_product_id
                  INNER JOIN members m ON m.id = loans.member_id
                  WHERE
                    (
                      loans.status IN ('active', 'processing') AND loans.date_approved <= '#{@as_of}' AND loans.max_active_date >= '#{@as_of}' AND loans.branch_id = '#{@branch.id}'
                    )
                    OR
                    (
                      loans.status = 'paid' AND loans.date_approved <= '#{@as_of}' AND loans.max_active_date > '#{@as_of}' AND loans.branch_id = '#{@branch.id}'
                    )
                EOS
    end
  end
end
