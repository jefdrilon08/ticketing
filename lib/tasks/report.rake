namespace :report do
  task :mba_report => :environment do
    br_name = ENV['SATO']
    br_id   = Branch.where(name: br_name).ids
    trans_date = '2022-07-31'
    @data    = []

    member = Member.where("status = 'active' and branch_id = ? and data ->> 'recognition_date' <= ?", br_id , trans_date)
    member.each do |mem|
      recog_date = mem.data['recognition_date']
      member_account = MemberAccount.where("account_subtype = ? AND member_id = ?", "Life Insurance Fund", mem.id)
      account_transaction = AccountTransaction.where("amount > 0 AND subsidiary_id = ? AND transacted_at <= ?", member_account.pluck(:id), trans_date).order("transacted_at ASC").last

      default_periodic_payment  = 15
      if account_transaction.present?
        latest = account_transaction
        at = latest.data.with_indifferent_access[:ending_balance].to_f
        td = trans_date.to_date
        last_payment_date = latest.transacted_at
        days_lapsed = (last_payment_date.to_date - td).to_i
        weeks_lapsed = (days_lapsed / 7).to_i + 1
      end
      data = "#{mem.full_name}|#{mem.center.name}|#{mem.data['recognition_date']}|#{days_lapsed}|#{weeks_lapsed}"

      @data << data
    end
    puts @data
  end
task :loan_pef => :environment do
  br_name = ENV['SATO']
  br_id   = Branch.where(name: br_name).ids
  @data = []

  loan =  Loan.where("branch_id =? and status = 'active'" , br_id).ids

  loan.each do |xx|
    loans = Loan.find(xx)
    member = Member.find(loans["member_id"])
    idc     = loans['center_id']
    cn      = Center.find(idc).name
    ids     = loans['branch_id']
    sn      = Branch.find(ids).name
    la      = loans['principal']
    ilp     = loans['loan_product_id']
    lp      = LoanProduct.find(ilp).name

    if loans['loan_product_id'] == '4e517b79-5ee7-48f3-92ad-b6fb1a3c0a00' || loans['loan_product_id'] == 'c18f7606-8af0-41f2-a5b2-06d6439777d1' and la > 99001
      data = "#{loans.member.full_name}|#{loans.cycle}|#{cn}|#{sn}|#{la}|#{lp}"
      @data << data
    end

  end
  puts @data
end
task :involuntary_resignation => :environment do
    br_name = ENV['SATO']
    br_id   = Branch.where(name: br_name).ids
    trans_date = '2020-07-31'
    @data    = []

    member_account = MemberAccount.joins(:member).where("members.status = 'active' and account_type = 'SAVINGS' and members.branch_id = ? and account_subtype IN (?)", br_id, ["K-IMPOK","Golden K","Personal Savings Account"]).ids

    member_account.each do |mem_acc|
      mem = MemberAccount.find(mem_acc)
      acc_trans = AccountTransaction.where("subsidiary_id = ? and transaction_type = 'deposit' and data ->> 'is_interest' != 'true'", mem_acc).order(:transacted_at).last
      loan = Loan.where(member_id: mem.member_id , status: 'active').count
      if acc_trans.present?
        if acc_trans.transacted_at <= trans_date
          data = "#{acc_trans.subsidiary_id}|#{mem.member_id}|#{loan}|#{acc_trans.transacted_at}"
        end
      else
      end
      @data << data
    end
    puts @data
  end
  task :repayment_rates => :environment do
    s_date = ENV['s_date']
    br_name = ENV['SATO']
    br_id = Branch.where(name: br_name).ids
    @data = []
  
    @data_store = DataStore.where(
      "meta->>'branch_id' = ? AND
      CAST(meta->>'as_of' AS date) = ? AND
      meta->>'data_store_type' = ?",
      br_id,
      s_date,
      "REPAYMENT_RATES"
    ).last  
  
    @data_store_data = @data_store.data.with_indifferent_access
  
    @data_store_data[:records].each do |record|
      member = record["member"]
      principal = record["principal"]
      interest = record["interest"]
      loan_product = record["loan_product"]["name"]
      principal_balance = record["overall_principal_balance"]
      interest_balance = record["overall_interest_balance"]
      balance = record["overall_balance"]
      if member.present?
        member_details = Member.find_by(id: member["id"])
        
        if member_details.present? && member_details[:member_type] == "GK"
          data = "#{record['id']}|#{member['last_name']}, #{member['first_name']}, #{member['middle_name']}|#{loan_product}|#{principal}|#{interest}|#{principal_balance}|#{interest_balance}|#{balance}"
          @data << data
        end
      end
    end
  
    puts "MEMBER ID|MEMBER|LOAN PRODUCT|PRINCIPAL|INTEREST|PRINCIPAL BALANCE|INTEREST BALANCE|OVERALL BALANCE"
    puts @data
  end

  task:personal_fund => :environment do
    s_date = ENV['s_date']
    br_name = ENV['SATO']
    br_id = Branch.where(name: br_name).ids
    @data = []

    @data_store  = DataStore.where(
                                  "meta->>'branch_id' = ? AND
                                  CAST(meta->>'as_of' AS date) = ? AND
                                  meta->>'data_store_type' = ?",
                                  br_id,
                                  s_date,
                                  "PERSONAL_FUNDS",).last
    @data_store_data = @data_store.data.with_indifferent_access

    @data_store_data[:records].each_with_index do |member, j|
      a = member[:member]
      accounts = member[:accounts] 
      share_cap = accounts.select{|sc| sc[:account_subtype] == "Share Capital"}.last
      k_impok = accounts.select{|k_impok| k_impok[:account_subtype] == "K-IMPOK"}.last
      golden_k = accounts.select{|gk| gk[:account_subtype] == "Golden K"}.last
      savings_if = accounts.select{|sif| sif[:account_subtype] == "Savings Investment Fund"}.last
      personal_sa = accounts.select{|psa| psa[:account_subtype] == "Personal Savings Account"}.last
      member_details = Member.find(a[:id])
      if member_details[:member_type] == "GK"
        data = "#{a[:last_name]} , #{a[:first_name]} , #{a[:middle_name]}|#{share_cap[:balance]}|#{k_impok[:balance]}|#{golden_k[:balance]}|#{savings_if[:balance]}|#{personal_sa[:balance]}"
        @data << data
      end    
    end
    puts "MEMBER|SHARE CAPITAL|K-IMPOK|GOLDEN K|SAVINGS INVESTMENT FUND|PERSONAL_SAVINGS_ACCOUNT"
    puts @data
  end
task :member_number => :environment do
  br_name = ENV['SATO']
  br_id = Branch.where(name: br_name).ids
  mem = Member.where("status = 'active' and branch_id = ?", br_id)
  @data = []

  mem.each do |member|
    mem_data = member.data
    data = [
      member.identification_number,
      member.full_name,
      member.center.name,
      member.mobile_number
    ]
    @data << data
  end
   csv_file_path = "#{br_name}.csv"

  CSV.open(csv_file_path, 'wb') do |csv|

     csv << ['Identification Number', 'Full Name', 'Center Name', 'Mobile Number', 'Updated Mobile Number']

    @data.each do |row|
      csv << row
    end
  end

  puts "CSV file has been created at #{csv_file_path}"
end



  task :accrued_list => :environment do
    br_name = ENV['SATO']
    br_id   = Branch.where(name: br_name).ids
    @data   = []

    loan_details   = Loan.where("branch_id = ? and data ->> 'accrued_interest' IS NOT NULL ",br_id).ids

    loan_details.each do |ld|
    loans = Loan.find(ld)
    am    = loans.data['accrued_interest']
    cb    = am['total_accrued_interest'] - am['total_accrued_interest_balance']

    if cb > 0
      status = "Active"
    else
      status = "Paid"
    end
    data  = "#{loans.member.full_name}|#{loans.loan_product.name}|#{am['total_accrued_interest']}|#{am['total_accrued_interest_balance']}|#{cb}|#{status}|#{am['status']}"
    @data << data

    end
    puts @data
  end

  task :delinquent_list => :environment do
    br_name = ENV['SATO']
    br_id   = Branch.where(name: br_name).ids
    mem = Member.where("status = 'writeoff' and branch_id = ?", br_id)
    @data   = []

    mem.each do |member|
    mem_data    = member.data

      if status   == 'writeoff'
        status    == 'Delinquent'
        end

      data = "#{}|#{member.identification_number}|#{member.full_name}|#{status}|#{member.id}"
      @data << data
    end


  puts @data

  end

  task :member_list_ito => :environment do
    br_name = ENV['SATO']
    br_id   = Branch.where(name: br_name).ids
    @data = []
    member = Member.where("status = 'active' and branch_id = ?" , br_id)

    member.each do |mem|

    data = "#{mem.center.name}|#{mem.full_name}|#{mem.mobile_number}|#{mem.home_number}"
    @data << data
    end
