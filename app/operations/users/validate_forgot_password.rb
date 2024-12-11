module Users
  class ValidateForgotPassword
    attr_accessor :email,
                  :user,
                  :errors

    def initialize(email:)
      @email  = email

      @errors = []
    end

    def execute!
      if @email.blank?
        @errors << "Email required"
      else
        @user = User.find_by_email(@email)

        if @user.blank?
          @errors << "User not found"
        end
      end

      @errors
    end
  end
end
