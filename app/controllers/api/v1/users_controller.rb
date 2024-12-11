module Api
  module V1
    class UsersController < ApiController
      #skip_before_action :verify_authenticity_token
      before_action :authenticate_user!, except: [:login]

      def update_profile_picture
        profile_picture = params[:profile_picture]

        validator = ::Users::ValidateUpdateProfilePicture.new(
          profile_picture: profile_picture
        )

        validator.execute!

        if validator.errors[:full_messages].any?
          render json: validator.errors, status: 400
        else
          current_user.update!(profile_picture: profile_picture)
          
          render json: { message: "ok" }
        end
      end

      def change_password
        password              = params[:password]
        password_confirmation = params[:password_confirmation]

        validator = ::Users::ValidateChangePassword.new(
                      password: password,
                      password_confirmation: password_confirmation,
                      user: current_user
                    )

        validator.execute!

        if validator.errors[:full_messages].any?
          render json: validator.errors, status: 400
        else
          ::Users::ChangePassword.new(
            password: password,
            password_confirmation: password_confirmation,
            user: current_user
          ).execute!

          render json: { message: "ok" }
        end
      end

      def roles
        render json: { roles: current_user.roles, username: current_user.username } 
      end
    end
  end
end
