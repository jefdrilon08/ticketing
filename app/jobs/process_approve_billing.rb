class ProcessApproveBilling < ApplicationJob
  queue_as :operations

  def perform(args)
    billing = Billing.find(args[:id])
    user    = User.find(args[:user_id])

    begin
      config  = {
        billing: billing,
        user: user
      }
      
      ActiveRecord::Base.transaction do
        ::Billings::Approve.new(
          config: config
        ).execute!

        # Set maintaining balance for members
        Member.where(id: billing.member_ids).each do |m|
    
          ::Members::SetMaintainingBalance.new(
            config: {
              member: m
            }
          ).execute!
        end

        ActivityLog.create!(
          content: "#{user.full_name} approved billing",
          activity_type: "approval",
          data: {
            user_id: user.id,
            billing_id: billing.id
          }
        )
      end
    rescue Exception => e
      logger.info "Exception occurred!"
      logger.info e
      billing.update!(
        status: "pending"
      )
    end
  end
end
