class ProcessReceivePaymentApi < ApplicationJob
  queue_as :default

  def perform(payments)
    # raise payments.count.inspect

    payments.each do |payment|
      @branch_id                = payment["branch_id"]
      @collection_date          = payment["collection_date"].to_date
      @user                     = payment["user"]
      @prepared_by              = User.find(@user)
      @data                     = payment["data"]

      @default_deposit_accounts = Settings.default_deposit_accounts

      @insurance_fund_transfer_collection = ::InsuranceFundTransferCollections::CreateInsuranceFundTransferCollection.new(
        config: {
          collection_date: @collection_date,
          user: @prepared_by,
          branch_id: @branch_id
        }
      ).execute!

      @a_data = @insurance_fund_transfer_collection.data.with_indifferent_access
    
      create_record
      @insurance_fund_transfer_collection
    end
  end

  private
  
  def recompute_totals!
    @insurance_fund_transfer_collection = InsuranceFundTransferCollection.find(@insurance_fund_transfer_collection.id)
   
    r_config = {
      current_member: {
        id: @member.id
      },
      data: @insurance_fund_transfer_collection.data.with_indifferent_access,
      user: @user,
      insurance_fund_transfer_collection: @insurance_fund_transfer_collection
    } 

    data  = ::InsuranceFundTransferCollections::RecomputeTotals.new(
      config: r_config
    ).execute!
    
    @insurance_fund_transfer_collection.update!(data: data)

    @insurance_fund_transfer_collection
  end

  def create_record
    @data.each do |data|
      @member = Member.find_by(identification_number: data['identification_number'])

      @member_object = {
        id: @member.id,
        full_name: @member.full_name,
        first_name: @member.first_name,
        middle_name: @member.middle_name,
        last_name: @member.last_name,
        identification_number: @member.identification_number
      }

      @total_collected = 0.00
      @records = []
      @default_deposit_accounts.each_with_index do |o, i|
        member_account  = MemberAccount.where(member_id: @member.id, account_subtype: o.account_subtype, account_type: o.account_type).first
        enabled         = false

        if member_account
          enabled = true
        end

        # raise member_account.inspect
        if o[:account_subtype] == 'Life Insurance Fund'
          amount = data['lif_amount']
          reference_num = data['reference_num']
        elsif o[:account_subtype] == 'Retirement Fund'
          amount = data['rf_amount']
          reference_num = data['reference_num']
        else
          amount = 0.00
        end
          
        record_type = o.account_type
      
        @records << {
          amount: amount,
          enabled: enabled,
          member_id: @member.id,
          record_type: o.account_type,
          account_subtype: o.account_subtype,
          member_account_id: member_account.try(:id),
          reference_num: reference_num
        }

        @total_collected += amount.to_f
      end

      @a_data[:records] << {
        member: @member_object,
        records: @records,
        total_collected: @total_collected
      }

      @insurance_fund_transfer_collection.update!(
        data: @a_data
      )
      recompute_totals!  
    end
    @insurance_fund_transfer_collection.save!
  end
end
