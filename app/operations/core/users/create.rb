module Core
  module Users
    class Create
      attr_accessor :user

      def initialize(email:, username:, first_name:, last_name:, identification_number:, roles:, password:, password_confirmation:, is_regular:, incentivized_date:)
        @email                  = email
        @username               = username
        @first_name             = first_name
        @last_name              = last_name
        @identification_number  = identification_number
        @roles                  = roles.split(",")
        @password               = password
        @password_confirmation  = password_confirmation
        @incentivized_date      = incentivized_date
      end

      def execute!
        @user = User.new(
          email:                  @email,
          username:               @username,
          first_name:             @first_name,
          last_name:              @last_name,
          roles:                  @roles,
          identification_number:  @identification_number,
          password:               @password,
          password_confirmation:  @password_confirmation,
          incentivized_date:      @incentivized_date
        )

        @user.save!

        @user
      end
    end
  end
end
