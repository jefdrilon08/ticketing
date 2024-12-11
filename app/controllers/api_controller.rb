class ApiController < ApplicationController
  protect_from_forgery with: :null_session

  def authenticate_app_request!
    if request.headers["X-KOINS-APP-AUTH-SECRET"].blank?

      render json: { message: "unauthenticated", full_messages: ["unauthenticated"] }, status: 400
    elsif request.headers["X-KOINS-APP-AUTH-SECRET"] != app_auth_secret
      render json: { message: "invalid auth token", full_messages: ["invalid auth token"] }, status: 400
    end
  end

  def authenticate_request!
    if access_token.blank?
      render json: { message: "unauthenticated" }, status: 400
    end
  end

  def authenticate_api_member!
    if access_token.blank?
      render json: { message: "unauthenticated" }, status: 400
    else
      @member = Member.find_by_access_token(access_token)
    end
  end

  def authenticate_core_user!
    if params[:user_id].blank?
      render json: { message: "user_id required" }, status: 400
    else
      @core_user = User.find_by_id(params[:user_id])

      if @core_user.blank?
        render json: { message: "core user not found" }
      end
    end
  end

  def app_auth_secret
    ENV['KOINS_APP_AUTH_SECRET']
  end

  def access_token
    request.headers["X-KOINS-ACCESS-TOKEN"]
  end
end
