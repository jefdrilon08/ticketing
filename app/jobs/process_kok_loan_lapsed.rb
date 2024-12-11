class ProcessKokLoanLapsed < ApplicationJob
  queue_as :operations

  def perform(config)
    @config = config
    insurance_loan_bundle_enrollment         = @config[:insurance_loan_bundle_enrollment]
    four_weeks_ago                           = @config[:four_weeks_ago]
    kok_id                                   = @config[:kok_id]
    maturity_date                            = @config[:maturity_date]
    on_grace_period                          = @config[:on_grace_period]
    now                                      = @config[:now]
    age                                      = @config[:age]
    status                                   = @config[:status]
    effectivity_date                         = @config[:effectivity_date].to_date

    if age <= 75
      if status == "lapsed"
        cmd = ::InsuranceLoanBundleEnrollments::UpdateApprovedStatus.new(
            config: config
          ).execute!
      end

    end
  end
end
