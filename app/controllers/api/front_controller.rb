module Api
  class FrontController < ActionController::API
    def authenticate_user_or_member!
      if request.headers["X-KOINS-HQ-TOKEN"].present?
        authenticate_user!
      elsif request.headers["X-KOINS-PWA-TOKEN"].present?
        authenticate_member!
      else
        render json: { errors: { user: 'token required' } }, status: :unprocessable_entity
      end
    end

    def authenticate_user!
      token = request.headers["X-KOINS-HQ-TOKEN"]

      if token.blank?
       
        render json: { errors: { user: 'token required' } }, status: :unprocessable_entity
      else
        begin
          decoded = JWT.decode(token, Rails.application.secret_key_base)
          id      = decoded.first["id"]

          @user = ReadOnlyUser.find_by_id(id)

          if @user.blank?
            render json: { errors: { user: 'user not found' } }, status: :unprocessable_entity
          end
        rescue Exception => e
          logger.info("Exception occured")
          logger.info(e)
          render json: { errors: { user: 'invalid token', e: e } }, status: :unprocessable_entity
        end
      end
    end

    def authorize_admin!
      if !@user.is_admin?
        render json: { errors: { user: 'unauthorized' } }, status: :unprocessable_entity
      end
    end

    def authenticate_member!
      token = request.headers["X-KOINS-PWA-TOKEN"]

      if token.blank?
       
        render json: { errors: { user: 'token required' } }, status: :unprocessable_entity
      else
        begin
          decoded = JWT.decode(token, Rails.application.secret_key_base)
          id      = decoded.first["id"]

          @member = ReadOnlyMember.find_by_id(id)

          if @member.blank?
            render json: { errors: { user: 'user not found' } }, status: :unprocessable_entity
          end
        rescue Exception => e
          logger.info("Exception occured")
          logger.info(e)
          render json: { errors: { user: 'invalid token', e: e } }, status: :unprocessable_entity
        end
      end
    end
  end
end