puts @data
  end

  task :member_registry => :environment do
    br_name = ENV['SATO']
    br_id = Branch.where(name: br_name).ids
    mem = Member.where("status != 'archived' and branch_id = ?", br_id)
    @data = []
    mem.each do |member|
      mem_data  = member.data
      gov       = mem_data['government_identification_numbers']
      tin_no    = gov['tin_number']
      address   = mem_data['address']
      dependent = member.legal_dependents.count
      if member.status = 'resigned'
        res = member.date_resigned
      else
        res = ''
      end
      data      = "#{member.identification_number}|#{member.full_name}|#{tin_no}|#{member.date_of_membership}||||4|400.00|100.00|#{address['street']} #{address['district']} #{address['city']} #{address['region']} #{address['province']}|#{member.date_of_birth}|#{member.age}|#{member.gender}|#{member.civil_status}|||#{dependent}|#{member.religion}||#{res}"
      @data << data
    end
    puts @data
  end

  task :city => :environment do
    br_name = ENV['SATO']
    br_id = Branch.where(name: br_name).ids
    @data = []
    x = Member.where("status != 'archived' and branch_id = ? and data -> 'address' ->> 'region' IS NULL", br_id).ids
    x.each do |y|
      mem   = Member.find(y)
      addr  = mem.data['address']
      mfl   = addr['city'].to_s
      mfl   = mfl[0]
      dta    = "#{mem.full_name}|#{mem.center.name}|#{mem.date_of_membership}|#{mem.status}|#{addr['city']}|#{addr['district']}|#{y}"
      @data << dta
    end
    puts @data
  end

  task :project_type_loan_details => :environment do
    br_name = ENV['SATO']
    br_id   = Branch.where(name: br_name).ids
    @data   = []
    if br_id.present?
      loan_details = Loan.where("status = 'active' and branch_id = ? and loan_product_id IS NOT NULL",br_id).pluck(:loan_product_id).uniq
    else
      loan_details = Loan.where("status = 'active' and loan_product_id IS NOT NULL").pluck(:loan_product_id).uniq
    end
    loan_details.each do |s|

    lp      = LoanProduct.find(s).name
    ss      = Loan['principal']
    if br_id.present?
      s_count = Loan.where("status = 'active' and branch_id=? and loan_product_id=?" ,br_id,s).count
    else
      s_count = Loan.where("status = 'active' and loan_product_id=?",s).count
    end

    lb    = "#{lp}|#{s_count}|#{ss}"
    @data << lb
    end
    puts @data
  end
  task :project_type_report => :environment do
    br_name = ENV['SATO']
    br_id   = Branch.where(name: br_name).ids
    @data   = []
    entry_point = LoanProduct.where(is_entry_point: true).ids
    if br_id.present?
      project_type = Loan.where("status = 'active' and branch_id = ? and project_type_id IS NOT NULL and loan_product_id IN (?)", br_id , entry_point).ids
    else
      project_type = Loan.where("status = 'active' and project_type_id IS NOT NULL and loan_product_id IN (?)" , entry_point).pluck(:project_type_id).uniq
    end
    project_type.each do |pt|
    loans   = Loan.find(pt)
    pp      = loans['project_type_id']
    add  = Member.find(loans.member_id).data['address']
    categ   = ProjectType.find(pp).project_type_category.name
    data    = "#{loans.member.full_name}|#{loans.member.branch}|#{loans.center.name}|#{add['street']}|#{add['district']}|#{add['city']}|#{add['province']}|#{categ}|#{loans.project_type.name}"

    @data << data
    end
    puts @data
  end

  task :member_for_write_off => :environment do
    br_name = ENV['SATO']
    br_id   = Branch.where(name: br_name).ids
    @data   = []

    if br_id.present?
      project_type = Loan.where("status = 'writeoff' and branch_id = ? and project_type_id IS NOT NULL", br_id).ids
    else
      project_type = Loan.where("status = 'writeoff' and project_type_id IS NOT NULL").pluck(:project_type_id).uniq
    end

    project_type.each do |pt|
    loans   = Loan.find(pt)
    ss      = loans['date_prepared']
    ib      = loans['interest_balance']
    md      = loans['maturity_date']
    st      = loans['status']
    idc     = loans['center_id']
    cn      = Center.find(idc).name

    data    = "#{loans.member.full_name}|#{cn}|#{loans.loan_product.name}|#{loans.principal}|#{ib}|#{ss}|#{st}"

    @data << data

    end
    puts @data
  end

  task :loan_project_type => :environment do
    s_date= ENV['s_date']
    br_name = ENV['SATO']
    br_id = Branch.where(name: br_name).ids
    @data = []
    if br_id.present?
      loan_data = Loan.where("status = 'active' and branch_id=? and project_type_id IS NOT NULL" , br_id).pluck(:project_type_id).uniq
    else
      loan_data = Loan.where("status = 'active' and project_type_id IS NOT NULL").pluck(:project_type_id).uniq
    end
    loan_data.each do |l|
      pt = ProjectType.find(l).name
      if br_id.present?
        l_count = Loan.where("status = 'active' and branch_id=? and project_type_id=?" ,br_id,l).count
      else
        l_count = Loan.where("status = 'active' and project_type_id=?",l).count
      end
      dta = "#{pt}|#{l_count}"
      #dta = "#{l[:member][:last_name]}, #{l[:member][:first_name]} #{l[:member][:middle_name]}|#{l[:loan_product][:name]}|#{loan_pt}"
      @data << dta
    end
    puts @data
  end

  task :bank_loan_sbc => :environment do
    s_date= ENV['s_date']
    #mat_date = ENV['mat_date']
    br_name = ENV['SATO']
    loan_type = ENV['LTYPE']
    d_rel = ENV['r_date']
    br_id = Branch.where(name: br_name).ids
    prin_amt = ENV['prin_amt']
    @data = []

    @data_store  = DataStore.where(
                                        "meta->>'branch_id' = ? AND
                                         CAST(meta->>'as_of' AS date) = ? AND
                                         meta->>'data_store_type' = ?",
                                         br_id,
                                         s_date,
                                         "MANUAL_AGING").last
   @data_store_data = @data_store.data.with_indifferent_access

   @data_store_data[:records].each.with_index do |l|
     if l[:loan_product][:name] == loan_type and l[:date_released] >= d_rel
      #if l[:date_released] >= d_rel
       loan = Loan.find(l[:id])
        mem = Member.find(l[:member][:id])
        dob = mem.date_of_birth.to_date.strftime("%m/%d/%Y")
        strt = mem.data['address']['street']
        dist = mem.data['address']['district']
        ct = mem.data['address']['city']
        rr = (l[:principal_rr])*100
        installment = loan.num_installments
        mobile_no = mem.mobile_number
        if installment == 15
          month = 3
        elsif installment == 25
          month = 6
        elsif installment == 50
          month = 12
        end
        m_rate = loan.monthly_interest_rate*12
        x = Loan.find(l[:id])
        if x.project_type_id.present?
          lp_id = ProjectType.find(x.project_type_id).project_type_category_id
        else
          a = Loan.joins(:loan_product).where("member_id = '#{l[:member][:id]}' and is_entry_point = 'true' and project_type_id IS NOT NULL").last
          if a.present?
            lp_id =ProjectType.find(a.project_type_id).project_type_category_id
          end
        end
        if lp_id == 'fc366127-8504-4429-a0bf-11b365ae0e72' or lp_id =='68b0a0c3-9786-4ca3-96e3-31dddf1bb6e6'
          lp = 'Agriculture'
        elsif lp_id == '5c0d4569-3d8d-43c0-9d4c-fadd11ef773a'
          lp = 'Manufacturing'
        elsif lp_id == '39ffb693-7ec7-4956-ad6a-1ea44c052c15'
          lp = 'Trading'
        elsif lp_id == 'c140c10f-eed0-4a77-af8f-65a2f2a6600e' or lp_id == '671aa2f6-3cb6-45dc-b3e4-0f566648421b' or lp_id == 'fd131b36-c215-4c82-9e4e-3816d19b9004'
          lp = 'Services'
        end
        dta = "#{l[:member][:first_name]}|#{l[:member][:middle_name]}|#{l[:member][:last_name]}|#{mem.gender}|#{dob}|#{"Acquire equipment/ fixed assets"}|#{lp}|#{ct}||#{l[:principal]}|#{month}|#{m_rate}|#{l[:date_released]}|#{mobile_no}|#{l[:overall_principal_balance]}|#{l[:maturity_date]}"
       @data << dta
     end

   end
   puts @data
  end


  task :bank_loan => :environment do
  s_date= ENV['s_date']
    #mat_date = ENV['mat_date']
    br_name = ENV['SATO']
    rep_type = ENV['MIDAS']
    br_id= Branch.where(name: br_name).ids
    @data = []

    @data_store  = DataStore.where(
                                        "meta->>'branch_id' = ? AND
                                         CAST(meta->>'as_of' AS date) = ? AND
                                         meta->>'data_store_type' = ?",
                                         br_id,
                                         s_date,
                                         "MANUAL_AGING").last
   @data_store_data = @data_store.data.with_indifferent_access

   @data_store_data[:records].each.with_index do |l|
     if l[:loan_product][:name] == 'K - KALAMIDAD'
       loan = Loan.find(l[:id])
        mem = Member.find(l[:member][:id])
        strt = mem.data['address']['street']
        dist = mem.data['address']['district']
        ct = mem.data['address']['city']
        rr = (l[:principal_rr])*100
        x = Loan.find(l[:id])
        if x.project_type_id.present?
          lp = ProjectType.find(x.project_type_id).name
        else
          a = Loan.joins(:loan_product).where("member_id = '#{l[:member][:id]}' and is_entry_point = 'true' and project_type_id IS NOT NULL").last.project_type_id
          if a.present?
            lp = ProjectType.find(a).name
          end
        end
       dta = "#{l[:member][:last_name]}, #{l[:member][:first_name]} #{l[:member][:middle_name]}|#{strt} #{dist} #{ct}|#{mem.gender}|#{l[:pn_number]}|#{l[:principal]}|#{l[:overall_principal_balance]}|#{rr}|#{l[:date_released]}|#{l[:maturity_date]}|#{loan.term}|#{loan.num_installments}|#{lp}|#{l[:loan_product][:name]}|#{loan.cycle}"
       @data << dta
     end

   end
   puts @data
  end

  task :sharecap => :environment do
    s_date= ENV['s_date']
    #mat_date = ENV['mat_date']
    br_name = ENV['SATO']
    br_id= Branch.where(name: br_name).ids
    @data = []

    @data_store  = DataStore.where(
                                        "meta->>'branch_id' = ? AND
                                         CAST(meta->>'as_of' AS date) = ? AND
                                         meta->>'data_store_type' = ?",
                                         br_id,
                                         s_date,
                                         "PERSONAL_FUNDS").last
    @data_store_data = @data_store.data.with_indifferent_access
    @data_store_data[:records].each.with_index do |r , i|
      x = r[:member]
      mem = Member.find(x[:id])
      sc = r[:accounts][7][:balance]
      sh = (sc/100).to_i
      j = "#{x[:last_name]} , #{x[:first_name]}|#{mem.center.name}|#{sc}|#{sh}|#{mem.date_of_membership}"
      @data << j
    end
      puts @data
  end
  task :cap_r => :environment do
    require 'csv'
    s_date = ENV['s_date']
    br_name = ENV['SATO']
    br_id = Branch.where(name: br_name).ids

    @data_store = DataStore.where(
      "meta->>'branch_id' = ? AND
       CAST(meta->>'as_of' AS date) = ? AND
       meta->>'data_store_type' = ?",
       br_id,
       s_date,
       "MEMBER_COUNTS"
    ).last

    @data = []
    count_age_18_30_j = 0
    count_age_31_40_j = 0
    count_age_41_55_j = 0
    count_age_56_j    = 0

    count_age_0_16 = 0
    count_age_0_16_m = 0
    count_age_0_16_f =0

    count_age_17_30 = 0
    count_age_17_30_m = 0
    count_age_17_30_f =0

    count_age_31_45 = 0
    count_age_31_45_m = 0
    count_age_31_45_f = 0

    count_age_above_45 = 0
    count_age_above_45_m = 0
    count_age_above_45_f = 0

    count_age_18_30_m = 0
    count_age_18_30_f = 0
    count_age_31_59_m = 0
    count_age_31_59_f = 0
    count_age_60_above_m = 0
    count_age_60_above_f = 0

    count_age_18_30 = 0
    count_age_31_59 = 0
    count_age_60_above = 0

    # 18 - 39
    count_male_18_39 = 0
    count_female_18_39 = 0
    count_others_18_39 = 0
    # 40 - 65
    count_male_40_65 = 0
    count_female_40_65 = 0
    count_others_40_65 = 0
    # 65 above
    count_others_male_65_above = 0
    count_others_female_65_above = 0
    count_others_others_65_above = 0

    @data_store_data = @data_store.data.with_indifferent_access

  def calculate_age(date_of_birth)
    (Date.today - date_of_birth).to_i / 365
  end

    # Process inactive members
    @data_store_data[:counts][:inactive_members][:members].each do |m|
      mem = Member.find(m[:id])
      mem_project = mem.data.with_indifferent_access
      project_types = mem_project["project_type"]
      if project_types.present? && project_types.is_a?(Array) && project_types[0].present?
        first_project_type = project_types[0][:details][:project_type]
      end
         
      age = calculate_age(mem.date_of_birth)
        sc = MemberAccount.where(member_id: m[:id] , account_type: 'EQUITY' , account_subtype: 'Share Capital').last.balance
        j = "#{m[:identification_number]}|#{m[:last_name]}, #{m[:first_name]}|#{ m[:center][:name]}|#{"Non-Patronizing Member"}|#{mem.date_of_membership}|#{mem.date_of_birth}|#{mem.gender}|#{mem.civil_status}|#{age}|#{first_project_type}"
        @data << j
      # if age <= 31
      #   count_age_18_30 += 1
      # elsif age <= 60
      #   count_age_31_59 += 1
      # elsif age >= 59
      #   count_age_60_above += 1
      # end

      if age <= 30
        count_age_18_30_j += 1
      elsif age <= 40 
        count_age_31_40_j += 1
      elsif age <= 55 
        count_age_41_55_j += 1
      elsif
        count_age_56_j += 1
      end

      # if age <= 16
      #   count_age_0_16 += 1
      # elsif age <= 30
      #   count_age_17_30 += 1
      # elsif age <= 45
      #   count_age_31_45 += 1
      # else
      #   count_age_above_45 += 1
      # end

      # if  mem.gender["Male"] && age <= 16
      #   count_age_0_16_m += 1
      # elsif mem.gender["Female"] && age <= 16
      #   count_age_0_16_f += 1
      # elsif mem.gender["Male"] && age <= 30
      #   count_age_17_30_m += 1
      # elsif mem.gender["Female"] && age <= 30
      #   count_age_17_30_f += 1
      # elsif mem.gender["Male"] && age <= 45
      #   count_age_31_45_m += 1
      # elsif mem.gender["Female"] && age <= 45
      #   count_age_31_45_f += 1
      # elsif mem.gender["Male"] && age >= 46
      #   count_age_above_45_m += 1
      # elsif mem.gender["Female"] && age >= 46
      #   count_age_above_45_f+= 1
      # end

      # if  mem.gender["Male"] && age <= 31
      #   count_age_18_30_m += 1
      # elsif mem.gender["Female"] && age <= 31
      #   count_age_18_30_f += 1
      # elsif mem.gender["Male"] && age >= 31 && age <= 60
      #   count_age_31_59_m += 1
      # elsif mem.gender["Female"] && age >= 31 && age <= 60
      #   count_age_31_59_f += 1
      # elsif mem.gender["Male"] && age >= 61
      #   count_age_60_above_m += 1
      # elsif mem.gender["Female"] && age >= 61
      #   count_age_60_above_f += 1
      # end

      # if mem.gender["Male"] && age >= 18 && age <= 39
      #   count_male_18_39 += 1

      # elsif mem.gender["Female"] && age >= 18 && age <= 39
      #   count_female_18_39 += 1
      # elsif mem.gender["Others"] && age >= 18 && age <= 39
      #   count_others_18_39 += 1
      # end
      # if mem.gender["Male"] && age >= 40 && age <= 65
      #   count_male_40_65 += 1

      # elsif mem.gender["Female"] && age >= 40 && age <= 65
      #   count_female_40_65 += 1

      # elsif mem.gender["Others"] && age >= 40 && age <= 65
      #   count_others_40_65 += 1

      # end
      # if mem.gender["Male"] && age >= 66
      #   count_others_male_65_above += 1

      # elsif mem.gender["Female"] && age >= 66
      #   count_others_female_65_above += 1

      # elsif mem.gender["Others"] && age >= 66
      #   count_others_others_65_above += 1

      # end

    end

    # Process pure savers
    @data_store_data[:counts][:pure_savers][:members].each do |m|
      mem = Member.find(m[:id])
      mem_project = mem.data.with_indifferent_access
      project_types = mem_project["project_type"]
      if project_types.present? && project_types.is_a?(Array) && project_types[0].present?
        first_project_type = project_types[0][:details][:project_type]
      end
      age = calculate_age(mem.date_of_birth)

      j = "#{m[:identification_number]}|#{m[:last_name]}, #{m[:first_name]}|#{ m[:center][:name]}|#{"pure saver"}|#{mem.date_of_membership}|#{mem.date_of_birth}|#{mem.gender}|#{mem.civil_status}|#{age}|#{first_project_type}"
      @data << j
      # if age <= 16
      #   count_age_0_16 += 1
      # elsif age <= 30
      #   count_age_17_30 += 1
      # elsif age <= 45
      #   count_age_31_45 += 1
      # else
      #   count_age_above_45 += 1
      # end
      
      if age <= 30
        count_age_18_30_j += 1
      elsif age <= 40 
        count_age_31_40_j += 1
      elsif age <= 55 
        count_age_41_55_j += 1
      elsif
        count_age_56_j += 1
      end

      # if  mem.gender["Male"] && age <= 16
      #   count_age_0_16_m += 1
      # elsif mem.gender["Female"] && age <= 16
      #   count_age_0_16_f += 1
      # elsif mem.gender["Male"] && age <= 30
      #   count_age_17_30_m += 1
      # elsif mem.gender["Female"] && age <= 30
      #   count_age_17_30_f += 1
      # elsif mem.gender["Male"] && age <= 45
      #   count_age_31_45_m += 1
      # elsif mem.gender["Female"] && age <= 45
      #   count_age_31_45_f += 1
      # elsif mem.gender["Male"] && age >= 46
      #   count_age_above_45_m += 1
      # elsif mem.gender["Female"] && age >= 46
      #   count_age_above_45_f+= 1
      # end

      # if age <= 31
      #   count_age_18_30 += 1

      #   elsif age <= 60
      #     count_age_31_59 += 1

      #   elsif age >= 59
      #     count_age_60_above += 1

      # end
      # if  mem.gender["Male"]  && age <= 31
      #   count_age_18_30_m += 1
      # elsif mem.gender["Female"] && age <= 31
      #   count_age_18_30_f += 1
      # elsif mem.gender["Male"] && age >= 31 && age <= 60
      #   count_age_31_59_m += 1
      # elsif mem.gender["Female"] && age >= 31 && age <= 60
      #   count_age_31_59_f += 1
      # elsif mem.gender["Male"] && age >= 61
      #   count_age_60_above_m += 1
      # elsif mem.gender["Female"] && age >= 61
      #   count_age_60_above_f += 1
      # end
      # if mem.gender["Male"] && age >= 18 && age <= 39
      #   count_male_18_39 += 1

      # elsif mem.gender["Female"] && age >= 18 && age <= 39
      #   count_female_18_39 += 1

      # elsif mem.gender["Others"] && age >= 18 && age <= 39
      #   count_others_18_39 += 1

      # end
      # if mem.gender["Male"] && age >= 40 && age <= 65
      #   count_male_40_65 += 1

      # elsif mem.gender["Female"] && age >= 40 && age <= 65
      #   count_female_40_65 += 1

      # elsif mem.gender["Others"] && age >= 40 && age <= 65
      #   count_others_40_65 += 1

      # end
      # if mem.gender["Male"] && age >= 66
      #   count_others_male_65_above += 1

      # elsif mem.gender["Female"] && age >= 66
      #   count_others_female_65_above += 1

      # elsif mem.gender["Others"] && age >= 66
      #   count_others_others_65_above += 1

      # end

    end

    # Process active borrower
    @data_store_data[:counts][:loaners][:members].each do |m|
      mem = Member.find(m[:id])
      mem_project = mem.data.with_indifferent_access
      project_types = mem_project["project_type"]
      if project_types.present? && project_types.is_a?(Array) && project_types[0].present?
        first_project_type = project_types[0][:details][:project_type]
      end

      age = calculate_age(mem.date_of_birth)
      j = "#{m[:identification_number]}|#{m[:last_name]}, #{m[:first_name]} #{m[:middle_name]}|#{ m[:center][:name]}|#{"Active borrower"}|#{mem.date_of_membership}|#{mem.date_of_birth}|#{mem.gender}|#{mem.civil_status}|#{age}|#{first_project_type}"
      @data << j
      # if age <= 31
      #   count_age_18_30 += 1

      # elsif age <= 60
      #   count_age_31_59 += 1

      # elsif age >= 59
      #   count_age_60_above += 1

      # end

      # if age <= 16
      #   count_age_0_16 += 1
      # elsif age <= 30
      #   count_age_17_30 += 1
      # elsif age <= 45
      #   count_age_31_45 += 1
      # else
      #   count_age_above_45 += 1
      # end

      if age <= 30
        count_age_18_30_j += 1
      elsif age <= 40 
        count_age_31_40_j += 1
      elsif age <= 55 
        count_age_41_55_j += 1
      elsif
        count_age_56_j += 1
      end

      # if  mem.gender["Male"] && age <= 16
      #   count_age_0_16_m += 1
      # elsif mem.gender["Female"] && age <= 16
      #   count_age_0_16_f += 1
      # elsif mem.gender["Male"] && age <= 30
      #   count_age_17_30_m += 1
      # elsif mem.gender["Female"] && age <= 30
      #   count_age_17_30_f += 1
      # elsif mem.gender["Male"] && age <= 45
      #   count_age_31_45_m += 1
      # elsif mem.gender["Female"] && age <= 45
      #   count_age_31_45_f += 1
      # elsif mem.gender["Male"] && age >= 46
      #   count_age_above_45_m += 1
      # elsif mem.gender["Female"] && age >= 46
      #   count_age_above_45_f+= 1
      # end

      # if  mem.gender["Male"] && age <= 31
      #   count_age_18_30_m += 1
      # elsif mem.gender["Female"] && age <= 31
      #   count_age_18_30_f += 1
      # elsif mem.gender["Male"] && age >= 31 && age <= 60
      #   count_age_31_59_m += 1
      # elsif mem.gender["Female"] && age >= 31 && age <= 60
      #   count_age_31_59_f += 1
      # elsif mem.gender["Male"] && age >= 61
      #   count_age_60_above_m += 1
      # elsif mem.gender["Female"] && age >= 61
      #   count_age_60_above_f += 1
      # end
      # if mem.gender["Male"] && age >= 18 && age <= 39
      #   count_male_18_39 += 1

      # elsif mem.gender["Female"] && age >= 18 && age <= 39
      #   count_female_18_39 += 1

      # elsif mem.gender["Others"] && age >= 18 && age <= 39
      #   count_others_18_39 += 1

      # end
      # if mem.gender["Male"] && age >= 40 && age <= 65
      #   count_male_40_65 += 1

      # elsif mem.gender["Female"] && age >= 40 && age <= 65
      #   count_female_40_65 += 1

      # elsif mem.gender["Others"] && age >= 40 && age <= 65
      #   count_others_40_65 += 1

      # end
      # if mem.gender["Male"] && age >= 66
      #   count_others_male_65_above += 1

      # elsif mem.gender["Female"] && age >= 66
      #   count_others_female_65_above += 1

      # elsif mem.gender["Others"] && age >= 66
      #   count_others_others_65_above += 1

      # end
    end

    # Process new member
    @data_store_data[:counts][:active_members][:members].each do |m|
      mem = Member.find(m[:id])
      age = calculate_age(mem.date_of_birth)
      j = "#{m[:identification_number]}|#{m[:last_name]}, #{m[:first_name]} #{m[:middle_name]}|#{ m[:center][:name]}|#{"New member"}|#{mem.date_of_birth}|#{mem.date_of_membership}|#{mem.gender}|#{mem.civil_status}|#{age}"
      @data << j
      # if age <= 31
      #   count_age_18_30 += 1

      # elsif age <= 60
      #   count_age_31_59 += 1

      # elsif age >= 59
      #   count_age_60_above += 1

      # end
      # if age <= 16
      #   count_age_0_16 += 1
      # elsif age <= 30
      #   count_age_17_30 += 1
      # elsif age <= 45
      #   count_age_31_45 += 1
      # else
      #   count_age_above_45 += 1
      # end
      
      if age <= 30
        count_age_18_30_j += 1
      elsif age <= 40 
        count_age_31_40_j += 1
      elsif age <= 55 
        count_age_41_55_j += 1
      elsif
        count_age_56_j += 1
      end

      # if  mem.gender["Male"] && age <= 16
      #   count_age_0_16_m += 1
      # elsif mem.gender["Female"] && age <= 16
      #   count_age_0_16_f += 1
      # elsif mem.gender["Male"] && age <= 30
      #   count_age_17_30_m += 1
      # elsif mem.gender["Female"] && age <= 30
      #   count_age_17_30_f += 1
      # elsif mem.gender["Male"] && age <= 45
      #   count_age_31_45_m += 1
      # elsif mem.gender["Female"] && age <= 45
      #   count_age_31_45_f += 1
      # elsif mem.gender["Male"] && age >= 46
      #   count_age_above_45_m += 1
      # elsif mem.gender["Female"] && age >= 46
      #   count_age_above_45_f+= 1
      # end
      # if  mem.gender["Male"] && age <= 31
      #   count_age_18_30_m += 1
      # elsif mem.gender["Female"] && age <= 31
      #   count_age_18_30_f += 1
      # elsif mem.gender["Male"] && age >= 31 && age <= 60
      #   count_age_31_59_m += 1
      # elsif mem.gender["Female"] && age >= 31 && age <= 60
      #   count_age_31_59_f += 1
      # elsif mem.gender["Male"] && age >= 61
      #   count_age_60_above_m += 1
      # elsif mem.gender["Female"] && age >= 61
      #   count_age_60_above_f += 1
      # end
      # if mem.gender["Male"] && age >= 18 && age <= 39
      #   count_male_18_39 += 1

      # elsif mem.gender["Female"] && age >= 18 && age <= 39
      #   count_female_18_39 += 1

      # elsif mem.gender["Others"] && age >= 18 && age <= 39
      #   count_others_18_39 += 1

      # end
      # if mem.gender["Male"] && age >= 40 && age <= 65
      #   count_male_40_65 += 1

      # elsif mem.gender["Female"] && age >= 40 && age <= 65
      #   count_female_40_65 += 1

      # elsif mem.gender["Others"] && age >= 40 && age <= 65
      #   count_others_40_65 += 1

      # end
      # if mem.gender["Male"] && age >= 66
      #   count_others_male_65_above += 1

      # elsif mem.gender["Female"] && age >= 66
      #   count_others_female_65_above += 1

      # elsif mem.gender["Others"] && age >= 66
      #   count_others_others_65_above += 1

      # end
    end
    puts "ID NUMBER|NAME|CENTER|MEMBER_STATS|DATE OF MEMBERSHIP|DATE OF BIRTH|GENDER|MEMBER STATUS|AGE|BUSINESS"
    puts @data
  
    # puts "Number of members aged between 18 and 30: |#{count_age_18_30}"
    # puts "Number of members aged between 31 and 59: |#{count_age_31_59}"
    # puts "Number of members aged 60 aboved : |#{count_age_60_above}"
    puts "Number of members aged 18 - 30  : |#{count_age_18_30_j}"
    puts "Number of members aged 31 - 40  : |#{count_age_31_40_j}"
    puts "Number of members aged 41 - 55  : |#{count_age_41_55_j}"
    puts "Number of members above 56  : |#{count_age_56_j}"
    puts "Total: |#{count_age_18_30_j + count_age_31_40_j + count_age_41_55_j + count_age_56_j}"

    # puts "Number of members aged 0 - 16  : |#{count_age_0_16}"
    # puts "Number of members aged 17 - 30 : |#{count_age_17_30}"
    # puts "Number of members aged 31 - 45 : |#{count_age_31_45}"
    # puts "Number of members aged 45 aboved : |#{count_age_above_45}"

    # puts "Number of members aged 0 - 16 MALE : |#{count_age_0_16_m}"
    # puts "Number of members aged 0 - 16  FEMALE: |#{count_age_0_16_f}"

    # puts "Number of members aged 17 - 30 MALE : |#{count_age_17_30_m}"
    # puts "Number of members aged 17 - 30 FEMALE : |#{count_age_17_30_f}"

    # puts "Number of members aged 31 - 45 MALE: |#{count_age_31_45_m}"
    # puts "Number of members aged 31 - 45 FEMALE: |#{count_age_31_45_f}"

    # puts "Number of members aged 45 aboved MALE: |#{count_age_above_45_m}"
    # puts "Number of members aged 45 aboved FEMALE: |#{count_age_above_45_f}"



    # puts "Number of members aged between 18 and 30 Male:|#{count_age_18_30_m}"
    # puts "Number of members aged between 18 and 30 Female:|#{count_age_18_30_f}"
    # puts "Number of members aged between 31 and 59 Male:|#{count_age_31_59_m}"
    # puts "Number of members aged between 31 and 59 Female:|#{count_age_31_59_f}"
    # puts "Number of members aged between 60 above Male:|#{count_age_60_above_m}"
    # puts "Number of members aged between 60 above Female:|#{count_age_60_above_f}"

    # puts "Number of member aged 18 - 39 male |#{count_male_18_39}|#{count_female_18_39}|#{count_others_18_39}"
    # # puts "Number of member aged 18 - 39 female |#{count_female_18_39}"
    # # puts "Number of member aged 18 - 39 others |#{count_others_18_39}"

    # puts "Number of member aged 40 - 65 male |#{count_male_40_65}|#{count_female_40_65}|#{count_others_40_65}"
    # # puts "Number of member aged 40 - 65 female |#{count_female_40_65}"
    # # puts "Number of member aged 40 - 65 other |#{count_others_40_65}"

    # puts "Number of member aged 65 above male |#{count_others_male_65_above}|#{count_others_female_65_above}|#{count_others_others_65_above}"
    # puts "Number of member aged 65 above male |#{count_others_female_65_above}"
    # puts "Number of member aged 65 above male |#{count_others_others_65_above}"

  end

  task :member_age => :environment do
    require 'csv'
    s_date= ENV['s_date']
    br_name = ENV['SATO']
    br_id= Branch.where(name: br_name).ids

    @data_store  = DataStore.where(
                                        "meta->>'branch_id' = ? AND
                                         CAST(meta->>'as_of' AS date) = ? AND
                                         meta->>'data_store_type' = ?",
                                         br_id,
                                         s_date,
                                         "MEMBER_COUNTS").last

    @data = []
    tmp = {}
    tmp[:last_name] = []
    @data_store_data = @data_store.data.with_indifferent_access
      @data_store_data[:counts][:inactive_members][:members].each do |m|
        mem = Member.find(m[:id])
        sc = MemberAccount.where(member_id: m[:id] , account_type: 'EQUITY' , account_subtype: 'Share Capital').last.balance
        #tmp[:last_name] << m[:last_name]
        tin = mem.data["government_identification_numbers"]["tin_number"]

        j = "#{m[:identification_number]}|#{m[:last_name]}, #{m[:first_name]}|#{ m[:center][:name]}|#{"inactive member"}|#{mem.date_of_membership}|#{tin}"
        @data << j
      end
      @data_store_data[:counts][:pure_savers][:members].each do |m|
        mem = Member.find(m[:id])
        sc = MemberAccount.where(member_id: m[:id] , account_type: 'EQUITY' , account_subtype: 'Share Capital').last.balance
        #tmp[:last_name] << m[:last_name]
        tin = mem.data["government_identification_numbers"]["tin_number"]

        j = "#{m[:identification_number]}|#{m[:last_name]}, #{m[:first_name]}|#{ m[:center][:name]}|#{"pure saver"}|#{mem.date_of_membership}|#{tin}"
        @data << j
      end

      #raise @data.inspect
      @data_store_data[:counts][:loaners][:members].each do |m|
        mem = Member.find(m[:id])
        sc = MemberAccount.where(member_id: m[:id] , account_type: 'EQUITY' , account_subtype: 'Share Capital').last.balance
        tin = mem.data["government_identification_numbers"]["tin_number"]
        j = "#{m[:identification_number]}|#{m[:last_name]}, #{m[:first_name]} #{m[:middle_name]}|#{ m[:center][:name]}|#{"active borrower"}|#{mem.date_of_membership}|#{tin}"
        @data << j
      end
      @data_store_data[:counts][:active_members][:members].each do |m|
        mem = Member.find(m[:id])
        sc = MemberAccount.where(member_id: m[:id] , account_type: 'EQUITY' , account_subtype: 'Share Capital').last.balance
        tin = mem.data["government_identification_numbers"]["tin_number"]
        j = "#{m[:identification_number]}|#{m[:last_name]}, #{m[:first_name]} #{m[:middle_name]}|#{ m[:center][:name]}|#{"admitted member"}|#{mem.date_of_membership}|#{tin}"
        @data << j
      end
      puts @data
  end
  task :watchlist => :environment do
    s_date= ENV['s_date']
    #mat_date = ENV['mat_date']
    br_name = ENV['SATO']
    br_id= Branch.where(name: br_name).ids
    @data = []

    @data_store  = DataStore.where(
                                        "meta->>'branch_id' = ? AND
                                         CAST(meta->>'as_of' AS date) = ? AND
                                         meta->>'data_store_type' = ?",
                                         br_id,
                                         s_date,
                                         "WATCHLIST").last
    @data_store_data = @data_store.data.with_indifferent_access
    @data_store_data[:records].each do |r|
      ctr = Loan.find(r[:id]).center.name
      j = "#{r[:member][:identification_number]}|#{r[:member][:last_name]}, #{r[:member][:first_name]}|#{ctr}"
      @data << j
    end
      puts @data
  end

  task :active_loaners => :environment do
  s_date= ENV['s_date']
    #mat_date = ENV['mat_date']
    br_name = ENV['SATO']
    br_id= Branch.where(name: br_name).ids
    @data = []

    @data_store  = DataStore.where(
                                        "meta->>'branch_id' = ? AND
                                         CAST(meta->>'as_of' AS date) = ? AND
                                         meta->>'data_store_type' = ?",
                                         br_id,
                                         s_date,
                                         "MEMBER_COUNTS").last
    @data_store_data = @data_store.data.with_indifferent_access
    @data_store_data[:counts][:loaners][:members].each do |m|
      ctr = m[:center][:name]
      j = "#{m[:identification_number]}|#{m[:last_name]}, #{m[:first_name]} #{m[:middle_name] }|#{ctr}"
      @data << j
    end

      puts @data
  end
