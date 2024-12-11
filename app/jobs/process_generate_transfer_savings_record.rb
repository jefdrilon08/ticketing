class ProcessGenerateTransferSavingsRecord < ApplicationJob
  queue_as :default

  def perform(args)
    transfer_savings    =TransferSavingsRecord.find(args[:transfer_savings])
    user      = User.find(args[:user])

    begin
      
      config  = {
        transfer_savings: transfer_savings.id,
        user: user.id
      }
      transfer_savings  = ::TransferSavings::Generate.new(
                      config: config
                    ).execute!
      
      transfer_savings.update!(status: "pending")


    rescue Exception => e
      transfer_savings.update!(
        status: "error",
        data: {
          exception: e,
          application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
        }
      )
    end
  end
end
