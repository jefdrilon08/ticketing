module Branches
  class ComputeSoaFunds
    attr_reader :settings, :data

    def initialize(config:)
      @config     = config
      @start_date = @config[:start_date].to_date
      @end_date   = @config[:end_date].to_date
      @branch     = @config[:branch]

      @cmd  = ::Turkey::ComputeSoaFunds.new(
                branch: @branch,
                from: @start_date,
                to: @end_date
              )

      @settings = @cmd.accounts.map{ |o|
                    {
                      account_subtype: o[1],
                      account_type: Settings.default_member_accounts.select{ |s| s[:account_subtype] == o[1] }.first[:account_type]
                    }
                  }

      @data = {
        start_date: @start_date,
        end_date: @end_date,
        branch: {
          id: @branch.id,
          name: @branch.name
        },
        settings: @settings,
        records: [],
        centers: [],
        officers: [],
        total: []
      }
    end

    def execute!
      @result = @cmd.run

      @result.chunk{ |r| 
        {
          member: {
            id: r.fetch("member_id" ), 
            first_name: r.fetch("first_name"), 
            middle_name: r.fetch("middle_name"), 
            last_name: r.fetch("last_name"), 
            full_name: "#{r.fetch("last_name")}, #{r.fetch("first_name")} #{r.fetch("middle_name")}",
          },
          branch: {
            id: @branch.id,
            name: @branch.name
          },
          center: {
            id: r.fetch("center_id"),
            name: r.fetch("center_name")
          },
          officer: {
            id: r.fetch("officer_id"),
            first_name: r.fetch("officer_first_name"),
            last_name: r.fetch("officer_last_name"),
            full_name: "#{r.fetch("officer_last_name")}, #{r.fetch("officer_first_name")}"
          },
          records: [],
          totals: []
        } 
      }.each do |temp_data, member_txs|
        member_data = temp_data

        member_txs.group_by{ |tx| tx["transacted_at"] }.each do |transacted_at, txs|
          date  = transacted_at.to_date
          record_object = {
            date: date,
            records: []
          }

          @cmd.accounts.each do |_, subtype|

            debit   = 0.00
            credit  = 0.00

            #tx = txs.find{ |tx| tx.fetch("account_subtype") == subtype }
            txs.find{ |tx| tx.fetch("account_subtype") == subtype }

            txs.select{ |tx| tx.fetch("account_subtype") == subtype }.each do |tx|
              if tx.try(:fetch, "transaction_type") == "withdraw"
                debit += tx.fetch("amount").to_f.round(2)
              end

              if tx.try(:fetch, "transaction_type") == "deposit"
                credit += tx.fetch("amount").to_f.round(2)
              end
            end

            rr = {
              member_account_id: "",
              account_type: @settings.select{ |x| x[:account_subtype] == subtype }.first[:account_type],
              account_subtype: subtype,
              debit: debit,
              credit: credit,
              date: date
            }

            record_object[:records] << rr
          end

          member_data[:records] << record_object
        end

        last_tx = member_txs.last # using `#first` because sorted in reverse

        @cmd.accounts.each do |key, _|
          member_data[:totals] << {
            debit: last_tx.fetch("#{key}_debit"),
            credit: last_tx.fetch("#{key}_credit")
          }
        end

        @data[:records] << member_data
      end

      # Setup centers
      centers = Center.where(
                  branch_id: @branch.id
                ).order("name ASC")

      @data[:centers] = centers.map{ |o| { id: o.id, name: o.name } }

      # Setup officers
      @data[:officers]  = User.where(id: centers.pluck(:user_id).uniq).order("last_name ASC").map{ |o|
                            {
                              id: o.id,
                              first_name: o.first_name,
                              last_name: o.last_name,
                              full_name: "#{o.last_name}, #{o.first_name}"
                            }
                          }

      @data
    end
  end
end
