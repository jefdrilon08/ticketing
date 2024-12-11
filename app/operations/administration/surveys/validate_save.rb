module Administration
  module Surveys
    class ValidateSave < AppValidator
      def initialize(config:)
        super()

        @config = config
        @user   = @config[:user]
        @id     = @config[:id]
        @name   = @config[:name]
      end

      def execute!
        if @id.present?
          @survey = Survey.where(id: @id).first
        else
          if @name.blank?
            @errors[:messages] << {
              key: "name",
              message: "name required"
            }
          end
        end

        if @survey.present? && @name.present? && Survey.where(name: @name).count > 0
          @errors[:messages] << {
            key: "name",
            message: "name already taken"
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
