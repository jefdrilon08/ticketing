class ProcessForgotPassword < ApplicationJob
  queue_as :operations

  def perform(args)
    user = User.find_by_email(args[:email])

    ::Users::ForgotPassword.new(
      user: user
    ).execute!
  end
end
