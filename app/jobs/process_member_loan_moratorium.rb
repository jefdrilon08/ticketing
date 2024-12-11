class ProcessMemberLoanMoratorium < ApplicationJob
  queue_as :default

  def perform(args)
    member_loan_moratorium  = MemberLoanMoratorium.find(args[:id])
    user                    = User.find(args[:user_id])

    begin
      ::Adjustments::Moratoriums::ApproveMemberLoanMoratorium.new(
        config: {
          member_loan_moratorium: member_loan_moratorium,
          user: user
        }
      ).execute!

      number_of_done_records  = MemberLoanMoratorium.where(
                                  member_moratorium_id: member_loan_moratorium.member_moratorium_id,
                                  status: "done"
                                ).count

      target  = MemberLoanMoratorium.where(
                  member_moratorium_id: member_loan_moratorium.member_moratorium_id
                ).count

      if number_of_done_records == target
        member_moratorium = member_loan_moratorium.member_moratorium

        member_moratorium.update!(
          status: "done"
        )

        ActivityLog.create!(
          content: "#{user.full_name} processed member_moratorium #{member_moratorium.id}",
          activity_type: "approval",
          data: {
            user_id: user.id,
            user: {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name
            }
          }
        )
      end
    rescue Exception => e
      logger.info("Exception occurred for member_loan_moratorium #{args[:id]}")
      logger.info e

      member_loan_moratorium.update!(
        status: "pending"
      )

      member_loan_moratorium.member_moratorium.update!(
        status: "pending"
      )
    end
  end
end
