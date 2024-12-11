module Users
  class ValidateLogin < Validator
    attr_accessor :user, :token

    def initialize(username:, password:)
      super()
      @username = username
      @password = password

      @errors = {
        username: [],
        password: []
      }
    end

    def execute!
      if @username.blank?
        @errors[:username] << 'username required'
      end

      if @password.blank?
        @errors[:password] << 'password required'
      end

      if @username.present? and @password.present?
        @user = User.find_by_username(@username)

        if @user.blank?
          @errors[:username] << 'user not found'
        elsif !@user.valid_password?(@password)
          @errors[:password] << 'invalid password'
        elsif !@user.verified?
          @errors[:username] << 'user is not verified'
        else
          @token = @user.generate_jwt
        end
      end

      count_errors!
    end
  end
end
