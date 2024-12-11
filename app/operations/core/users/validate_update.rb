module Core
  module Users
    class ValidateUpdate < ::Core::Validator
      attr_accessor :payload

      def initialize(user:, email:, username:, identification_number:, roles:, password:, password_confirmation:)
        super()

        @user                   = user
        @email                  = email
        @username               = username
        @identification_number  = identification_number
        @roles                  = roles
        @password               = password
        @password_confirmation  = password_confirmation
        #@profile_picture        = profile_picture

        @payload = {
          user:                   [],
          email:                  [],
          username:               [],
          first_name:             [],
          last_name:              [],
          identification_number:  [],
          roles:                  [],
          password:               [],
          password_confirmation:  []
          #profile_picture:        []
        }
      end

      def execute!
        if @user.blank?
          @payload[:user] << "not found"
        end

        #if @profile_picture.present?
        #  validator_pic = ::Core::Utils::ValidateImageFile.new(file: @profile_picture)
        #  validator_pic.execute!

        #  @payload[:profile_picture] = validator_pic.payload[:file]
        #end

        if @email.present?
          if User.where(email: @email).where.not(id: @user.id).count > 0
            @payload[:email] << "already taken"
          elsif (@email =~ URI::MailTo::EMAIL_REGEXP).nil?
            @payload[:email] << "invalid format"
          end
        end

        if @username.present?
          if User.where(username: @username).where.not(id: @user.id).count > 0
            @payload[:username] << "already taken"
          end
        end

        if @identification_number.present?
          if User.where(identification_number: @identification_number).where.not(id: @user.id).count > 0
            @payload[:identification_number] << "already taken"
          end
        end

        if @roles.blank?
          @payload[:roles] << "required"
        elsif not @roles.split(",").kind_of?(Array)
          @payload[:roles] << "invalid format"
        end

        if @password.present? and @password_confirmation.present? and @password != @password_confirmation
          @payload[:password] << "passwords do not match"
          @payload[:password_confirmation] << "passwords do not match"
        end

        count_errors!
      end
    end
  end
end
