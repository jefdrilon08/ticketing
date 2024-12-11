module Branches
  class ComputeSoaLoans
    def initialize(config:)
      @config = config

      @branch       = @config[:branch]
      @start_date   = @config[:start_date]
      @end_date     = @config[:end_date]

      @payments = ReportingDbAccountTransaction.approved_loan_payments.where(
                    "DATE(transacted_at) >= ? AND DATE(transacted_at) <= ? AND subsidiary_type = ?",
                    @start_date,
                    @end_date,
                    "Loan"
                  ).order("transacted_at ASC")

      loan_ids  = @payments.pluck(:subsidiary_id)

      @loans  = ReportingDbLoan.active_or_paid.where(
                  id: loan_ids,
                  branch: @branch.id
                )

      @payments = @payments.where(subsidiary_id: @loans.pluck(:id))

      @data = {
        start_date: @start_date,
        end_date: @end_date,
        branch: {
          id: @branch.id,
          name: @branch.name
        },
        records: [],
        centers: [],
        loan_products: []
      }
    end

    def execute!
      # Setup centers
      @data[:centers] = ReportingDbCenter.where(id: @loans.pluck(:center_id).uniq).order("name ASC").map{ |o| { id: o.id, name: o.name } }

      # Setup loan_products
      @data[:loan_products] = ReportingDbLoanProduct.where(id: @loans.pluck(:loan_product_id).uniq).order("priority ASC").map{ |o| { id: o.id, name: o.name } }

      # Setup records
      @loans.each do |loan|
        @data[:records] << build_loan_object(loan)
      end

      @data
    end

    private

    def build_loan_object(loan)
      member        = loan.member
      branch        = loan.branch
      center        = loan.center
      loan_product  = loan.loan_product

      officer = center.user

      data  = {
        loan: {
          id: loan.id,
          principal: loan.principal,
          interest: loan.interest,
          member_id: member.id,
          branch_id: branch.id,
          center_id: center.id,
          loan_product_id: loan_product.id,
          date_approved: loan.date_approved.strftime("%B %d, %Y"),
        },
        member: {
          id: member.id,
          first_name: member.first_name,
          last_name: member.last_name,
          middle_name: member.middle_name,
          identification_number: member.identification_number
        },
        branch: {
          id: branch.id,
          name: branch.name
        },
        center: {
          id: center.id,
          name: center.name
        },
        officer: {
          id: officer.id,
          first_name: officer.first_name,
          last_name: officer.last_name,
          full_name: "#{officer.last_name}, #{officer.first_name}"
        },
        loan_product: {
          id: loan_product.id,
          name: loan_product.name
        },
        records: [],
        total_principal_paid: 0.00,
        total_interest_paid: 0.00
      }

      data[:records]  = @payments.select{ |o| o.subsidiary_id == loan.id }.map{ |t|
                          {
                            id: t.id,
                            date: t.transacted_at.to_date.strftime("%B %d, %Y"),
                            principal_paid: t.data.with_indifferent_access[:total_principal_paid].try(:to_f).round(2),
                            interest_paid: t.data.with_indifferent_access[:total_interest_paid].try(:to_f).round(2)
                          }
                        }

      data[:records].each do |r|
        data[:total_principal_paid] += r[:principal_paid].try(:to_f).round(2)
        data[:total_interest_paid] += r[:interest_paid].try(:to_f).round(2)
      end

      data
    end
  end
end
