class ProcessCreateBilling < ApplicationJob
  queue_as :operations
  
  def perform(args)
    billing = Billing.find(args[:id])
    user    = User.find(args[:user_id])

    begin
      billing = ::Billings::CreateBilling.new(
                  config: {
                    collection_date: billing.collection_date,
                    branch: billing.branch,
                    center: billing.center,
                    user: user
                  },
                  billing: billing
                ).execute!

      billing.update!(status: "pending")
    rescue Exception => e
      logger.info("Exception occurred!")
      logger.info e

      Rollbar.error(e, billing_id: args[:id], user_id: args[:user_id])

      billing.update!(
        status: "error",
        data: { e: e }
      )
    end
  end
end
