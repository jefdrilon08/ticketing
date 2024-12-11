class ProcessApproveTransferMemberRecords < ApplicationJob
  queue_as :default

  def perform(args)
    transfer_member_records    = TransferMemberRecord.find(args[:transfer_member_records])
    user      = User.find(args[:user])

    begin
      
      config  = {
        transfer_member_records: transfer_member_records.id,
        user: user.id
      }
      transfer_member_records  = ::TransferMemberRecords::Approve.new(
                      config: config
                    ).execute!
      
      transfer_member_records.update!(status: "approved")


    rescue Exception => e
      transfer_member_records.update!(
        status: "error",
        data: {
          exception: e,
          application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
        }
      )
    end
  end
end
