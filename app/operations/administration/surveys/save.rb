module Administration
  module Surveys
    class Save
      def initialize(config:)
        @config = config
        @user   = @config[:user]
        @id     = @config[:id]
        @name   = @config[:name]

        @data   = @config[:data]
      end

      def execute!
        @survey = Survey.new(
                    name: @name,
                    data: {
                      questions: [],
                      created_by: {
                        first_name: @user.first_name,
                        last_name: @user.last_name,
                        full_name: @user.full_name,
                        user_id: @user.id
                      }
                    }
                  )

        if @id.present?
          @survey       = Survey.find(@id)
          @survey.name  = @name
          @survey.data  = @data
        end

        @survey.save!

        @survey
      end
    end
  end
end
