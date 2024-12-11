class ProcessApproveSavingsInsuranceTransferCollection < ApplicationJob
  queue_as :operations

  def perform(args)
    record  = SavingsInsuranceTransferCollection.find(args[:id])
    user    = User.find(args[:user_id])

    begin
      config  = {
        savings_insurance_transfer_collection: record,
        user: user
      }

      record  = ::SavingsInsuranceTransferCollections::Approve.new(
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
