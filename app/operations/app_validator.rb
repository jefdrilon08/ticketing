class AppValidator
  attr_accessor :errors

  def initialize
    @errors = {
      messages: [],
      full_messages: []
    }
  end

  def build_full_messages!
    @errors[:messages].each do |o|
      @errors[:full_messages] << o[:message]
    end
  end

  def not_yet_implemented!
    @errors[:messages] << {
      key: "system",
      message: "not yet implemented"
    }
  end

  def messages
    @errors[:full_messages]
  end
end