task :midas_closing_record => :environment do
    s_date= ENV['s_date']
    #mat_date = ENV['mat_date']
    br_name = ENV['SATO']
    rep_type = ENV['MIDAS']
    br_id= Branch.where(name: br_name).ids
    @data = []

    @data_store  = DataStore.where(
                                        "meta->>'branch_id' = ? AND
                                         CAST(meta->>'as_of' AS date) = ? AND
                                         meta->>'data_store_type' = ?",
                                         br_id,
                                         s_date,
                                         "MANUAL_AGING").last
   @data_store_data = @data_store.data.with_indifferent_access

   @data_store_data[:records].each.with_index do |l|
    loan_data = Loan.find(l[:id])
    if loan_data.status = "paid"
    #member_details
      mem = Member.find(loan_data.member_id)
        street      = mem.data["address"]["street"]
        brgy        = mem.data["address"]["district"]
        city        = mem.data["address"]["city"]
        bday        = mem.date_of_birth.to_date.strftime("%m/%d/%Y")
        sss_no      = mem.data["government_identification_numbers"]["sss_number"].to_s.gsub(/[^0-9]/ ,"")
        if sss_no.length == 10
          sss = sss_no
        else
          sss = ""
        end

        pag_ibig_no    = mem.data["government_identification_numbers"]["pag_ibig_number"].to_s.gsub(/[^0-9]/ ,"")
        if pag_ibig_no.length == 12
          pag_ibig = pag_ibig_no
        else
          pag_ibig = ""
        end

        phil_health_no = mem.data["government_identification_numbers"]["phil_health_number"].to_s.gsub(/[^0-9]/ ,"")
        if phil_health_no.length == 12
          phil_health = phil_health_no
        else
          phil_health = ""
        end

        tin_no         = mem.data["government_identification_numbers"]["tin_number"].to_s.gsub(/[^0-9]/ ,"")
        if tin_no.length == 12 || tin_no.length == 9
          tin = tin_no
        else
          tin = ""
        end

      if rep_type == 'PODs'
        m_type = 'POD'
      elsif rep_type == 'BARs'
        m_type = 'BAR'
      end
       #civil_status
        if mem.civil_status == 'May Kinakasama' or mem.civil_status == 'Single' or mem.civil_status == 'single'
          civil_stat = 1
        elsif mem.civil_status == 'Kasal' or mem.civil_status == 'married'
          civil_stat = 2
        elsif mem.civil_status == 'Hiwalay' or mem.civil_status == 'separated'
          civil_stat = 3
        elsif mem.civil_status == 'Biyudo/a' or mem.civil_status == 'widowed'
          civil_stat = 4
        end
        #gender
        if mem.gender == 'Female'
          gend = 'F'
        elsif mem.gender == 'Male'
          gend = 'M'
        end
        #LOAN PURPOSE
        loan_prod = l[:loan_product][:name]
        if loan_prod == 'K - EDUKASYON' or loan_prod == 'K - EDUKASYON W2'  or loan_prod == 'K - EDUKASYON W3' or loan_prod == 'K - KALUSUGAN W1'  or loan_prod == 'K - KALUSUGAN W2' or loan_prod == 'K - KALUSUGAN W3' or loan_prod == 'K - KALUSUGAN W4' or loan_prod == 'K - KALUSUGAN W5' or loan_prod == 'K - KALUSUGAN W6' or loan_prod == 'K - KALUSUGAN W7'  or loan_prod == 'K - BAHAY W1' or loan_prod == 'K - BAHAY W2' or loan_prod == 'K - BAHAY W3' or loan_prod == 'K - Noche Buena'
          loan_purpose = 'NI'
        elsif loan_prod == 'K - KABUHAYAN' or loan_prod == 'K - PWD' or loan_prod == 'K - NHA W1' or loan_prod == 'K - NHA W2' or loan_prod == 'K-Toda' or loan_prod == 'K - MAGGAGAWA' or loan_prod == 'Alalay sa K (Business Disruption Loan)' or loan_prod == 'K - SAGIP'
          loan_purpose = 'ET'
        elsif loan_prod == 'K - BENEPISYO W1' or loan_prod == 'K - BENEPISYO W2' or loan_prod == 'K - BENEPISYO W3'  or loan_prod == 'K - KALAMIDAD' or loan_prod == 'K -KASAL' or loan_prod == 'K - TRABAHO' or loan_prod == 'K - BISIKLETA'
          loan_purpose = 'SE'
        end
        #CONTRACT TYPE
        if loan_prod == 'K - EDUKASYON' or loan_prod == 'K - EDUKASYON W2'  or loan_prod == 'K - EDUKASYON W3' or loan_prod == 'K - KALUSUGAN W1'  or loan_prod == 'K - KALUSUGAN W2' or loan_prod == 'K - KALUSUGAN W3' or loan_prod == 'K - KALUSUGAN W4' or loan_prod == 'K - KALUSUGAN W5' or loan_prod == 'K - KALUSUGAN W6' or loan_prod == 'K - KALUSUGAN W7'  or loan_prod == 'K - BAHAY W1' or loan_prod == 'K - BAHAY W2' or loan_prod == 'K - BAHAY W3' or loan_prod == 'K - Noche Buena'  or loan_prod == 'K -KASAL' or loan_prod == 'K - TRABAHO'
          contract_type = 12
        elsif loan_prod == 'K - KABUHAYAN' or loan_prod == 'K - PWD' or loan_prod == 'K - NHA W1' or loan_prod == 'K - NHA W2' or loan_prod == 'K-Toda' or loan_prod == 'K - MAGGAGAWA'or loan_prod == 'Alalay sa K (Business Disruption Loan)' or loan_prod == 'K - SAGIP'
          contract_type = 22
        elsif loan_prod == 'K - BENEPISYO W1' or loan_prod == 'K - BENEPISYO W2' or loan_prod == 'K - BENEPISYO W3'  or loan_prod == 'K - KALAMIDAD'
          contract_type = 28
        elsif loan_prod == 'K - BISIKLETA'
          contract_type = 17
        end
        #POD TYPE
        if loan_data.maturity_date.to_date == loan_data.original_maturity_date.to_date
          pod_type = "50-01"
        else
          pod_type = "54-02"
        end
        #mat_date
        #mat_date = loan_data.maturity_date.to_date.strftime("%m/%d/%Y")
        mat_date = AmortizationScheduleEntry.where("loan_id = ?" , l[:id]).order(:due_date).last.due_date
        mat_date = mat_date.to_date.strftime("%m/%d/%Y")
        date_rel = loan_data.date_released.to_date.strftime("%m/%d/%Y")
        int_rate = (loan_data.monthly_interest_rate*12)*100

        no_days_par = l[:num_days_par]
        n = (s_date.to_date - no_days_par)
        #outs_weeks = AmortizationScheduleEntry.where("loan_id = ? and due_date <= ? and due_date >= ?" , l[:id] , s_date , n).count
        #last_payment = AmortizationScheduleEntry.where("loan_id = ?" , l[:id]).last.amount_due

        last_at = AccountTransaction.where("subsidiary_id = ? and transacted_at <= ? and amount >= 1 and transaction_type = 'loan_payment'", l[:id] , s_date).order(:transacted_at).last
        if last_at.nil?
          last_date = s_date
          last_payment = 0
        else
          last_date = last_at.data['amort_entries'].last["due_date"]
          last_payment = last_at.amount.to_i
        end

        outs_weeks = AmortizationScheduleEntry.where("loan_id = ? and due_date > ?" , l[:id] , last_date).count

        monthly_payment = AmortizationScheduleEntry.where("loan_id = ?" , l[:id]).first.amount_due * 4

        #Overdue_Days
        if mat_date <= s_date
          if l[:num_days_par] >= 1
            overdue = l[:num_days_par]
            if overdue >= 1 and overdue <= 30
              overdue_days = 1
            elsif overdue >= 31 and overdue <= 60
              overdue_days = 2
            elsif overdue >= 61 and overdue <= 90
              overdue_days = 3
            elsif overdue >= 91 and overdue <= 180
              overdue_days = 4
            elsif overdue >= 181 and overdue <= 365
              overdue_days = 5
            elsif overdue >= 366
              overdue_days = 6
            end
          else
            overdue_days = 0
          end
        else
          overdue_days = 0
        end

      j = "#{mem.identification_number}|#{mem.last_name}|#{mem.first_name}|#{mem.middle_name}|#{street}|#{brgy}|#{city}|||#{bday}|#{mem.place_of_birth}|#{gend}|#{civil_stat}|#{mem.mobile_number}||||||#{sss}||#{phil_health}|#{tin}|#{l[:pn_number]}|#{contract_type}|CL|NA|#{l[:principal]}|#{l[:overall_principal_balance]}|#{date_rel}|#{mat_date}|#{int_rate}|#{loan_data.term}|#{loan_data.num_installments}|Php|#{loan_purpose}|#{pod_type}|#{l[:overall_balance]}|#{mat_date}|#{overdue_days}|#{monthly_payment}|#{outs_weeks}|#{last_payment}|#{loan_data.status}"
      @data << j
     end
    end
   puts @data
   puts "END"
  end
  task :midas_report => :environment do
    s_date= ENV['s_date']
    #mat_date = ENV['mat_date']
    br_name = ENV['SATO']
    rep_type = ENV['MIDAS']
    br_id= Branch.where(name: br_name).ids
    @data = []

    @data_store  = DataStore.where(
                                        "meta->>'branch_id' = ? AND
                                         CAST(meta->>'as_of' AS date) = ? AND
                                         meta->>'data_store_type' = ?",
                                         br_id,
                                         s_date,
                                         "MANUAL_AGING").last
   @data_store_data = @data_store.data.with_indifferent_access

   @data_store_data[:records].each.with_index do |l|
    loan_data = Loan.find(l[:id])
    if loan_data.present?
    #member_details
      mem = Member.find(loan_data.member_id)
        street      = mem.data["address"]["street"]
        brgy        = mem.data["address"]["district"]
        city        = mem.data["address"]["city"]
        bday        = mem.date_of_birth.to_date.strftime("%m/%d/%Y")
        sss_no      = mem.data["government_identification_numbers"]["sss_number"].to_s.gsub(/[^0-9]/ ,"")
        if sss_no.length == 10
          sss = sss_no
        else
          sss = ""
        end

        pag_ibig_no    = mem.data["government_identification_numbers"]["pag_ibig_number"].to_s.gsub(/[^0-9]/ ,"")
        if pag_ibig_no.length == 12
          pag_ibig = pag_ibig_no
        else
          pag_ibig = ""
        end

        phil_health_no = mem.data["government_identification_numbers"]["phil_health_number"].to_s.gsub(/[^0-9]/ ,"")
        if phil_health_no.length == 12
          phil_health = phil_health_no
        else
          phil_health = ""
        end

        tin_no         = mem.data["government_identification_numbers"]["tin_number"].to_s.gsub(/[^0-9]/ ,"")
        if tin_no.length == 12 || tin_no.length == 9
          tin = tin_no
        else
          tin = ""
        end

      if rep_type == 'PODs'
        m_type = 'POD'
      elsif rep_type == 'BARs'
        m_type = 'BAR'
      end
       #civil_status
        if mem.civil_status == 'May Kinakasama' or mem.civil_status == 'Single' or mem.civil_status == 'single'
          civil_stat = 1
        elsif mem.civil_status == 'Kasal' or mem.civil_status == 'married'
          civil_stat = 2
        elsif mem.civil_status == 'Hiwalay' or mem.civil_status == 'separated'
          civil_stat = 3
        elsif mem.civil_status == 'Biyudo/a' or mem.civil_status == 'widowed'
          civil_stat = 4
        end
        #gender
        if mem.gender == 'Female'
          gend = 'F'
        elsif mem.gender == 'Male'
          gend = 'M'
        end
        #LOAN PURPOSE
        loan_prod = l[:loan_product][:name]
        if loan_prod == 'K - EDUKASYON' or loan_prod == 'K - EDUKASYON W2'  or loan_prod == 'K - EDUKASYON W3' or loan_prod == 'K - KALUSUGAN W1'  or loan_prod == 'K - KALUSUGAN W2' or loan_prod == 'K - KALUSUGAN W3' or loan_prod == 'K - KALUSUGAN W4' or loan_prod == 'K - KALUSUGAN W5' or loan_prod == 'K - KALUSUGAN W6' or loan_prod == 'K - KALUSUGAN W7'  or loan_prod == 'K - BAHAY W1' or loan_prod == 'K - BAHAY W2' or loan_prod == 'K - BAHAY W3' or loan_prod == 'K - Noche Buena'
          loan_purpose = 'NI'
        elsif loan_prod == 'K - KABUHAYAN' or loan_prod == 'K - PWD' or loan_prod == 'K - NHA W1' or loan_prod == 'K - NHA W2' or loan_prod == 'K-Toda' or loan_prod == 'K - MAGGAGAWA' or loan_prod == 'Alalay sa K (Business Disruption Loan)' or loan_prod == 'K - SAGIP'
          loan_purpose = 'ET'
        elsif loan_prod == 'K - BENEPISYO W1' or loan_prod == 'K - BENEPISYO W2' or loan_prod == 'K - BENEPISYO W3'  or loan_prod == 'K - KALAMIDAD' or loan_prod == 'K -KASAL' or loan_prod == 'K - TRABAHO' or loan_prod == 'K - BISIKLETA'
          loan_purpose = 'SE'
        end
        #CONTRACT TYPE
        if loan_prod == 'K - EDUKASYON' or loan_prod == 'K - EDUKASYON W2'  or loan_prod == 'K - EDUKASYON W3' or loan_prod == 'K - KALUSUGAN W1'  or loan_prod == 'K - KALUSUGAN W2' or loan_prod == 'K - KALUSUGAN W3' or loan_prod == 'K - KALUSUGAN W4' or loan_prod == 'K - KALUSUGAN W5' or loan_prod == 'K - KALUSUGAN W6' or loan_prod == 'K - KALUSUGAN W7'  or loan_prod == 'K - BAHAY W1' or loan_prod == 'K - BAHAY W2' or loan_prod == 'K - BAHAY W3' or loan_prod == 'K - Noche Buena'  or loan_prod == 'K -KASAL' or loan_prod == 'K - TRABAHO'
          contract_type = 12
        elsif loan_prod == 'K - KABUHAYAN' or loan_prod == 'K - PWD' or loan_prod == 'K - NHA W1' or loan_prod == 'K - NHA W2' or loan_prod == 'K-Toda' or loan_prod == 'K - MAGGAGAWA'or loan_prod == 'Alalay sa K (Business Disruption Loan)' or loan_prod == 'K - SAGIP'
          contract_type = 22
        elsif loan_prod == 'K - BENEPISYO W1' or loan_prod == 'K - BENEPISYO W2' or loan_prod == 'K - BENEPISYO W3'  or loan_prod == 'K - KALAMIDAD'
          contract_type = 28
        elsif loan_prod == 'K - BISIKLETA'
          contract_type = 17
        end
        #POD TYPE
        if loan_data.maturity_date.to_date == loan_data.original_maturity_date.to_date
          pod_type = "50-01"
        else
          pod_type = "54-02"
        end
        #mat_date
        #mat_date = loan_data.maturity_date.to_date.strftime("%m/%d/%Y")
        mat_date = AmortizationScheduleEntry.where("loan_id = ?" , l[:id]).order(:due_date).last.due_date
        mat_date = mat_date.to_date.strftime("%m/%d/%Y")
        date_rel = loan_data.date_released.to_date.strftime("%m/%d/%Y")
        int_rate = (loan_data.monthly_interest_rate*12)*100

        no_days_par = l[:num_days_par]
        n = (s_date.to_date - no_days_par)
        #outs_weeks = AmortizationScheduleEntry.where("loan_id = ? and due_date <= ? and due_date >= ?" , l[:id] , s_date , n).count
        #last_payment = AmortizationScheduleEntry.where("loan_id = ?" , l[:id]).last.amount_due

        last_at = AccountTransaction.where("subsidiary_id = ? and transacted_at <= ? and amount >= 1 and transaction_type = 'loan_payment'", l[:id] , s_date).order(:transacted_at).last
        if last_at.nil?
          last_date = s_date
          last_payment = 0
        else
          last_date = last_at.data['amort_entries'].last["due_date"]
          last_payment = last_at.amount.to_i
        end

        outs_weeks = AmortizationScheduleEntry.where("loan_id = ? and due_date > ?" , l[:id] , last_date).count

        monthly_payment = AmortizationScheduleEntry.where("loan_id = ?" , l[:id]).first.amount_due * 4

        #Overdue_Days
        if mat_date <= s_date
          if l[:num_days_par] >= 1
            overdue = l[:num_days_par]
            if overdue >= 1 and overdue <= 30
              overdue_days = 1
            elsif overdue >= 31 and overdue <= 60
              overdue_days = 2
            elsif overdue >= 61 and overdue <= 90
              overdue_days = 3
            elsif overdue >= 91 and overdue <= 180
              overdue_days = 4
            elsif overdue >= 181 and overdue <= 365
              overdue_days = 5
            elsif overdue >= 366
              overdue_days = 6
            end
          else
            overdue_days = 0
          end
        else
          overdue_days = 0
        end

      j = "#{mem.identification_number}|#{mem.last_name}|#{mem.first_name}|#{mem.middle_name}|#{street}|#{brgy}|#{city}|||#{bday}|#{mem.place_of_birth}|#{gend}|#{civil_stat}|#{mem.mobile_number}||||||#{sss}||#{phil_health}|#{tin}|#{l[:pn_number]}|#{contract_type}|AC|NA|#{l[:principal]}|#{l[:overall_principal_balance]}|#{date_rel}|#{mat_date}|#{int_rate}|#{loan_data.term}|#{loan_data.num_installments}|Php|#{loan_purpose}|#{pod_type}|#{l[:overall_balance]}|#{mat_date}|#{overdue_days}|#{monthly_payment}|#{outs_weeks}|#{last_payment}"
      @data << j
     end
    end
   puts @data
   puts "END"
  end
  task :mem_share => :environment do
    x = Member.where("status = 'active' and branch_id = '3726405b-777c-4b61-b6a5-7a4b48db62b6'")
    x.each do |y|
      total_share = MemberAccount.where(member_id: y.id , account_type: 'EQUITY' , account_subtype: 'Share Capital').sum(:balance)
      mem_cert = Member.joins(:member_shares).where("members.id = ? and member_shares.is_void IS NULL" , y.id).sum(:number_of_shares)
      total_share_count = (total_share/100).to_i
      if total_share_count > mem_cert
        puts y.full_name , mem_cert , total_share_count
      end
    end
  end

  task :pending_insurance => :environment do
    Member.where("insurance_status = 'pending' and status = 'active' and data->>'recognition_date' IS NOT NULL").each do |pi|
      Member.find(pi.id).update(insurance_status: 'inforce')
      puts "#{pi.last_name}|#{pi.first_name}|#{pi.middle_name}|#{pi.recognition_date}"
      #MembershipPaymentRecord.where("membership_type = 'Insurance' and member_id = ?" , pi.id).date_paid
    end
  end
