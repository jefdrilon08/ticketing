module Users
  class ForgotPassword
    attr_accessor :user

    def initialize(user:)
      @user   = user
      @email  = user.email
    end

    def execute!
      @user.update!(
        verification_token: SecureRandom.uuid
      )

      sender    = ENV['EMAIL_SENDER']
      recipient = @user.email
      encoding  = "UTF-8"
      subject   = '[KOINS] Forgot Password'
      reset_url = "#{ENV['BASE_URL']}/forgot_password?verification_token=#{@user.verification_token}"

      htmlbody = <<~HEREDOC
        <h1>Forgot Password</h1>

        <p>
          Please click <a href="#{reset_url}" target="_blank">here</a> to reset your password.
        </p>
      HEREDOC

      ses = Aws::SES::Client.new(
        region: ENV['AWS_REGION'],
        credentials: Aws::Credentials.new(
          ENV['AWS_ACCESS_KEY_ID'], 
          ENV['AWS_SECRET_ACCESS_KEY_ID']
        )
      )

      begin
        Rails.logger.info("Sending forgot password email to #{recipient}")

        ses.send_email(
          destination: {
            to_addresses: [
              recipient
            ]
          },
          source: sender,
          message: {
            subject: {
              charset: encoding,
              data: subject
            },
            body: {
              html: {
                charset: encoding,
                data: htmlbody
              }
            }
          }
        )
      rescue Aws::SES::Errors::ServiceError => error
        Rails.logger.error("Email not sent. Error message: #{error}")
      end
    end
  end
end
