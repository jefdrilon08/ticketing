module Administration
  module Surveys
    class ValidateDelete < AppValidator
      def initialize(config:)
        super()

        @config = config
        @user   = @config[:user]
        @survey = @config[:survey]
      end

      def execute!
        if @survey.blank?
          @errors[:messages] << {
            key: "survey",
            message: "survey not found"
          }
        end

        # TODO: Authorization

        # TODO: Check if we have answers for this survey

        #not_yet_implemented!

        @errors[:messages].each do |m|
          @errors[:full_messages] << m[:message]
        end

        @errors
      end
    end
  end
end
