class ProcessApproveInsuranceLoanBundleEnrollment < ApplicationJob
  queue_as :operations

  def perform(args)
    record  = InsuranceLoanBundleEnrollment.find(args[:id])
    user    = User.find(args[:user_id])

    begin
      config  = {
        insurance_loan_bundle_enrollment: record,
        user: user
      }

      record  = ::InsuranceLoanBundleEnrollments::Approve.new(
                  config: config
                ).execute!

      record.update!(status: "approved")
    rescue Exception => e
      record.update!(
        status: "error",
        data: {
          exception: e,
          application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
        }
      )
    end
  end
end
