namespace :v1 do
  task :reset_loan_payments_and_amortization => :environment do
    branch  = Branch.find(ENV['BRANCH_ID'])
    loans   = Loan.active_or_paid.where(branch_id: branch.id)


    loan_payments = AccountTransaction.approved_loan_payments.where(
                      subsidiary_id: loans.pluck(:id),
                      subsidiary_type: 'Loan'
                    )

    amort_entries = AmortizationScheduleEntry.where(
                      loan_id: loans.pluck(:id)
                    ).order("due_date ASC")

    puts "Deleting loan_payments..."
    loan_payments.delete_all

    puts "Deleting amortizations..."
    amort_entries.delete_all
  end

  task :validate_loan_portfolio => :environment do
    require 'net/http'
    require 'json'

    as_of         = ENV['AS_OF'].try(:to_date) || Date.today
    branch        = Branch.find(ENV['BRANCH_ID'])
    loan_product  = LoanProduct.find(ENV['LOAN_PRODUCT_ID'])
    url           = ENV['URL']
    

    puts "Validating loan portfolios for branch #{branch.to_s} and product #{loan_product.to_s}..."

    invalid_loans = []

    loans = Loan.active_or_paid.where(branch_id: branch.id, loan_product_id: loan_product.id)

    size  = loans.size

    current_portfolio = 0.00
    v1_portfolio      = 0.00

    loans.each_with_index do |o,i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Examining #{o.id}... #{progress}%%")
      #sleep(0.1)

      amorts  = AmortizationScheduleEntry.where(
                  "due_date <= ? AND loan_id = ?",
                  as_of,
                  o.id
                ).order("due_date ASC")

      payments  = AccountTransaction.approved_loan_payments.where(
                    "DATE(transacted_at) <= ? AND subsidiary_id = ? AND subsidiary_type = ?",
                    as_of,
                    o.id,
                    "Loan"
                  )

      portfolio = (o.amortization_schedule_entries.sum(:principal) - payments.sum("CAST(data->>'total_principal_paid' AS decimal)")).to_f.round(2)

      current_loan  = {
        id: o.id,
        portfolio: portfolio
      }

      # Fetch loan
      uri         = URI("#{url}?uuid=#{o.id}")
      response    = Net::HTTP.get(uri)
      other_loan  = JSON.parse(response).with_indifferent_access

      current_portfolio += portfolio
      v1_portfolio      += other_loan[:portfolio]

      if current_loan[:portfolio] != other_loan[:portfolio]
        puts ""
        puts "Found one! #{current_loan[:portfolio]} != #{other_loan[:portfolio]}"
        invalid_loans << o.id
      end
    end

    if invalid_loans.any?
      puts "Found #{invalid_loans.size} invalid loans."

      puts "Invalid loans:"
      invalid_loans.each do |invalid_loan|
        puts "#{invalid_loan.id}"
      end
    end

    puts "Current Portfolio: #{current_portfolio} | V1 Portfolio: #{v1_portfolio}"

    puts ""
    puts "Done."
  end
end