##### LIST OF ADDITIONAL SHARE CAPITAL ver 2.0#####
  task :project_type => :environment do
    ProjectType.all.each do |pt|
      puts "#{pt.name}|#{pt.id}"
    end
  end
  task :generate_list_for_additional_share_capitalx => :environment do
    require 'csv'
    s_date= ENV['s_date']
    e_date= ENV['e_date']
    br_name= ENV['branch']
   br_id= Branch.where(name: br_name).ids
    @data = []
    #mem = Member.joins(:member_shares).where("members.status = 'active' and members.branch_id = ? and member_shares.date_of_issue >= ? and member_shares.date_of_issue <= ?", br_id , s_date , e_date).order(:center_id)
    mem = Member.joins(:member_accounts).where("members.status = 'active' and member_accounts.account_type = 'EQUITY' and member_accounts.account_subtype = 'Share Capital' and members.branch_id = ?", br_id).order(:center_id)

    puts "Member Name | Center | Status |Date of Membership | Equity Account Balance | Required Additional Share Capital | CBU Balance | Share Capital For Payment | Current Savings"
    mem.each do |mems|
      mem_acct        = MemberAccount.where("member_id = ? and account_type = 'EQUITY' and account_subtype = 'Share Capital'", mems.id)
      mem_sub_id      = mem_acct.ids
      at              = AccountTransaction.where("subsidiary_id = ?", mem_sub_id)
      mem_date_year   =  at.pluck(:transacted_at).last.year
      req_add_share   = (Time.now.year - mem_date_year) * 100
      mem_acc         = at.order(:transacted_at).last.transacted_at
      mem_center      = Center.find(mems.center_id).name
      mem_equity      = mem_acct.pluck(:balance).map(&:to_d).shift
      cbu_bal         = MemberAccount.where("member_id = ? and account_type = 'EQUITY' and account_subtype = 'CBU'", mems.id).pluck(:balance).map(&:to_d).shift
      sc_for_payment  = req_add_share - cbu_bal
      curr_savings    = MemberAccount.where("member_id = ? and account_type = 'SAVINGS' and account_subtype = 'K-IMPOK'", mems.id).pluck(:balance).map(&:to_d).shift

      if mem_acc >= s_date and mem_acc <= e_date
      puts "#{mems.full_name}|#{mem_center}|#{mems.status}|#{mem_acc}|#{mem_equity}|#{req_add_share}|#{cbu_bal}|#{sc_for_payment}|#{curr_savings}"

        #@data << md
      end
      #@data << md
      #md = "#{mems.full_name}|#{mem_center}|#{mems.status}|#{mem_date_of_issue}|#{mem_equity}|#{req_add_share}|#{cbu_bal}|#{sc_for_payment}|#{curr_savings}"

    end
    #puts @data
  end


