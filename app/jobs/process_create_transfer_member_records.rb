class ProcessCreateTransferMemberRecords< ApplicationJob
  queue_as :default

  def perform(args)
    transfer_member_records = TransferMemberRecord.find(args[:id])


    begin
      config  = {
        id: transfer_member_records.id
      }
     
      transfer_member  = TransferMemberRecords::SaveTransferMemberRecords.new(
                      config: config
                    ).execute!

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
