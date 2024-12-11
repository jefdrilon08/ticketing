class ProcessApproveMakePayments < ApplicationJob
  queue_as :operations
  def perform(args)
  
    begin
      ActiveRecord::Base.transaction do
        config = { 
                make_payment: args[:make_payment_details], 
                user: args[:user],
                current_date: args[:current_date]
              } 
        @data = ::Adjustments::MakePayments::ApproveMakePayments.new(config: config).execute!
      end

    rescue Exception => e
      logger.info "Exception occurred!"
      logger.info e
      MakePayment.find(args[:make_payment_details].id).update(status: "pending")
    end
  end
end