##### LIST OF ADDITIONAL SHARE CAPITAL ver 2.1#####
  task :generate_list_for_additional_share_capital => :environment do
    require 'csv'
    s_date= ENV['s_date']
    e_date= ENV['e_date']
    br_name= ENV['branch']
    br_id= Branch.where(name: br_name).ids
    @data = []
    mem = Member.joins(:member_shares).where("members.status = 'active' and members.branch_id = ? and member_shares.date_of_issue >= ? and member_shares.date_of_issue <= ?", br_id , s_date , e_date).order(:center_id)

    puts "Member Name | Center | Status |Date of Membership | Equity Account Balance | Required Additional Share Capital | CBU Balance | Share Capital For Payment | Current Savings"
    CSV.open("#{Rails.root}/tmp/#{br_name}_#{s_date}_to_#{e_date}_list_of_additioanl_shares.csv", "w",:write_headers=> true, :headers => [] ) do |csv|
    mem.each do |mems|
      mem_date_of_issue = MemberShare.where("member_id = ?" , mems.id).pluck(:date_of_issue).first
      mem_equity = MemberAccount.where("member_id = ? and account_type = 'EQUITY' and account_subtype = 'Share Capital'", mems.id).pluck(:balance).map(&:to_d).shift
      mem_center = Center.find(mems.center_id).name
      mem_date_year = MemberShare.where("member_id = ?" , mems.id).pluck(:date_of_issue).first.year
      req_add_share = (Time.now.year - mem_date_year) * 100
      cbu_bal = MemberAccount.where("member_id = ? and account_type = 'EQUITY' and account_subtype = 'CBU'", mems.id).pluck(:balance).map(&:to_d).shift
      sc_for_payment = req_add_share - cbu_bal
      curr_savings = MemberAccount.where("member_id = ? and account_type = 'SAVINGS' and account_subtype = 'K-IMPOK'", mems.id).pluck(:balance).map(&:to_d).shift
      md = "#{mems.full_name}|#{mem_center}|#{mems.status}|#{mem_date_of_issue}|#{mem_equity}|#{req_add_share}|#{cbu_bal}|#{sc_for_payment}"
      @data << md

    end
  end
    puts @data
  end




