module Branches
  class ComputeAccountingEntriesSummary
    def initialize(config:)
      @config = config

      @branch     = @config[:branch]
      @book       = @config[:book]
      @start_date = @config[:start_date]
      @end_date   = @config[:end_date]
      @cluster    = @branch.cluster
      @area       = @cluster.area

      @accounting_codes = AccountingCode.all.order("code ASC")

      @journal_entries  = JournalEntry.joins(:accounting_entry).where(
                            "accounting_entries.branch_id = ? AND accounting_entries.date_posted >= ? AND accounting_entries.date_posted <= ? AND accounting_entries.book = ?",
                            @branch.id,
                            @start_date,
                            @end_date,
                            @book
                          )

      @data = {
        branch: {
          id: @branch.id,
          name: @branch.name
        },
        cluster: {
          id: @cluster.id,
          name: @cluster.name
        },
        area: {
          id: @area.id,
          name: @area.name
        },
        start_date: @start_date,
        end_date: @end_date,
        book: @book,
        records: [],
        total_debit: 0.00,
        total_credit: 0.00
      }
    end

    def execute!
      # AccountingCode.select("code, (#{JournalEntry.select("SUM(amount)").where("journal_entries.accounting_code_id = accounting_codes.id").where(post_type: 'DR').to_sql}) AS debit, (#{JournalEntry.select("SUM(amount)").where("journal_entries.accounting_code_id = accounting_codes.id").where(post_type: 'CR').to_sql}) AS credit").map { |ac| { accounting_code: ac.code, debit: ac.debit, credit: ac.credit } }

      @accounting_codes.each do |a|
        d = {
          accounting_code: a,
          debit: 0.00,
          credit: 0.00
        }

        d[:debit]   = @journal_entries.where(accounting_code_id: a.id, post_type: 'DR').sum(:amount).round(2)
        d[:credit]  = @journal_entries.where(accounting_code_id: a.id, post_type: 'CR').sum(:amount).round(2)

        if d[:debit] != 0 || d[:credit] != 0
          @data[:records] << d
        end
      end

      @data[:total_debit]   = @journal_entries.where(post_type: 'DR').sum(:amount).round(2)
      @data[:total_credit]  = @journal_entries.where(post_type: 'CR').sum(:amount).round(2)

      @data
    end
  end
end
