module Administration
  module SurveyQuestions
    class ValidateSave < AppValidator
      def initialize(config:)
        super()

        @config     = config
        @id         = @config[:id]
        @survey_id  = @config[:survey_id]
        @data       = @config[:data]
        @user       = @config[:user]

        @survey = Survey.where(id: @survey_id).first
      end

      def execute!
        if @user.blank?
          @errors[:messages] << {
            key: "user",
            message: "User not found"
          }
        end

        # Validate content
        if @data[:content].blank?
          @errors[:messages] << {
            key: "content",
            message: "content required"
          }
        end

        # Validate options
        if @data[:question_type].present? && @data[:question_type] == "options" && @data[:data][:options].size == 0
          @errors[:messages] << {
            key: "options",
            message: "options required"
          }
        end

        if @data[:question_type].present? && @data[:question_type] == "options" && @data[:data][:options].any?
          @data[:data][:options].each_with_index do |o, i|
            if o[:content].blank?
              @errors[:messages] << {
                key: "option_#{i}",
                message: "option #{i + 1} content required"
              }
            end
          end
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
