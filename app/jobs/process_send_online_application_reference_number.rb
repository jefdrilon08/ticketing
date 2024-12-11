class ProcessSendOnlineApplicationReferenceNumber < ApplicationJob
  queue_as :operations

  def perform(args)
    mobile_number     = args[:mobile_number]
    first_name        = args[:first_name]
    last_name         = args[:last_name]
    reference_number  = args[:reference_number]

    begin
      message = "Magandang araw #{first_name} #{last_name} Your application has been received with reference number #{reference_number}. Please check with https://mykoins.org.ph and input reference number to view status of application. Maraming salamat!"

      logger.debug("[REFERENCE NUMBER NOTIFICATION]: Sending message --> #{message} to #{mobile_number}")

      sns = ::Aws::SNS::Client.new(
              region: ENV['AWS_REGION']
            )

      sns.publish(phone_number: mobile_number, message: message)
    rescue Exception => e
      logger.error("[REFERENCE NUMBER NOTIFICATION FAILURE]: #{e.message}")
      logger.error(e.backtrace.join("\n"))
    end
  end
end
