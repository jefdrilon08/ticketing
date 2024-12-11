module Core
  module Users
    class Update
      attr_accessor :user

      def initialize(user:, email:, username:, first_name:, last_name:, identification_number:, roles:, password:, password_confirmation:, is_regular:, incentivized_date:)
        @user                   = user
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
        if @email.present?
          @user.email = @email
        end

        if @username.present?
          @user.username = @username
        end

        if @first_name.present?
          @user.first_name = @first_name
        end

        if @last_name.present?
          @user.last_name = @last_name
        end

        if @identification_number.present?
          @user.identification_number = @identification_number
        end

        if @roles.present?
          @user.roles = @roles
        end

        if @password.present? and @password_confirmation.present? and @password == @password_confirmation
          # @user.encrypted_password = User.new(password: @password).encrypted_password
        end

        #if @profile_picture.present?
        #  @user.profile_picture = @profile_picture
        #end

        if @incentivized_date.present?
          @user.incentivized_date = @incentivized_date
        end

        @user.save!

        @user
      end
    end
  end
end
