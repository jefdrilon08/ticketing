class ProcessApproveTransferSavings < ApplicationJob
  queue_as :default

  def perform(args)
    transfer_savings_record    =TransferSavingsRecord.find(args[:transfer_savings_record])
    user      = User.find(args[:user])

    begin
      
      config  = {
        transfer_savings_record: transfer_savings_record.id,
        user: user.id
      }
      transfer_savings_record  = ::TransferSavings::Approve.new(
                      config: config
                    ).execute!
      
      transfer_savings_record.update!(status: "approved")
      
    rescue Exception => e
      transfer_savings_record.update!(
        status: "error",
        data: {
          exception: e,
          application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
        }
      )
    end
  end
end
