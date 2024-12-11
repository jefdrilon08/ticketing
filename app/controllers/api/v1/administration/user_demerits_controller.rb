module Api
  module V1
    module Administration
      class UserDemeritsController < ApplicationController
        before_action :authenticate_user!

        def approve
          user_demerit  = UserDemerit.where(id: params[:id]).first
          user          = current_user

          config  = {
            user_demerit: user_demerit,
            user: user
          }

          errors  = ::UserDemerits::ValidateApprove.new(
                      config: config
                    ).execute!

          if errors[:full_messages].any?
            render json: { errors: errors[:full_messages] }, status: 400
          else
            ::UserDemerits::Approve.new(
              config: config
            ).execute!

            render json: { message: "ok" }
          end
        end
      end
    end
  end
end