##### LIST OF ADDITIONAL SHARE CAPITAL #####
  task :generate_list_for_additional_share_cap => :environment do
    require 'csv'
    s_date= ENV['s_date']
    e_date= ENV['e_date']
    br_name= ENV['branch']
    br_id= Branch.where(name: br_name).ids

    CSV.open("#{Rails.root}/tmp/#{br_name}_#{s_date}_to_#{e_date}_list_of_additioanl_shares.csv", "w",:write_headers=> true, :headers => ["IDENTIFICATION_NUMBER","NAMES", "DATE OF MAMBERSHIP", "STATUS" , "EQUITY ACCOUNT BALANCE"] ) do |csv|
      mem = Member.joins(:member_shares).where("members.status = 'active' and members.branch_id = ? and member_shares.date_of_issue >= ? and member_shares.date_of_issue <= ?", br_id , s_date , e_date).pluck(:identification_number , "CONCAT_WS(', ',members.last_name,members.first_name,members.middle_name)" , "member_shares.date_of_issue" , "members.status" )
      mem.each do |mems|
        csv << mems
      end
    end
  end

  ##### LIST POSTED PROJECT TYPE #####
  task :loan_project_type_report_xx => :environment do
    s_date= ENV['s_date']
    #mat_date = ENV['mat_date']
    br_name = ENV['SATO']
    br_id= Branch.where(name: br_name).ids
    @data = []

    @data_store  = DataStore.where(
                                        "meta->>'branch_id' = ? AND
                                         CAST(meta->>'as_of' AS date) = ? AND
                                         meta->>'data_store_type' = ?",
                                         br_id,
                                         s_date,
                                         "MANUAL_AGING").last

    @data_store_data = @data_store.data.with_indifferent_access
    @data_store_data[:records].each.with_index do |r|
      if r[:loan_product][:name] == 'K - KABUHAYAN'

        loan = Loan.find(r[:id])
        #raise proj.inspect
        x = r[:member]

        l = r[:loan_product][:name]
        #px = ProjectType.find
        mem = Member.find(x[:id])

        j = "#{x[:last_name]}#{l}#{loan.project_type_id}"
      end
      @data << j
    end
      puts @data
