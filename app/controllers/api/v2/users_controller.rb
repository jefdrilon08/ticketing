module Api
  module V2
    class UsersController < ApiController
      def login
        username  = params[:username]
        password  = params[:password]
        user_type = params[:user_type]

        validator = ::Users::ValidateApiLogin.new(
                      username: username,
                      password: password,
                      user_type: user_type
                    )

        validator.execute!

        if validator.errors[:full_messages].any?
          render json: { errors: validator.errors[:full_messages] }, status: 403
        else
          authenticator = ::Users::AuthenticateUser.new(
                            username: username,
                            password: password,
                            user_type: user_type
                          )

          authenticator.execute!

          if authenticator.valid?
            render  json: { 
                      access_token: authenticator.access_token, 
                      roles: authenticator.roles,
                      username: authenticator.username,
                      user_type: user_type,
                      first_name: authenticator.first_name,
                      last_name: authenticator.last_name,
                      branches: authenticator.branches,
                      status: authenticator.status,
                      branch: {
                        id: authenticator.branch.try(:id),
                        name: authenticator.branch.try(:name)
                      },
                      center: {
                        id: authenticator.center.try(:id),
                        name: authenticator.center.try(:name)
                      }
                    }
          else
            render json: { errors: ["invalid login"] }, status: 403
          end
        end
      end
    end
  end
end
