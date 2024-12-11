class ProcessApproveBatchMoratoriumAdjustment < ApplicationJob
  queue_as :default

  def perform(args)
    adjustment_record = AdjustmentRecord.find(args[:id])
    user              = User.find(args[:user_id])

    config = {
      adjustment_record: adjustment_record,
      user: user
    }

    ::Adjustments::BatchMoratoriumAdjustments::Approve.new(
      config: config
    ).execute!
  end
end
