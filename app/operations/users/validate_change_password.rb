module Users
  class ValidateChangePassword < AppValidator
    attr_accessor :errors

    def initialize(password:, password_confirmation:, user:)
      super()

      @password               = password
      @password_confirmation  = password_confirmation
      @user                   = user
    end

    def execute!
      if @user.blank?
        @errors[:messages] << {
          key: "user",
          message: "user required"
        }
      end

      if @password.blank?
        @errors[:messages] << {
          key: "password",
          message: "Password required"
        }
      end

      if @password_confirmation.blank?
        @errors[:messages] << {
          key: "password_confirmation",
          message: "password_confirmation required"
        }
      end

      if @password.present? and @password_confirmation.present? and @password != @password_confirmation
        @errors[:messages] << {
          key: "password",
          message: "passwords do not match"
        }
      end

      #not_yet_implemented!

      @errors[:messages].each do |o|
        @errors[:full_messages] << o[:message]
      end

      @errors
    end
  end
end
