module Centers
  class AssignOfficer < AppValidator
    def initialize(config:)
      @config   = config
      @user     = @config[:user]
      @officer  = @config[:officer]
      @center   = @config[:center]
    end

    def execute!
      ActiveRecord::Base.transaction do
        active_loans  = Loan.active.where(center_id: @center.id)

        # Update user_id lof active_loans
        sets  = active_loans.map{ |o|
                  "('#{o.id}')"
                }.join(",")

        if sets.present?
          query = "
            UPDATE loans AS a SET
              user_id = '#{@officer.id}'
            FROM (values
              #{sets}
            ) AS c(id)
            WHERE c.id = a.id::text
          "

          ActiveRecord::Base.connection.execute(query)
        end

        # Update officer of center
        @center.update!(user: @officer)

        # Log the action
        ActivityLog.create!(
          content: "#{@user.full_name} assigned officer #{@officer.full_name} to center",
          activity_type: "modification",
          data: {
            officer_id: @officer.id,
            user_id: @user.id,
            center_id: @center.id,
            loan_ids: active_loans.pluck(:id)
          }
        )
      end
    end
  end
end
