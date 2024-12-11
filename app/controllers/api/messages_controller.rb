module Api
  class MessagesController < ::Api::FrontController
    before_action :authenticate_user_or_member!

    def index
      messages  = Message.joins(:member).joins("LEFT OUTER JOIN users ON users.id = messages.user_id").select(
                    "messages.id AS id, messages.topic, messages.user_id, users.first_name AS user_first_name, users.last_name AS user_last_name, messages.content, messages.status, messages.member_id, members.first_name, members.last_name, members.middle_name, messages.updated_at, messages.message_id"
                  ).where(
                    "messages.message_id IS NULL"
                  )

      if @member.present?
        messages  = messages.where(member_id: @member.id)
      elsif @user.present?
        messages  = messages
      end

      messages  = messages.order("updated_at DESC")

      messages  = messages.map{ |o|
                    if o.user_id.blank?
                      user_first_name = o.first_name
                      user_last_name  = o.last_name
                    else
                      user_first_name = o.user_first_name
                      user_last_name  = o.user_last_name
                    end

                    {
                      id: o.id,
                      topic: o.topic,
                      first_name: o.first_name,
                      middle_name: o.middle_name,
                      last_name: o.last_name,
                      status: o.status,
                      content: o.content,
                      user_first_name: user_first_name,
                      user_last_name: user_last_name,
                      updated_at: o.updated_at.strftime("%b %d, %Y %H:%m")
                    }
                  }

      render json: { messages: messages }
    end

    def replies
      message = Message.find(params[:id])

      replies = Message.where(
                  message_id: message.id
                ).order(
                  "updated_at ASC"
                ).map{ |o|
                  cmd = ::Messages::BuildMessage.new(
                          message: o
                        )

                  cmd.execute!

                  cmd.data
                }

      render json: { replies: replies }
    end

    def reply
      message = Message.find(params[:id])
      reply   = params[:reply]

      validator = ::Messages::ValidateReply.new(
                    message: message,
                    reply: reply
                  )

      validator.execute!

      if validator.errors.any?
        render json: { errors: validator.errors }, status: :unprocessable_entity
      else
        cmd = ::Messages::Reply.new(
                message: message,
                reply: reply,
                user: @user
              )

        cmd.execute!

        reply_message = cmd.reply_message

        cmd = ::Messages::BuildMessage.new(
                message: reply_message
              )

        cmd.execute!

        render json: { message: cmd.data }
      end
    end

    def show
      message = Message.find_by_id(params[:id])

      cmd = ::Messages::BuildMessage.new(
              message: message
            )

      cmd.execute!

      render json: { message: cmd.data }
    end

    def create
      topic     = params[:topic]
      content   = params[:content]
      member_id = params[:member_id]

      validator = ::Messages::ValidateCreate.new(
                    topic: topic,
                    content: content
                  )

      validator.execute!

      if validator.errors.any?
        render json: { errors: validator.errors }, status: :unprocessable_entity
      else
        if @user.present? and member_id.present?
          @member = ReadOnlyMember.find(member_id)
        end

        cmd = ::Messages::Create.new(
                topic: topic,
                content: content,
                member: @member,
                user: @user
              )

        cmd.execute!

        render json: { id: cmd.message.id }
      end
    end
  end
end