end
    task :project_type_report_xx => :environment do
    require 'csv'
    br_name = ENV['SATO']
    br_id   = Branch.where(name: br_name).ids.shift
    CSV.open("#{Rails.root}/tmp/project_type_report.csv", "w",:write_headers=> true, :headers => ["MEMBER","PROJECT TYPE" ,"PROJECT CATEGORY","CENTER"] ) do |csv|
    @project = DataStore.where("meta->>'branch_id' = ? AND
                                           meta->>'data_store_type' = ? AND status='approved'",
                                           br_id,
                                           "PROJECT TYPE")
        @project.each do |dd|
         data_store = DataStore.find(dd[:id])

             data_store[:data].each_with_index do |s|

              #raise s["details"]["project_type"].inspect:
              f_name = s["details"]["member"]
              pt     = s["details"]["project_type"]
              ptc    = s["details"]["project_type_category"]
              center = data_store["meta"]["center_name"]
              #csv << ["#{s["details"]["member"]},#{s["details"]["project_type"]},#{s["details"]["project_type_category"]},#{data_store["meta"]["center_name"]}"]
              csv << [f_name,pt,ptc,center]

             end

        end
    end
    puts "DONE"
  end

##### LIST OF RESIGNED #####
  task :generate_resigned_members => :environment do
    require 'csv'
    req_date= ENV['r_date']
    br_name= ENV['branch']
    br_id= Branch.where(name: br_name).ids

    CSV.open("#{Rails.root}/tmp/from_#{req_date}_#{br_name}_list_of_resigned_members.csv", "w",:write_headers=> true, :headers => ["IDENTIFICATION_NUMBER","NAMES", "DATE RESIGNED"] ) do |csv|
      mem = ap Member.where("status = 'resigned' and branch_id = ? and date_resigned >= ?" , br_id , req_date).pluck(:identification_number , "CONCAT_WS(', ',last_name,first_name)" , "date_resigned" )

      mem.each do |mems|
        csv << mems
      end
    end
  end
