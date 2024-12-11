module Messages
  class Create
    attr_accessor :topic,
                  :content,
                  :member,
                  :user,
                  :message

    def initialize(topic:, content:, member:, user:)
      @topic    = topic
      @content  = content
      @member   = member
      @user     = user
    end

    def execute!
      @message  = Message.new(
                    topic: @topic,
                    content: @content,
                    member: @member,
                    user: @user
                  )

      @message.save!

      @message
    end
  end
end
