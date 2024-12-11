module Api
  module V2
    module Members
      class SettingsController < ApiController
        before_action :authenticate_api_member!

        def change_password
          password              = params[:password]
          password_confirmation = params[:password_confirmation]

          errors  = []

          if password.blank?
            errors << "password required"
          end

          if password_confirmation.blank?
            errors << "password confirmation required"
          end

          if password.present? and password_confirmation.present? and password != password_confirmation
            errors << "passwords do not match"
          end

          if errors.length > 0
            render json: { errors: errors }, status: 403
          else
            @member.update!(
              password: password,
              password_confirmation: password_confirmation
            )

            render json: { message: "ok" }
          end
        end
      end
    end
  end
end
