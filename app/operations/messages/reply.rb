module Messages
  class Reply
    attr_accessor :message,
                  :reply,
                  :reply_message

    def initialize(message:, reply:, user:)
      @message  = message
      @reply    = reply
      @user     = user
      @member   = @message.member
    end

    def execute!
      @reply_message  = Message.new(
                          message: @message,
                          content: @reply,
                          user: @user,
                          member: @member
                        )

      @reply_message.save!
    end
  end
end
