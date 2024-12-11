module Messages
  class ValidateCreate
    attr_accessor :topic,
                  :content,
                  :errors

    def initialize(topic:, content:)
      @topic    = topic
      @content  = content

      @errors = {}
    end

    def execute!
      if @topic.blank?
        @errors['topic'] = 'Topic required'
      end

      if @content.blank?
        @errors['content'] = 'Content required'
      end
    end
  end
end
