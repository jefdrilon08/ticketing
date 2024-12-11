module Api
  class ApplicationController < ActionController::API
    def authenticate_member!
      if request.headers["Authorization"].blank?
        render json: { message: "authentication required" }, status: :forbidden
      else
        jwt_token = request.headers["Authorization"].split(" ")[1]
        payload = JWT.decode(jwt_token, Rails.application.secret_key_base)[0]

        @current_member = Member.find_by_id(payload["id"])

        if @current_member.blank?
          render json: { message: "invalid authorization" }, status: :forbidden
        end
      end
    end

    def authenticate_user!
      if request.headers["Authorization"].blank?
        render json: { message: "authentication required" }, status: :forbidden
      else
        jwt_token = request.headers["Authorization"].split(" ")[1]
        payload = JWT.decode(jwt_token, Rails.application.secret_key_base)[0]

        @current_user = User.find_by_id(payload["id"])

        if @current_user.blank?
          render json: { message: "invalid authorization" }, status: :forbidden
        end
      end
    end

    def authorize_admin!
      if @current_user.present? and !@current_user.admin?
        render json: { message: "invalid authorization" }, status: :unauthorized
      end
    end

    def authorize_active!
      if !(@current_user.present? and @current_user.active?)
        render json: { message: "invalid authorization" }, status: :unauthorized
      end
    end

    def authorize_mis!
      if @current_user.present? and !@current_user.is_mis?
        render json: { message: "invalid authorization" }, status: :unauthorized
      end
    end

    def authorize_active_member!
      if @current_member.present? and !@current_member.active?
        render json: { message: "invalid authorization" }, status: :unauthorized
      end
    end
  end
end
