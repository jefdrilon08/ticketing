module Branches
  class ComputeLoanCycleCountSummary
    def initialize(config:)
      @config = config

      @branch   = @config[:branch]
      @as_of    = @config[:as_of].try(:to_date) || Date.today
      @cluster  = @branch.cluster
      @area     = @cluster.area

      @loans  = ::Loans::FetchActiveAsOf.new(
                  config: {
                    as_of: @as_of,
                    branch: @branch
                  }
                ).execute!

      @members  = Member.active.where(id: @loans.pluck(:member_id).uniq)

      @loan_products  = LoanProduct.all.order("priority ASC")

      @data = {
        records: [],
        headers: ["Cycle"],
        totals: ["Total"]
      }

      @loan_products.each do |loan_product|
        @data[:headers] << loan_product.name
      end

      @data[:headers] << "Total"
    end

    def execute!
      # Get all loan_cycles objects
      loan_cycle_data = []

      @members.each do |member|
        data  = member.data.with_indifferent_access

        if data[:loan_cycles].present?
          data[:loan_cycles].each do |o|
            loan_cycle_data << {
              member: {
                id: member.id,
                first_name: member.first_name,
                middle_name: member.middle_name,
                last_name: member.last_name,
                identification_number: member.identification_number
              },
              loan_product_id: o[:loan_product_id],
              cycle: o[:cycle].try(:to_i)
            }
          end
        end
      end

      #@data[:loan_cycle_data] = loan_cycle_data

      cycle_counts  = loan_cycle_data.map{ |o| o[:cycle] }.uniq

      cycle_counts.sort.each do |c|
        data  = {
          cycle: c,
          loan_products: [],
          total: 0
        }

        @loan_products.each do |loan_product|
          records = loan_cycle_data.select{ |o| o[:loan_product_id] == loan_product.id and o[:cycle] == c }

          data[:loan_products] << {
            id: loan_product.id,
            name: loan_product.name,
            priority: loan_product.priority,
            records: records,
            count: records.size
          }

          data[:total] += records.size
        end

        @data[:records] << data
      end

      # compute totals
      grand_total = 0
      @loan_products.each do |loan_product|
        t = loan_cycle_data.select{ |o| o[:loan_product_id] == loan_product.id }.size

        @data[:totals] << t

        grand_total += t
      end

      @data[:totals] << grand_total

      @data
    end
  end
end
