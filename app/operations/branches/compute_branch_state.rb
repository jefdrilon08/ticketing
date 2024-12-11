module Branches
  class ComputeBranchState
    def initialize(config:)
      @config = config

      @branch   = @config[:branch]
      @as_of    = @config[:as_of].try(:to_date) || Date.today
      @cluster  = @branch.cluster
      @area     = @cluster.area

      @data = {
        as_of: @as_of,
        num_loans: 0,
        num_members: 0,
        principal: 0.00,
        interest: 0.00,
        repayment_rate: nil,
        par: nil,
        principal_repayment_rate: nil,
        interest_repayment_rate: nil,
        total_principal_due: 0.00,
        total_interest_due: 0.00,
        total_due: 0.00,
        total_principal_balance: 0.00,
        total_interest_balance: 0.00,
        total_balance: 0.00,
        total_principal_portfolio: 0.00,
        total_interest_portfolio: 0.00,
        total_portfolio: 0.00,
        total_principal_paid: 0.00,
        total_interest_paid: 0.00,
        total_paid: 0.00,
        total_principal_paid_due: 0.00,
        total_interest_paid_due: 0.00,
        total_paid_due: 0.00,
        total_principal_past_due: 0.00,
        total_interest_past_due: 0.00,
        total_past_due: 0.00,
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
        loan_products: [],
        centers: []
      }
    end

    def execute!
      query!
      build_loan_products!
      build_centers!
      build_totals!

      @data
    end

    def build_totals!
      records = @cmd.data[:records]

      principal = records.inject(0) { |sum, hash| sum + hash[:principal] }.to_f.round(2)
      interest  = records.inject(0) { |sum, hash| sum + hash[:interest] }.to_f.round(2)

      total_principal_due = records.inject(0) { |sum, hash| sum + hash[:principal_due] }.to_f.round(2)
      total_interest_due  = records.inject(0) { |sum, hash| sum + hash[:interest_due] }.to_f.round(2)
      total_due           = (total_principal_due + total_interest_due).round(2)

      total_principal_balance = records.inject(0) { |sum, hash| sum + hash[:principal_balance] }.to_f.round(2)
      total_interest_balance  = records.inject(0) { |sum, hash| sum + hash[:interest_balance] }.to_f.round(2)
      total_balance           = (total_principal_balance + total_interest_balance).to_f.round(2)

      total_principal_paid  = records.inject(0) { |sum, hash| sum + hash[:principal_paid] }.to_f.round(2)
      total_interest_paid   = records.inject(0) { |sum, hash| sum + hash[:interest_paid] }.to_f.round(2)
      total_paid            = (total_principal_paid + total_interest_paid).to_f.round(2)

      total_principal_portfolio = (principal - total_principal_paid).to_f.round(2)
      total_interest_portfolio  = (interest - total_interest_paid).to_f.round(2)
      total_portfolio           = (total_principal_portfolio + total_interest_portfolio).to_f.round(2)

      total_principal_paid_due  = records.inject(0) { |sum, hash| sum + hash[:principal_paid_due] }.to_f.round(2)
      total_interest_paid_due   = records.inject(0) { |sum, hash| sum + hash[:interest_paid_due] }.to_f.round(2)
      total_paid_due            = (total_principal_paid_due + total_interest_paid_due).to_f.round(2)

      total_principal_past_due  = total_principal_balance > 0 ? total_principal_balance : 0.00
      total_interest_past_due   = total_interest_balance > 0 ? total_interest_balance : 0.00
      total_past_due            = (total_principal_past_due + total_interest_past_due).to_f.round(2)

      principal_repayment_rate  = total_principal_paid_due / total_principal_due
      interest_repayment_rate   = total_interest_paid_due / total_interest_due
      repayment_rate            = total_paid_due / total_due

      # Clean repayment rates
      if principal_repayment_rate > 1
        principal_repayment_rate = 1
      end

      if interest_repayment_rate > 1
        interest_repayment_rate = 1
      end

      if repayment_rate > 1
        repayment_rate = 1
      end

      # Compute for PAR
      par = total_principal_balance / principal
      
      @data[:num_loans]                 = records.size
      @data[:num_members]               = records.map{ |o| o[:member][:id] }.uniq.size
      @data[:principal]                 = principal
      @data[:interest]                  = interest
      @data[:principal_repayment_rate]  = principal_repayment_rate
      @data[:interest_repayment_rate]   = interest_repayment_rate
      @data[:repayment_rate]            = repayment_rate
      @data[:par]                       = par
      @data[:total_principal_due]       = total_principal_due
      @data[:total_interest_due]        = total_interest_due
      @data[:total_due]                 = total_due
      @data[:total_principal_balance]   = total_principal_balance
      @data[:total_interest_balance]    = total_interest_balance
      @data[:total_balance]             = total_balance
      @data[:total_principal_portfolio] = total_principal_portfolio
      @data[:total_interest_portfolio]  = total_interest_portfolio
      @data[:total_portfolio]           = total_portfolio
      @data[:total_principal_paid]      = total_principal_paid
      @data[:total_interest_paid]       = total_interest_paid
      @data[:total_paid]                = total_paid
      @data[:total_principal_paid_due]  = total_principal_paid_due
      @data[:total_interest_paid_due]   = total_interest_paid_due
      @data[:total_paid_due]            = total_paid_due
      @data[:total_principal_past_due]  = total_principal_past_due
      @data[:total_interest_past_due]   = total_interest_past_due
      @data[:total_past_due]            = total_past_due
    end

    def build_centers!
      @data[:centers] = @cmd.data[:records].group_by{ |o| o[:center] }.map{ |center, records|
                          principal = records.inject(0) { |sum, hash| sum + hash[:principal] }.to_f.round(2)
                          interest  = records.inject(0) { |sum, hash| sum + hash[:interest] }.to_f.round(2)

                          total_principal_due = records.inject(0) { |sum, hash| sum + hash[:principal_due] }.to_f.round(2)
                          total_interest_due  = records.inject(0) { |sum, hash| sum + hash[:interest_due] }.to_f.round(2)
                          total_due           = (total_principal_due + total_interest_due).round(2)

                          total_principal_balance = records.inject(0) { |sum, hash| sum + hash[:principal_balance] }.to_f.round(2)
                          total_interest_balance  = records.inject(0) { |sum, hash| sum + hash[:interest_balance] }.to_f.round(2)
                          total_balance           = (total_principal_balance + total_interest_balance).to_f.round(2)

                          total_principal_paid  = records.inject(0) { |sum, hash| sum + hash[:principal_paid] }.to_f.round(2)
                          total_interest_paid   = records.inject(0) { |sum, hash| sum + hash[:interest_paid] }.to_f.round(2)
                          total_paid            = (total_principal_paid + total_interest_paid).to_f.round(2)

                          total_principal_portfolio = (principal - total_principal_paid).to_f.round(2)
                          total_interest_portfolio  = (interest - total_interest_paid).to_f.round(2)
                          total_portfolio           = (total_principal_portfolio + total_interest_portfolio).to_f.round(2)

                          total_principal_paid_due  = records.inject(0) { |sum, hash| sum + hash[:principal_paid_due] }.to_f.round(2)
                          total_interest_paid_due   = records.inject(0) { |sum, hash| sum + hash[:interest_paid_due] }.to_f.round(2)
                          total_paid_due            = (total_principal_paid_due + total_interest_paid_due).to_f.round(2)

                          total_principal_past_due  = total_principal_balance > 0 ? total_principal_balance : 0.00
                          total_interest_past_due   = total_interest_balance > 0 ? total_interest_balance : 0.00
                          total_past_due            = (total_principal_past_due + total_interest_past_due).to_f.round(2)

                          principal_repayment_rate  = total_principal_paid_due / total_principal_due
                          interest_repayment_rate   = total_interest_paid_due / total_interest_due
                          repayment_rate            = total_paid_due / total_due

                          # Clean repayment rates
                          if principal_repayment_rate > 1
                            principal_repayment_rate = 1
                          end

                          if interest_repayment_rate > 1
                            interest_repayment_rate = 1
                          end

                          if repayment_rate > 1
                            repayment_rate = 1
                          end

                          # Compute for PAR
                          par = total_principal_balance / principal

                          {
                            as_of: @as_of,
                            num_loans: records.size,
                            num_members: records.map{ |o| o[:member][:id] }.uniq.size,
                            principal: principal,
                            interest: interest,
                            principal_repayment_rate: principal_repayment_rate,
                            interest_repayment_rate: interest_repayment_rate,
                            repayment_rate: repayment_rate,
                            par: par,
                            total_principal_due: total_principal_due,
                            total_interest_due: total_interest_due,
                            total_due: total_due,
                            total_principal_balance: total_principal_balance,
                            total_interest_balance: total_interest_balance,
                            total_balance: total_balance,
                            total_principal_portfolio: total_principal_portfolio,
                            total_interest_portfolio: total_interest_portfolio,
                            total_portfolio: total_portfolio,
                            total_principal_paid: total_principal_paid,
                            total_interest_paid: total_interest_paid,
                            total_paid: total_paid,
                            total_principal_paid_due: total_principal_paid_due,
                            total_interest_paid_due: total_interest_paid_due,
                            total_paid_due: total_paid_due,
                            total_principal_past_due: total_principal_past_due,
                            total_interest_past_due: total_interest_past_due,
                            total_past_due: total_past_due,
                            center: {
                              id: center[:id],
                              name: center[:name]
                            },
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
                            loans: records
                          }
                        }
    end

    def build_loan_products!
      @data[:loan_products] = @cmd.data[:records].group_by{ |o| o[:loan_product] }.map{ |loan_product, records|
                                principal = records.inject(0) { |sum, hash| sum + hash[:principal] }.to_f.round(2)
                                interest  = records.inject(0) { |sum, hash| sum + hash[:interest] }.to_f.round(2)

                                total_principal_due = records.inject(0) { |sum, hash| sum + hash[:principal_due] }.to_f.round(2)
                                total_interest_due  = records.inject(0) { |sum, hash| sum + hash[:interest_due] }.to_f.round(2)
                                total_due           = (total_principal_due + total_interest_due).round(2)

                                total_principal_balance = records.inject(0) { |sum, hash| sum + hash[:principal_balance] }.to_f.round(2)
                                total_interest_balance  = records.inject(0) { |sum, hash| sum + hash[:interest_balance] }.to_f.round(2)
                                total_balance           = (total_principal_balance + total_interest_balance).to_f.round(2)

                                total_principal_paid  = records.inject(0) { |sum, hash| sum + hash[:principal_paid] }.to_f.round(2)
                                total_interest_paid   = records.inject(0) { |sum, hash| sum + hash[:interest_paid] }.to_f.round(2)
                                total_paid            = (total_principal_paid + total_interest_paid).to_f.round(2)

                                total_principal_portfolio = (principal - total_principal_paid).to_f.round(2)
                                total_interest_portfolio  = (interest - total_interest_paid).to_f.round(2)
                                total_portfolio           = (total_principal_portfolio + total_interest_portfolio).to_f.round(2)

                                total_principal_paid_due  = records.inject(0) { |sum, hash| sum + hash[:principal_paid_due] }.to_f.round(2)
                                total_interest_paid_due   = records.inject(0) { |sum, hash| sum + hash[:interest_paid_due] }.to_f.round(2)
                                total_paid_due            = (total_principal_paid_due + total_interest_paid_due).to_f.round(2)

                                total_principal_past_due  = total_principal_balance > 0 ? total_principal_balance : 0.00
                                total_interest_past_due   = total_interest_balance > 0 ? total_interest_balance : 0.00
                                total_past_due            = (total_principal_past_due + total_interest_past_due).to_f.round(2)

                                principal_repayment_rate  = total_principal_paid_due / total_principal_due
                                interest_repayment_rate   = total_interest_paid_due / total_interest_due
                                repayment_rate            = total_paid_due / total_due

                                # Clean repayment rates
                                if principal_repayment_rate > 1
                                  principal_repayment_rate = 1
                                end

                                if interest_repayment_rate > 1
                                  interest_repayment_rate = 1
                                end

                                if repayment_rate > 1
                                  repayment_rate = 1
                                end

                                # Compute for PAR
                                par = total_principal_balance / principal

                                {
                                  as_of: @as_of,
                                  num_loans: records.size,
                                  num_members: records.map{ |o| o[:member][:id] }.uniq.size,
                                  principal: principal,
                                  interest: interest,
                                  principal_repayment_rate: principal_repayment_rate,
                                  interest_repayment_rate: interest_repayment_rate,
                                  repayment_rate: repayment_rate,
                                  par: par,
                                  total_principal_due: total_principal_due,
                                  total_interest_due: total_interest_due,
                                  total_due: total_due,
                                  total_principal_balance: total_principal_balance,
                                  total_interest_balance: total_interest_balance,
                                  total_balance: total_balance,
                                  total_principal_portfolio: total_principal_portfolio,
                                  total_interest_portfolio: total_interest_portfolio,
                                  total_portfolio: total_portfolio,
                                  total_principal_paid: total_principal_paid,
                                  total_interest_paid: total_interest_paid,
                                  total_paid: total_paid,
                                  total_principal_paid_due: total_principal_paid_due,
                                  total_interest_paid_due: total_interest_paid_due,
                                  total_paid_due: total_paid_due,
                                  total_principal_past_due: total_principal_past_due,
                                  total_interest_past_due: total_interest_past_due,
                                  total_past_due: total_past_due,
                                  loan_product: {
                                    id: loan_product[:id],
                                    name: loan_product[:name]
                                  },
                                  loans: records
                                }
                              }
    end

    def query!
      @cmd  = ::Branches::ComputeRr.new(
                config: {
                  branch: @branch,
                  as_of: @as_of
                }
              )

      @cmd.execute!
    end
  end
end
