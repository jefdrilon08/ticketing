module Core
  module Users
    class ValidateCreate < ::Core::Validator
      attr_accessor :payload

      def initialize(email:, username:, first_name:, last_name:, identification_number:, roles:, password:, password_confirmation:)
        super()

        @email                  = email
        @username               = username
        @first_name             = first_name
        @last_name              = last_name
        @identification_number  = identification_number
        @roles                  = roles
        @password               = password
        @password_confirmation  = password_confirmation
        #@profile_picture        = profile_picture

        @payload = {
          email:                  [],
          username:               [],
          first_name:             [],
          last_name:              [],
          identification_number:  [],
          roles:                  [],
          password:               [],
          password_confirmation:  [],
         # profile_picture:        []
        }
      end

      def execute!
        #if @profile_picture.present?
        #  validator_pic = ::Core::Utils::ValidateImageFile.new(file: @profile_picture)
        #  validator_pic.execute!

        #  @payload[:profile_picture] = validator_pic.payload[:file]
        #end

        if @email.blank?
          @payload[:email] << "required"
        elsif User.where(email: @email).count > 0
          @payload[:email] << "already taken"
        elsif (@email =~ URI::MailTo::EMAIL_REGEXP).nil?
          @payload[:email] << "invalid format"
        end

        if @username.blank?
          @payload[:username] << "required"
        elsif User.where(username: @username).count > 0
          @payload[:username] << "already taken"
        end

        if @first_name.blank?
          @payload[:first_name] << "required"
        end

        if @last_name.blank?
          @payload[:last_name] << "required"
        end

        if @identification_number.blank?
          @payload[:identification_number] << "required"
        elsif User.where(identification_number: @identification_number).count > 0
          @payload[:identification_number] << "already taken"
        end

        if @roles.blank?
          @payload[:roles] << "required"
        elsif not @roles.split(",").kind_of?(Array)
          @payload[:roles] << "invalid format"
        end

        if @password.blank?
          @payload[:password] << "required"
        end

        if @password_confirmation.blank?
          @payload[:password_confirmation] << "required"
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
