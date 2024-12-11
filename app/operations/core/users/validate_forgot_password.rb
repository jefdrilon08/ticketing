module Core
  module Users
    class ValidateForgotPassword < ::Core::Validator
      attr_accessor :payload
      
      def initialize(email:)
        super()

        @email = email

        @payload = {
          email: []
        }
      end

      def execute!
        if @email.blank?
          @payload[:email] << "required"
        elsif (@email =~ URI::MailTo::EMAIL_REGEXP).nil?
          @payload[:email] << "invalid format"
        elsif User.where(email: @email).count == 0
          @payload[:email] << "user not found"
        end

        count_errors!
      end
    end
  end
end
