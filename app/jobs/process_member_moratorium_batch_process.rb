class ProcessMemberMoratoriumBatchProcess < ApplicationJob
  queue_as :default

  def perform(args)
    center  = Center.find(args[:center_id])
    user    = User.find(args[:user_id])

    MemberMoratorium.processing.where(center_id: center.id).each do |member_moratorium|
      begin
        config = {
          member_moratorium: member_moratorium,
          user: user
        }

        ActiveRecord::Base.transaction do
          member_moratorium.member_loan_moratoria.each do |member_loan_moratorium|
            member_loan_moratorium.update!(status: "processing")
            ProcessMemberLoanMoratorium.perform_later({
              id: member_loan_moratorium.id,
              user_id: user.id
            })
          end
        end
      rescue Exception => e
        logger.info "Exception occurred!"
        logger.info e

        member_moratorium.update!(
          status: "pending"
        )
      end
    end
  end
end
