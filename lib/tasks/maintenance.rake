namespace :maintenance do
  task :update_loan_repayment_rates => :environment do
    start_date  = ENV['START_DATE'].to_date
    end_date    = ENV['END_DATE'].to_date

    loans = Loan.active_or_paid

    if ENV['BRANCH_ID'].present?
      branch      = Branch.find(ENV['BRANCH_ID'])

      loans = loans.where(
                branch_id: branch.id
              )
    end

    size  = loans.size

    puts "Start Date: #{start_date}"
    puts "End Date: #{end_date}"

    loans.each_with_index do |o, i|
      progress  = (((i + 1).to_f / size.to_f) * 100).round(2)
      printf("\r(#{i+1}/#{size}): Updating #{o.id}... #{progress}%%")

      (start_date..end_date).each do |d|
        config  = {
          as_of: d,
          loan: o
        }

        ::Loans::SaveLoanRepaymentRateRecord.new(
          config: config
        ).execute!
      end
    end

    puts "Done."
  end
end
