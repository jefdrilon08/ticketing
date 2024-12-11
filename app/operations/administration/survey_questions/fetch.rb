module Administration
  module SurveyQuestions
    class Fetch
      def initialize(config:)
        @config = config
        @survey = Survey.find(@config[:survey_id])

        @survey_question  = SurveyQuestion.where(id: @config[:id]).first

        if @survey_question.blank?
          @survey_question  = SurveyQuestion.new(
                                survey: @survey
                              )
        end
      end

      def execute!
        @data = {
          id: @survey.id,
          content: @survey_question.content || "",
          question_type: @survey_question.question_type || "options",
          priority: @survey_question.priority || 0,
          data: @survey_question.data || build_new_data!
        }

        @data
      end

      private

      def build_new_data!
        {
          options: []
        }
      end
    end
  end
end
