class ProcessApproveYearEnd < ApplicationJob
  queue_as :operations

  def perform(args)
    data_store = DataStore.find(args[:id])
    user    = User.find(args[:user_id])

    begin
      config  = {
        data_store: data_store,
        user: user
      }
      
      ActiveRecord::Base.transaction do
        ::Closing::ApproveYearEndClosing.new(
          config: config
        ).execute!

        #::Billings::Approve.new(
        #  config: config
        #).execute!


        ActivityLog.create!(
          content: "#{user.full_name} approved year end closing",
          activity_type: "approval",
          data: {
            user_id: user.id,
            data_store: data_store.id
          }
        )
      end
    rescue Exception => e
    #  raise e.inspect
      logger.info "Exception occurred!"
      logger.info e
      data_store.update!(    
        status: "error"
      )
    end
  end
end
