class ProcessKokLoan < ApplicationJob
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
      if status == "approved"
        #  for renewal
        if now >= four_weeks_ago && now <= maturity_date
          cmd = ::InsuranceLoanBundleEnrollments::MemberRenewal.new(
            config: config
          ).execute!
        #  for lapsed
        elsif now > on_grace_period
          cmd = ::InsuranceLoanBundleEnrollments::UpdateInsuranceLoanBundleStatus.new(
            config: config
          ).execute!
        # for on grace period
        elsif now > maturity_date && now <= on_grace_period
          cmd = ::InsuranceLoanBundleEnrollments::MemberOnGracePeriodRenewal.new(
            config: config
          ).execute!
        end
      elsif status == "for-renewal"
        if now >= effectivity_date && now <= on_grace_period
          cmd = ::InsuranceLoanBundleEnrollments::UpdateGracePeriodStatus.new(
            config: config
          ).execute!
        end
      elsif status == "on-grace-period"
        if now > on_grace_period
          cmd = ::InsuranceLoanBundleEnrollments::UpdateInsuranceLoanBundleStatus.new(
            config: config
          ).execute!
        end
      end
    else
      cmd = ::InsuranceLoanBundleEnrollments::UpdateOverAgeStatus.new(
        config: config
      ).execute!
    end
  end
end
