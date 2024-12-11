module Administration
  module SurveyQuestions
    class ValidateDelete < AppValidator
      def initialize(config:)
        super()

        @config           = config
        @survey_question  = @config[:survey_question]
        @user             = @config[:user]
      end

      def execute!
        if @user.blank?
          @errors[:messages] << {
            key: "user",
            message: "User not found"
          }
        end
        
        if @survey_question.blank?
          @errors[:messages] << {
            key: "survey_question",
            message: "Question not found"
          }
        end

        #not_yet_implemented!

        @errors[:messages].each do |m|
          @errors[:full_messages] << m[:message]
        end

        @errors
      end
    end
  end
end
