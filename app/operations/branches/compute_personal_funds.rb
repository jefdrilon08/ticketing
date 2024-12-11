module Branches
  class ComputePersonalFunds
    def initialize(config:)
      @config = config

      @branch   = @config[:branch]
      @as_of    = @config[:as_of].try(:to_date) || Date.today
      @cluster  = @branch.cluster
      @area     = @cluster.area

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
        as_of: @as_of,
        records: [],
        total: 0.00
      }

      @cmd  = ::Turkey::ComputePersonalFunds.new(
                branch: @branch,
                as_of: @as_of
              )
    end

    def execute!
      compute_records!

      @data[:officers]  = @data[:records].map{ |mr| mr[:officer] }.uniq
      @data[:centers]   = @data[:records].map{ |mr| mr[:center] }.uniq

      @data
    end

    private

    def compute_records!
      @result   = @cmd.run
      @accounts = @cmd.accounts

      @result.chunk{ |r| r.fetch("member_id") }.each do |member_id, member_txs|
        last_tx = member_txs.first

        temp_data = {
          member: {
            id: last_tx.fetch("member_id"),
            first_name: last_tx.fetch("first_name"),
            middle_name: last_tx.fetch("middle_name"),
            last_name: last_tx.fetch("last_name"),
            identification_number: last_tx.fetch("member_identification_number"),
            status: last_tx.fetch("member_status")
          },
          as_of: @as_of,
          branch: {
            id: @branch.id,
            name: @branch.name
          },
          center: {
            id: last_tx.fetch("center_id"),
            name: last_tx.fetch("center_name")
          },
          officer: {
            id: last_tx.fetch("officer_id"),
            first_name: last_tx.fetch("officer_first_name"),
            last_name: last_tx.fetch("officer_last_name"),
            identification_number: last_tx.fetch("officer_identification_number")
          },
          total: 0.00,
          accounts: []
        }

        @cmd.accounts.each do |_, subtype|
          account = {
            id: "",
            account_type: "",
            account_subtype: subtype,
            member_id: "",
            balance: 0.00,
            account_transaction_id: "",
            transacted_at: ""
          }

          if (tx = member_txs.find{ |tx| tx.fetch("account_subtype") == subtype })
            account[:id]                      = tx.fetch("member_account_id")
            account[:account_type]            = tx.fetch("account_type")
            account[:account_subtype]         = tx.fetch("account_subtype")
            account[:member_id]               = tx.fetch("member_id")
            account[:balance]                 = tx.fetch("ending_balance").to_f.round(2)
            account[:account_transaction_id]  = tx.fetch("account_transaction_id")
            account[:transacted_at]           = tx.fetch("transacted_at")
          end

          temp_data[:accounts] << account

          temp_data[:total] += account[:balance]
          @data[:total] += account[:balance]
        end

        @data[:records] << temp_data
      end
    end
  end
end
