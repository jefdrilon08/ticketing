module Messages
  class ValidateReply
    attr_accessor :message,
                  :reply,
                  :errors

    def initialize(message:, reply:)
      @message  = message
      @reply    = reply
      @errors   = {}
    end

    def execute!
      if @message.blank?
        @errors['message'] = "Message is required"
      end

      if @reply.blank?
        @errors["reply"] = "Reply is required"
      end

      @errors
    end
  end
end
