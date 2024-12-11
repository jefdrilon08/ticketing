module Messages
  class BuildMessage
    attr_accessor :message,
                  :member,
                  :data

    def initialize(message:)
      @message  = message
      @member   = @message.member
      @user     = User.find_by_id(@message.user_id)

      @data = {
        id: @message.id,
        topic: @message.topic,
        content: @message.content,
        updated_at: @message.updated_at.strftime("%b %d %Y, %H:%M"),
        user_id: @message.user_id,
        member_id: @member.id,
        first_name: @member.first_name,
        middle_name: @member.middle_name,
        last_name: @member.last_name,
        identification_number: @member.identification_number,
        user_first_name: @user.try(:first_name),
        user_last_name: @user.try(:last_name)
      }
    end

    def execute!
      @data
    end
  end
end
