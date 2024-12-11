module Users
  class ValidateApiLogin < AppValidator
    attr_accessor :errors,
                  :username,
                  :password,
                  :user_type

    def initialize(username:, password:, user_type:)
      super()

      @username   = username
      @password   = password
      @user_type  = user_type
    end

    def execute!
      if @username.blank?
        @errors[:messages] << {
          key: "username",
          message: "username required"
        }
      end

      if @password.blank?
        @errors[:messages] << {
          key: "password",
          message: "password required"
        }
      end

      if @user_type.blank?
        @errors[:messages] << {
          key: "user_type",
          message: "user_type required"
        }
      elsif !USER_TYPES.include?(@user_type)
        @errors[:messages] << {
          key: "user_type",
          message: "invalid user_type #{@user_type}"
        }
      end

      build_full_messages!

      @errors
    end
  end
end
