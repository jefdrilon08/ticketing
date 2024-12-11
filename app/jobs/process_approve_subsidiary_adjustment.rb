class ProcessApproveSubsidiaryAdjustment < ApplicationJob
  queue_as :operations

  def perform(args)

      adjustment_record = AdjustmentRecord.find(args[:adjustment_record])
      
      user              = User.find(args[:user_id])
      
    
      begin
        config  = {
          adjustment_record: adjustment_record,
          user: user
        }

        subsidiary_adjustment = ::Adjustments::SubsidiaryAdjustments::Approve.new(
                                  config: config
                                  ).execute!
      rescue Exception => e
        adjustment_record.update!(status: "pending")

      end



    
  end
end
