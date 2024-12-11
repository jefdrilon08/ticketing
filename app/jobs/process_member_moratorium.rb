class ProcessMemberMoratorium < ApplicationJob
  queue_as :default

  def perform(args)
    member_moratorium = MemberMoratorium.find(args[:id])
    user              = User.find(args[:user_id])

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
