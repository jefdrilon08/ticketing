module Utils
  class GetCurrentDate
    def initialize(config:)
      @config = config
      @branch = @config[:branch]

      if Settings.try(:defaults).try(:default_branch).try(:id).present?
        @branch = Branch.where(id: Settings.try(:defaults).try(:default_branch).try(:id)).first
      end 
    end

    def execute!
      if @branch.present? and @branch.current_date.present?
        @branch.current_date.to_date
      else
        Date.today
      end
    end
  end
end
