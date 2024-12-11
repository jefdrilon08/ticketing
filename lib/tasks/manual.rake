namespace :manual do
  task :deposit => :environment do
    dait_paid         = ENV['DATE_PAID'].to_date
    user_id           = ENV['USER_ID']
    member_account_id = ENV['MEMBER_ACCOUNT_ID']
    amount            = ENV['AMOUNT'].to_f.round(2)
    is_interest       = ENV['IS_INTEREST'].present? ? true : false
    transaction_type  = ENV['TRANSACTION_TYPE']

    member_account  = MemberAccount.find(member_account_id)
    member          = member_account.member
    user            = User.find(user_id)

    account_transaction = AccountTransaction.new(
                            subsidiary_id: member_account_id,
                            subsidiary_type: 'MemberAccount',
                            amount: amount,
                            transaction_type: transaction_type,
                            transacted_at: date_paid,
                            status: 'approved'
                          )

    data  = {
      is_withdraw_payment: false,
      is_fund_transfer: false,
      is_interest: is_interest,
      is_adjustment: false,
      is_for_exit_age: false,
      is_for_loan_payments: false,
      accounting_entry_reference_number: nil,
      beginning_balance: 0.00,
      ending_balance: 0.00
    }

    # Compute beginning and ending balance
    data[:beginning_balance]  = member_account.balance.round(2)
    data[:ending_balance]     = (data[:beginning_balance] + amount).round(2)

    # Update account balance
    new_balance = (member_account.balance + amount).round(2)
    member_account.update(
      balance: new_balance
    )

    account_transaction.data = data

    account_transaction.save!
  end

  task :list_of_writeoff => :environment do
    require 'csv'
    branch_id = ENV['BRANCH_ID']
      @data = DataStore.billing_for_writeoff.where("meta->> 'as_of' = '2021'").order(Arel.sql("meta->>'branch_id' ASC"))
      #@data = DataStore.where(id: "8e870864-fc34-4e55-8a8e-80d3295558da")
        CSV.open("#{Rails.root}/tmp/writeoff.csv", "w",:write_headers=> true, :headers => ["ID","BRANCH" ,"MALE","FEMALE","TOTAL # OF MEMBERS","WRITEOFF AMOUNT","WRITEOFF YEAR"] ) do |csv|
            
              @data.each do |b|
                @id = b.id
                @year =  b["meta"]["as_of"]
                @branch = b["meta"]["branch_name"]
                @female = 0
                @male = 0
                @loans = 0
                @amount = 0
                a_data = b["data"]

                a_data_rec= a_data.with_indifferent_access[:record]        
                  @counts = a_data_rec.group_by{ |obj| obj["member"]["id"] }.map{|mem , obj| [mem,obj.count]}.to_h
                  
                  @counts.each do |c|
                     @member = Member.find(c[0])
                     @gender = @member.gender
                      
                      if @gender == "Female"
                        @female += 1
                      elsif @gender == "Male"
                        @male += 1
                      end
                  end

                  @amount = a_data_rec.sum{|item| item[:amount]}
                  csv << [@id, @branch, @male,@female,@counts.count,@amount,@year]
              end

        end
  end
          task :capr => :environment do
          require 'csv'
          branch_id = ENV['ID']
          @data = DataStore.where(id: branch_id)
            @count1 = 0
            @count2 = 0
            @count3 = 0
            @count4 = 0
            @count5 = 0
            @count6 = 0
            @count7 = 0
            @count8 = 0
            @count9 = 0
            @count10 = 0

            @counts
            @data.each do |b|
              @id = b.id
              @year = b["meta"]["as_of"]
              @branch = b["meta"]["branch_name"]
              @female = 0
              @male = 0
              @loans = 0
              @amount = 0

              a_data = b["data"]
              a_data_rec = a_data.with_indifferent_access[:record]
              @counts = a_data_rec.group_by{ |obj| obj["member"]["id"]}.map{|mem, obj| [mem,obj.count]}.to_h
            end
            @counts.each do |c|
              @member = Member.find(c[0])
              @gender = @member.gender
              @age = @member.age
              if @gender == "Male" and @age >= 18 and @age <= 39
                @count1 += 1
              elsif @gender == "Female" and @age >= 18 and @age <= 39 
                @count2 += 1
              elsif @gender == "Others" and @age >= 18 and @age <= 39 
                @count3 += 1
              elsif @gender == "Male" and @age >= 40 and @age <= 65 
                @count4 += 1
              elsif @gender == "Female" and @age >= 40 and @age <= 65 
                @count5 += 1
              elsif @gender == "Others" and @age >= 40 and @age <= 65
                @count6 += 1
              elsif @gender == "Male" and @age >= 66
                @count7 += 1
              elsif @gender == "Female" and @age >= 66
                @count8 += 1
              elsif @gender == "Others" and @age >= 66
                @count9 += 1
              end
            end
              puts "#{@count1}|#{@count2}|#{@count3}|#{@count4}|#{@count5}|#{@count6}|#{@count7}|#{@count8}|#{@count9}"
  end
end
