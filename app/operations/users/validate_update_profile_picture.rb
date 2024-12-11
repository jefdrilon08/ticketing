module Users
  class ValidateUpdateProfilePicture < AppValidator
    attr_accessor :errors

    def initialize(profile_picture:)
      super()

      @profile_picture = profile_picture
    end

    def execute!
      if @profile_picture.blank?
        @errors[:messages] << {
          key: "profile_picture",
          message: "profile_picture required"
        }
      end

      #not_yet_implemented!

      @errors[:messages].each do |o|
        @errors[:full_messages] << o[:message]
      end

      @errors
    end
  end
end
