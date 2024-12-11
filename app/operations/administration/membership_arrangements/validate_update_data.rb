module Administration
  module MembershipArrangements
    class ValidateUpdateData < AppValidator
      attr_accessor :errors,
                    :membership_arrangement,
                    :data,
                    :user

      def initialize(membership_arrangement:, data:, user:)
        super()

        @membership_arrangement = membership_arrangement
        @data                   = data
        @user                   = user
      end

      def execute!
        if @user.blank?
          @errors[:messages] << {
            key: "user",
            message: "User not found"
          }
        end

        if @data.blank?
          @errors[:messages] << {
            key: "data",
            message: "Data not found"
          }
        end

        if @membership_arrangement.blank?
          @errors[:messages] << {
            key: "membership_arrangement",
            message: "Membership arrangement not found"
          }
        end

        #not_yet_implemented!

        @errors[:messages].each do |m|
          @errors[:full_messages] << m[:message]
        end

        @errors
      end
    end
  end
end