##### LIST OF 400 EQUITY #####
  task :equity_data => :environment do
    require 'csv'
    br_name= ENV['branch']
    br_id= Branch.where(name: br_name).ids

    CSV.open("#{Rails.root}/tmp/equity_data.csv", "w",:write_headers=> true, :headers => ["ID NUMBER" , "NAME" , "DATE OF MEMBERSHIP" , "CENTER" , "EQUITY"] ) do |csv|
      mem = Member.joins(:member_accounts , :center , :membership_payment_records).where("members.status = 'active' and member_accounts.account_type = 'EQUITY' and member_accounts.account_subtype = 'Share Capital' and members.branch_id = ? and member_accounts.balance = 400 and membership_payment_records.status = 'paid'" , br_id).order("membership_payment_records.date_paid").pluck(:identification_number , "CONCAT_WS(', ',members.last_name,members.first_name,members.middle_name)" , "membership_payment_records.date_paid" ,"centers.name" , "member_accounts.balance").uniq
      mem.each do |mems|
        csv << mems
      end
    end
  end

  task :dl_soa_loans => :environment do
    require 'csv'
    uuid = ENV['UUID']
    @data = DataStore.find(uuid)
      CSV.open("#{Rails.root}/tmp/soa_loans_data_uuid_#{uuid}.csv", "w",:write_headers=> true, :headers => ["ID NUMBER" , "LAST_NAME" ,"FIRST_NAME","TOTAL_INTEREST_PAID" ] ) do |csv|
          data = @data.data.with_indifferent_access
          @temp = {
            records: []
          }
          data[:records].each do |rec|
            @temp[:records] << {
              first_name: rec[:member]["first_name"],
              last_name: rec[:member]["last_name"],
              identification_number: rec[:member][:identification_number],
              total_interest_paid: rec[:total_interest_paid]
            }
          end
          members = @temp[:records].group_by { |item|
            [item[:identification_number]]
          }.values.flat_map{|items| items.first.merge(total_interest_paid: items.sum{|h| h[:total_interest_paid]})}

          members.each do |mem|
            csv << [mem[:identification_number],mem[:last_name],mem[:first_name],mem[:total_interest_paid]]
          end
          puts "DONE"
      end
  end


  task :write_off => :environment do
    require 'csv'
    year = ENV['YEAR']
    @data = DataStore.billing_for_writeoff.where("meta->> 'as_of' = ? ","#{year}").order(Arel.sql("meta->>'branch_id'"))
      CSV.open("#{Rails.root}/tmp/writeoff.csv", "w",:write_headers=> true, :headers => ["Member Name","Branch","RSA","MBS","GK","PSA","CBU","SHARE CAPITAL"] ) do |csv|
        @data.each do |b|
          records = b.data.with_indifferent_access[:record]
          @branch = b[:meta]["branch_name"]

          unique_records = records.uniq { |record| record["member"]["id"]}

          unique_records.each do |rec|
            @member = Member.find(rec["member"]["id"])
            member_account = MemberAccount.where("member_id = ? and account_subtype IN ('K-IMPOK','Maintaining Balance Savings','Golden K','Savings Investment Fund','CBU','Share Capital')","#{@member.id}")
            member_account.each do |ma|
              if ma[:account_subtype] == "K-IMPOK"
                @kimpok = MemberAccount.find(ma.id)
              elsif ma[:account_subtype] == "Maintaining Balance Savings"
                @mbs = MemberAccount.find(ma.id)
              elsif ma[:account_subtype] == "Golden K"
                @gk = MemberAccount.find(ma.id)
              elsif ma[:account_subtype] == "Savings Investment Fund"
                @sif = MemberAccount.find(ma.id)
              elsif ma[:account_subtype] == "CBU"
                @cbu = MemberAccount.find(ma.id)
              elsif ma[:account_subtype] == "Share Capital"
                @sc = MemberAccount.find(ma.id)
              end
            end
            csv << [@member.full_name,@member.branch.name,@kimpok.balance.to_f.round(2),@mbs.balance.to_f.round(2),@gk.balance.to_f.round(2),@sif.balance.to_f,@cbu.balance.to_f,@sc.balance.to_f]
            csv << ["LOAN PRODUCT", "PRINCIPAL BALANCE", "INTEREST BALANCE"]
            writeoff_loans = @member.loans.writeoff
            writeoff_loans.each do |wl|
              loan = Loan.find(wl.id)
              csv << ["#{loan.loan_product.name}","#{loan.principal_balance}","#{loan.interest_balance}"]

            end
            csv << []

          end

        end
      end
  end

  task :remove_writeoff_payment_year_2021 => :environment do
    year = "2021"
    @data = DataStore.billing_for_writeoff.where("meta->> 'as_of' = ? ","#{year}").order(Arel.sql("meta->>'branch_id'"))
      @data.each do |d|
        @date_approve = d["meta"]["date_approved"]

        records = DataStore.find(d.id)
        records_data = records.data.with_indifferent_access
        records_data[:record].each do |r|
          loan = Loan.find(r[:loan][:loan_id])
          account_transaction = AccountTransaction.where(subsidiary_id: loan.id,transacted_at: @date_approve).first
          if account_transaction.present?
            AccountTransaction.find(account_transaction.id).destroy!
            puts "deleting account_transaction with an ID #{account_transaction.id}"
            ::Loans::FixAmort.new(loan: loan).execute!
            loan.update(status: "writeoff")
          end
        end
      end

  end
end
