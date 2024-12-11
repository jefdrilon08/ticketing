module Branches
  class QueryRr
    attr_accessor :result,
                  :branch,
                  :as_of

    def initialize(branch:, as_of: Date.today, manual_aging: false)
      @branch       = branch
      @as_of        = as_of.try(:to_date)
      @manual_aging = manual_aging
    end

    def execute!
      Rails.logger.info("Starting query for repayment rates for branch #{@branch.name} as_of #{@as_of}...")

      loan_ids = ReportingDbLoan.where(
        "(loans.status IN (?) AND loans.date_approved <= ? AND loans.max_active_date >= ? AND loans.branch_id = ?) OR (loans.status = ? AND loans.date_approved <= ? AND loans.max_active_date > ? AND loans.branch_id = ?)",
        ['active', 'processing'],
        @as_of,
        @as_of,
        @branch.id,
        'paid',
        @as_of,
        @as_of,
        @branch.id
      ).pluck(:id)

      num_loans = loan_ids.size

      Rails.logger.info("Number of loans for processing RR: #{num_loans}")

      @result = []

      total_start_time = Time.now

      loan_ids.each do |loan_id|
        start_time = Time.now

        @result += ReportingDbLoan.connection.execute(<<-EOS).to_a
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
                    WHERE loans.id = '#{loan_id}'
                    LIMIT 1
                  EOS

        end_time = Time.now

        num_minutes = (end_time - start_time) / 1.minutes
      end

      total_end_time = Time.now
      num_minutes = (total_end_time - total_start_time) / 1.minutes

      Rails.logger.info("Done processing TOTAL RR query in #{num_minutes.round(2)} minutes.")

      Rails.logger.info("Done performing query for RR")

      @result
    end
  end
end
