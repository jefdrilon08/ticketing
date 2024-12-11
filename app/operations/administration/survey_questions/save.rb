module Administration
  module SurveyQuestions
    class Save
      def initialize(config:)
        @config     = config
        @id         = @config[:id]
        @survey_id  = @config[:survey_id]
        @data       = @config[:data]
        @user       = @config[:user]

        @survey           = Survey.where(id: @survey_id).first
        @survey_question  = SurveyQuestion.where(id: @id).first

        if @survey_question.blank?
          @survey_question  = SurveyQuestion.new(
                                survey: @survey
                              )
        end
      end

      def execute!
        @survey_question.content        = @data[:content]
        @survey_question.priority       = @data[:priority]
        @survey_question.question_type  = @data[:question_type]
        @survey_question.data           = @data[:data]

        @survey_question.save!

        @survey_question
      end
    end
  end
end
