module Users
  class ChangePassword
    def initialize(password:, password_confirmation:, user:)
      @user                   = user
      @password               = password
      @password_confirmation  = password_confirmation
    end

    def execute!
      @user.update!(
        password: @password,
        password_confirmation: @password_confirmation
      )
    end
  end
end
