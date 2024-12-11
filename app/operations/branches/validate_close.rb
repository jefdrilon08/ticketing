module Branches
  class ValidateClose
    attr_accessor :errors

    def initialize(branch:, closing_date:)
      @branch       = branch
      @closing_date = closing_date

      @errors = []
    end

    def execute!

      if @branch.blank?
        @errors << "Branch not found"
      end

      if @closing_date.blank?
        @errors << "Closing date required"
      end

      if @branch.present? and @closing_date.present?
        records = ::ClosingRecords::FetchClosingRecords.new(
          branch: @branch,
          closing_date: @closing_date
        ).execute!

        num_done = 0
        records.each do |o|
          if o[:status] == "done"
            num_done += 1
          end
        end

        if num_done != records.size
          @errors << "Records missing"
        end

        existing_record = BranchPsrRecord.where(
          branch:         @branch,
          closing_month:  @closing_date.month,
          closing_year:   @closing_date.year
        ).first

        if existing_record.present?
          @errors << "Branch already closed"
        end
      end

      #@errors << "Not yet implemented"

      @errors
    end
  end
end
