module Branches
  class FetchMemberQuarterlyReports
    def initialize(config:)
      @config = config
      @as_of    = @config[:as_of].try(:to_date) || Date.today
      # live
      @start_date = Date.today.beginning_of_year
      @end_date = @as_of.end_of_month
      
      if @start_date.present? && @end_date.present?
        @active_members             = Member.where("data ->> 'recognition_date' <= ? AND insurance_status IN (?)", @end_date, ["inforce", "lapsed"])
        @resigned_before            = Member.where("data ->> 'recognition_date' <= ? AND insurance_date_resigned >= ?", @end_date, @end_date)
        # GK
        @gk_members                 = Member.where("member_type = ?", "GK")
        @gk_members_ytd             = Member.where("member_type = ? AND insurance_date_resigned >= ? AND insurance_date_resigned <= ?", "GK", @start_date, @end_date)
        @gk_members_male            = @gk_members_ytd.where("gender IN (?)", ["Male", "Others"])
        @gk_members_female          = @gk_members_ytd.where("gender = ?", "Female")
        # inforce
        @active_inforce_members     = Member.where("data ->> 'recognition_date' <= ? AND insurance_status = ?", @end_date, "inforce")
        @resigned_before_inforce    = ::Members::FetchInsuranceMembers.new(config: {members: @resigned_before, as_of: @end_date, insurance_status: "inforce"}).execute!
        @all_inforce                = @active_inforce_members + @resigned_before_inforce
        #lapse
        @active_lapsed_members      = Member.where("data ->> 'recognition_date' <= ? AND insurance_status = ?", @end_date, "lapsed")
        @resigned_before_lapsed     = ::Members::FetchInsuranceMembers.new(config: {members: @resigned_before, as_of: @end_date, insurance_status: "lapsed"}).execute!
        @all_lapsed                 = @active_lapsed_members + @resigned_before_lapsed           
        # Dormant
        @active_dormant_members     = Member.where("data ->> 'recognition_date' <= ? AND insurance_status = ?", @end_date, "dormant")
        @resigned_before_dormant    = ::Members::FetchInsuranceMembers.new(config: {members: @resigned_before, as_of: @end_date, insurance_status: "dormant"}).execute!
        @all_dormant                = @active_dormant_members + @resigned_before_dormant        
        @all_active_members         = @all_inforce
        @all_inforce_lapsed         = @all_inforce + @active_lapsed_members    
        # Resigned
        @resigned_members             = Member.insurance_resigned.where("insurance_date_resigned >= ? AND insurance_date_resigned <= ? AND data ->> 'recognition_date' >= ?", @start_date, @end_date, @start_date)
        @all_resigned_members         = Member.insurance_resigned.where("insurance_date_resigned <= ?", @end_date)
        @active_resigned_insurance    = Member.active.where("data ->> 'recognition_date' <= ? AND insurance_status = ?", @end_date, "resigned")
        @resigned_old_members         = @all_resigned_members.where("insurance_date_resigned >= ? AND insurance_date_resigned <= ? AND data ->> 'recognition_date' < ?", @start_date, @end_date, @start_date )
        @resigned_old_members_male    = @resigned_old_members.select{|o| o[:gender] == "Male" || o[:gender] == "Others"}
        @resigned_old_members_female  = @resigned_old_members.select{|o| o[:gender] == "Female"}
        @resigned_ytd                 = @resigned_members + @resigned_old_members
        #resigned MFI
        @resigned_inforce           = Member.where("status = ? AND insurance_status = ? AND date_resigned <= ?", "resigned", "inforce", @end_date)
        @resigned_lapsed            = Member.where("status = ? AND insurance_status = ? AND date_resigned <= ?", "resigned", "lapsed", @end_date)
        @resigned_dormant           = Member.where("status = ? AND insurance_status = ? AND date_resigned <= ?", "resigned", "dormant", @end_date)
        @pending                    = Member.where("created_at <= ? AND insurance_status = ? AND member_type = ?", @end_date, "pending", "Regular")
        
        @new_members                = Member.where("data ->> 'recognition_date' >= ? AND data ->>'recognition_date' <= ? AND insurance_status IN (?)", @start_date, @end_date, ["inforce", "lapsed", "dormant"])
        @new_male_members           = @new_members.select{|o| o[:gender] == "Male" || o[:gender] == "Others"}
        @new_female_members         = @new_members.select{|o| o[:gender] == "Female"}

        @male_members               = @all_inforce_lapsed.select{|o| o[:gender] == "Male" || o[:gender] == "Others"}
        @female_members             = @all_inforce_lapsed.select{|o| o[:gender] == "Female"}
        @members_with_spouse        = @all_inforce_lapsed.select{|o| o.data["spouse"]["first_name"] != nil && o.data["spouse"]["first_name"] != 'N/A' }
        @members_with_spouse_ytd    = @all_inforce_lapsed.select{|o| o.data["recognition_date"].to_date >= @start_date && o.data["recognition_date"].to_date <= @end_date && o.data["spouse"]["first_name"] != nil && o.data["spouse"]["first_name"] != 'N/A' }        
        # Single
        @single_members_lc          = @all_inforce_lapsed.select{|o| o[:civil_status] == "single"}
        @single_members_up          = @all_inforce_lapsed.select{|o| o[:civil_status] == "SINGLE"}
        @single_members_proper      = @all_inforce_lapsed.select{|o| o[:civil_status] == "Single"}
        @single_members             = @single_members_lc + @single_members_up + @single_members_proper
        @single_male_members        = @single_members.select{|o| o[:gender] == "Male" || o[:gender] == "Others"}
        @single_female_members      = @single_members.select{|o| o[:gender] == "Female"}
        # Married
        @married_members_up         = @all_inforce_lapsed.select{|o| o[:civil_status] == "KASAL"}
        @married_members_proper     = @all_inforce_lapsed.select{|o| o[:civil_status] == "Kasal"}
        @married_members_english    = @all_inforce_lapsed.select{|o| o[:civil_status] == "married"}
        @married_members            = @married_members_up + @married_members_proper + @married_members_english
        @married_male_members       = @married_members.select{|o| o[:gender] == "Male" || o[:gender] == "Others"}
        @married_female_members     = @married_members.select{|o| o[:gender] == "Female"}        
        # Maykinakasama
        @maykinakasama_members_proper  = @all_inforce_lapsed.select{|o| o[:civil_status] == "May Kinakasama"}
        @maykinakasama_members_up      = @all_inforce_lapsed.select{|o| o[:civil_status] == "MAY KINAKASAMA"}
        @maykinakasama_members         = @maykinakasama_members_proper + @maykinakasama_members_up
        @maykinakasama_male_members    = @maykinakasama_members.select{|o| o[:gender] == "Male" || o[:gender] == "Others"}
        @maykinakasama_female_members  = @maykinakasama_members.select{|o| o[:gender] == "Female"}
        # Hiwalay
        @hiwalay_members_proper   = @all_inforce_lapsed.select{|o| o[:civil_status] == "Hiwalay"}
        @hiwalay_members_english  = @all_inforce_lapsed.select{|o| o[:civil_status] == "separated"}
        @hiwalay_members          = @hiwalay_members_proper + @hiwalay_members_english
        @hiwalay_male_members     = @hiwalay_members.select{|o| o[:gender] == "Male" || o[:gender] == "Others"}
        @hiwalay_female_members   = @hiwalay_members.select{|o| o[:gender] == "Female"}
        # Biyudo/a
        @biyuda_members_proper    = @all_inforce_lapsed.select{|o| o[:civil_status] == "Biyudo/a"}
        @biyuda_members_up        = @all_inforce_lapsed.select{|o| o[:civil_status] == "BIYUDO/A"}
        @biyuda_members_english   = @all_inforce_lapsed.select{|o| o[:civil_status] == "widowed"}
        @biyuda_members           = @biyuda_members_proper + @biyuda_members_up + @biyuda_members_english
        @biyuda_male_members      = @biyuda_members.select{|o| o[:gender] == "Male" || o[:gender] == "Others"}
        @biyuda_female_members    = @biyuda_members.select{|o| o[:gender] == "Female"}
        # length of membership
        @length_of_stay_member_3m         = @all_inforce_lapsed.select{|o| (@end_date - o.data["recognition_date"].to_date).to_i <= 91}
        @length_of_stay_member_3m_1yr     = @all_inforce_lapsed.select{|o| (@end_date - o.data["recognition_date"].to_date).to_i >= 92 && (@end_date.to_date - o.data["recognition_date"].to_date).to_i <= 365}
        @length_of_stay_member_1yr_2yr    = @all_inforce_lapsed.select{|o| (@end_date - o.data["recognition_date"].to_date).to_i >= 366 && (@end_date.to_date - o.data["recognition_date"].to_date).to_i <= 730}
        @length_of_stay_member_2yrs_3yr   = @all_inforce_lapsed.select{|o| (@end_date - o.data["recognition_date"].to_date).to_i >= 731 && (@end_date.to_date - o.data["recognition_date"].to_date).to_i <= 1895}
        @length_of_stay_member_3yr_above  = @all_inforce_lapsed.select{|o| (@end_date - o.data["recognition_date"].to_date).to_i >= 1896 }

      else
        @all_members                = Member.all.order("last_name ASC")
      end
    end

    def execute!
      @data = {}
      @data[:members] = []
      @data[:total_members] = []

      @total_active = 0
      @total_all_resigned = 0
      @total_active_lapsed = 0
      @total_active_inforce = 0
      @total_active_dormant = 0
      @total_new = 0
      @total_new_male = 0
      @total_new_female = 0
      @total_resigned = 0
      @total_resigned_old = 0
      @total_resigned_old_male = 0
      @total_resigned_old_female = 0
      @total_resigned_ytd = 0
      @total_pending = 0
      @total_active_resigned_insurance = 0
      #@total_resigned_before = 0
      @total_resigned_before_inforce = 0
      @total_resigned_before_lapsed = 0
      @total_resigned_before_dormant = 0
      @total_male = 0
      @total_female = 0
      # GK
      @total_gk = 0
      @total_gk_ytd = 0
      @total_gk_male = 0
      @total_gk_female = 0
      # Dependents
      @total_valid_dependent = 0
      @total_valid_dependent_ytd = 0
      @total_with_spouse = 0
      @total_with_spouse_ytd = 0
      # Single
      @total_single = 0
      @total_single_male = 0
      @total_single_female = 0
      # Biyuda/o
      @total_biyuda = 0
      @total_biyuda_male = 0
      @total_biyuda_female = 0
      # Married
      @total_married = 0
      @total_married_male = 0
      @total_married_female = 0
      # Maykinakasama
      @total_maykinakasama = 0
      @total_maykinakasama_male = 0
      @total_maykinakasama_female = 0
      # Hiwalay
      @total_hiwalay = 0
      @total_hiwalay_male = 0
      @total_hiwalay_female = 0
      @total_inforce_male = 0
      @total_inforce_female = 0
      @total_lapsed_male = 0
      @total_lapsed_female = 0
      @total_dormant_male = 0
      @total_dormant_female = 0
      # Resigned
      @total_resigned_male = 0
      @total_resigned_female = 0
      @total_resigned_inforce = 0
      @total_resigned_lapsed = 0
      @total_resigned_dormant = 0
      # Length of membership
      @total_length_of_stay_member_3m = 0
      @total_length_of_stay_member_3m_1yr = 0
      @total_length_of_stay_member_1yr_2yr = 0
      @total_length_of_stay_member_2yrs_3yr = 0
      @total_length_of_stay_member_3yr_above = 0

      @total_dependent_3m_benefit = 0
      @total_dependent_3m_1yr_benefit = 0
      @total_dependent_1yr_2yr_benefit = 0
      @total_dependent_2yr_3yr_benefit = 0
      @total_dependent_3yr_above_benefit = 0
      
      @total_member_3m_benefit = 0
      @total_member_3m_1yr_benefit = 0
      @total_member_1yr_2yr_benefit = 0
      @total_member_2yr_3yr_benefit = 0
      @total_member_3yr_above_benefit = 0

      Branch.all.order("cluster_id ASC").each do |branch|
        member = {}
        
        member[:branch] = branch.name
        
        member[:gk_count] = @gk_members.where(branch_id: branch).count
        member[:gk_count_ytd] = @gk_members_ytd.where(branch_id: branch).count
        member[:gk_count_male] = @gk_members_male.where(branch_id: branch).count
        member[:gk_count_female] = @gk_members_female.where(branch_id: branch).count
        member[:active_count] = @all_active_members.select{|o| o[:branch_id] == branch.id}.count
        member[:all_resigned_count] = @all_resigned_members.where(branch_id: branch).count
        member[:active_lapsed_count] = @all_lapsed.select{|o| o[:branch_id] == branch.id}.count
        member[:active_inforce_count] = @all_inforce.select{|o| o[:branch_id] == branch.id}.count
        member[:active_dormant_count] = @all_dormant.select{|o| o[:branch_id] == branch.id}.count
        member[:resigned_count] = @resigned_members.where(branch_id: branch).count
        member[:resigned_old_count] = @resigned_old_members.select{|o| o[:branch_id] == branch.id}.count
        member[:resigned_old_male_count] = @resigned_old_members_male.select{|o| o[:branch_id] == branch.id}.count
        member[:resigned_old_female_count] = @resigned_old_members_female.select{|o| o[:branch_id] == branch.id}.count
        member[:resigned_ytd_count] = @resigned_ytd.select{|o| o[:branch_id] == branch.id}.count
        member[:new_count] = @new_members.where(branch_id: branch).count
        member[:new_count_male] = @new_male_members.select{|o| o[:branch_id] == branch.id and (o[:gender] == "Male" or o[:gender] == "Others")}.count
        member[:new_count_female] = @new_female_members.select{|o| o[:branch_id] == branch.id and o[:gender] == "Female"}.count
        member[:pending] = @pending.where(branch_id: branch).count
        member[:active_resigned_insurance] = @active_resigned_insurance.where(branch_id: branch).count
        member[:male_inforce_count] = @all_inforce.select{|o| o[:branch_id] == branch.id and (o[:gender] == "Male" or o[:gender] == "Others")}.count
        member[:female_inforce_count] = @all_inforce.select{|o| o[:branch_id] == branch.id and o[:gender] == "Female"}.count
        member[:male_dormant_count] = @all_dormant.select{|o| o[:branch_id] == branch.id and (o[:gender] == "Male" or o[:gender] == "Others")}.count
        member[:female_dormant_count] = @all_dormant.select{|o| o[:branch_id] == branch.id and o[:gender] == "Female"}.count        
        member[:male_lapsed_count] = @all_lapsed.select{|o| o[:branch_id] == branch.id and (o[:gender] == "Male" or o[:gender] == "Others")}.count
        member[:female_lapsed_count] = @all_lapsed.select{|o| o[:branch_id] == branch.id and o[:gender] == "Female"}.count
        member[:male_resigned_count] = @resigned_members.where(branch_id: branch, gender: ["Male", "Others"]).count
        member[:female_resigned_count] = @resigned_members.where(branch_id: branch, gender: "Female").count       
        member[:male_count] = @male_members.select{|o| o[:branch_id] == branch.id}.count
        member[:female_count] = @female_members.select{|o| o[:branch_id] == branch.id}.count
        member[:member_with_spouse_count] = @members_with_spouse.select{|o| o[:branch_id] == branch.id}.count
        member[:member_with_spouse_ytd_count] = @members_with_spouse_ytd.select{|o| o[:branch_id] == branch.id}.count
        member[:valid_dependent_count] = LegalDependent.joins(:member).where("members.branch_id = ? AND members.data ->> 'recognition_date' <= ? AND members.insurance_status IN (?)", branch, @end_date, ['inforce', 'lapsed']).where("legal_dependents.date_of_birth::date >= ?",20.years.ago).count + member[:member_with_spouse_count]
        member[:valid_dependent_ytd_count] = LegalDependent.joins(:member).where("members.branch_id = ? AND members.data ->> 'recognition_date' <= ? AND members.insurance_status IN (?) AND members.data ->> 'recognition_date' >= ?", branch, @end_date, ['inforce', 'lapsed'], @start_date).where("legal_dependents.date_of_birth::date >= ?",20.years.ago).count + member[:member_with_spouse_ytd_count]
        member[:resigned_inforce_count] = @resigned_inforce.where(branch_id: branch).count
        member[:resigned_lapsed_count] = @resigned_lapsed.where(branch_id: branch).count
        member[:resigned_dormant_count] = @resigned_dormant.where(branch_id: branch).count        
        member[:single] = @single_members.select{|o| o[:branch_id] == branch.id}.count
        member[:single_male_members] = @single_male_members.select{|o| o[:branch_id] == branch.id}.count
        member[:single_female_members] = @single_female_members.select{|o| o[:branch_id] == branch.id}.count        
        member[:married] = @married_members.select{|o| o[:branch_id] == branch.id}.count
        member[:married_male_members] = @married_male_members.select{|o| o[:branch_id] == branch.id}.count
        member[:married_female_members] = @married_female_members.select{|o| o[:branch_id] == branch.id}.count       
        member[:maykinakasama] = @maykinakasama_members.select{|o| o[:branch_id] == branch.id}.count
        member[:maykinakasama_male_members] = @maykinakasama_male_members.select{|o| o[:branch_id] == branch.id}.count
        member[:maykinakasama_female_members] = @maykinakasama_female_members.select{|o| o[:branch_id] == branch.id}.count
        member[:hiwalay] = @hiwalay_members.select{|o| o[:branch_id] == branch.id}.count
        member[:hiwalay_male_members] = @hiwalay_male_members.select{|o| o[:branch_id] == branch.id}.count
        member[:hiwalay_female_members] = @hiwalay_female_members.select{|o| o[:branch_id] == branch.id}.count
        member[:biyuda] = @biyuda_members.select{|o| o[:branch_id] == branch.id}.count
        member[:biyuda_male_members] = @biyuda_male_members.select{|o| o[:branch_id] == branch.id}.count
        member[:biyuda_female_members] = @biyuda_female_members.select{|o| o[:branch_id] == branch.id}.count

        member[:length_of_stay_member_3m_count] = @length_of_stay_member_3m.select{|o| o[:branch_id] == branch.id}.count
        member[:length_of_stay_member_3m_1yr_count] = @length_of_stay_member_3m_1yr.select{|o| o[:branch_id] == branch.id}.count
        member[:length_of_stay_member_1yr_2yr_count] = @length_of_stay_member_1yr_2yr.select{|o| o[:branch_id] == branch.id}.count
        member[:length_of_stay_member_2yrs_3yr_count] = @length_of_stay_member_2yrs_3yr.select{|o| o[:branch_id] == branch.id}.count
        member[:length_of_stay_member_3yr_above_count] = @length_of_stay_member_3yr_above.select{|o| o[:branch_id] == branch.id}.count
        # Compute nf Member Benefit
        member[:length_of_stay_member_benefit_3m_count] = (@length_of_stay_member_3m.select{|o| o[:branch_id] == branch.id}.count) * 2000
        member[:length_of_stay_member_benefit_3m_1yr_count] = (@length_of_stay_member_3m_1yr.select{|o| o[:branch_id] == branch.id}.count) * 6000
        member[:length_of_stay_member_benefit_1yr_2yr_count] = (@length_of_stay_member_1yr_2yr.select{|o| o[:branch_id] == branch.id}.count) * 10000
        member[:length_of_stay_member_benefit_2yrs_3yr_count] = (@length_of_stay_member_2yrs_3yr.select{|o| o[:branch_id] == branch.id}.count) * 30000
        member[:length_of_stay_member_benefit_3yr_above_count] = (@length_of_stay_member_3yr_above.select{|o| o[:branch_id] == branch.id}.count) * 50000

        # member[:valid_dependent_3m_count] = @length_of_stay_member_3m.joins(:legal_dependents).where("members.branch_id = ? AND members.data ->> 'recognition_date' <= ? AND members.insurance_status IN (?)", branch, @end_date, ['inforce', 'lapsed']).where("legal_dependents.date_of_birth::date >= ?",20.years.ago).count + member[:member_with_spouse_count]
        # raise member[:valid_dependent_3m_count].inspect

        @total_resigned += @resigned_members.where(branch_id: branch).count
        @total_resigned_old += @resigned_old_members.select{|o| o[:branch_id] == branch.id}.count
        @total_resigned_old_male += @resigned_old_members_male.select{|o| o[:branch_id] == branch.id}.count
        @total_resigned_old_female += @resigned_old_members_female.select{|o| o[:branch_id] == branch.id}.count
        @total_resigned_ytd += @resigned_ytd.select{|o| o[:branch_id] == branch.id}.count
        @total_all_resigned += @all_resigned_members.where(branch_id: branch).count
        @total_new += @new_members.where(branch_id: branch).count
        @total_new_male += @new_male_members.select{|o| o[:branch_id] == branch.id and (o[:gender] == "Male" or o[:gender] == "Others")}.count
        @total_new_female += @new_female_members.select{|o| o[:branch_id] == branch.id and o[:gender] == "Female"}.count

        @total_active += @all_active_members.select{|o| o[:branch_id] == branch.id}.count
        @total_active_lapsed += @all_lapsed.select{|o| o[:branch_id] == branch.id}.count
        @total_active_inforce += @all_inforce.select{|o| o[:branch_id] == branch.id}.count
        @total_active_dormant += @all_dormant.select{|o| o[:branch_id] == branch.id}.count
        @total_pending += @pending.where(branch_id: branch).count
        @total_active_resigned_insurance += @active_resigned_insurance.where(branch_id: branch).count
        @total_male += @male_members.select{|o| o[:branch_id] == branch.id}.count
        @total_gk += @gk_members.where(branch_id: branch).count
        @total_gk_ytd += @gk_members_ytd.where(branch_id: branch).count
        @total_gk_male += @gk_members_male.where(branch_id: branch).count
        @total_gk_female += @gk_members_female.where(branch_id: branch).count
        # All Valid Dependent
        @total_with_spouse += @members_with_spouse.select{|o| o[:branch_id] == branch.id}.count
        @total_valid_dependent += LegalDependent.joins(:member).where("members.branch_id = ? AND members.data ->> 'recognition_date' <= ?", branch, @end_date).where("legal_dependents.date_of_birth::date >= ?",20.years.ago).count 
        # Valid Dependent YTD
        @total_with_spouse_ytd += @members_with_spouse_ytd.select{|o| o[:branch_id] == branch.id}.count
        @total_valid_dependent_ytd += LegalDependent.joins(:member).where("members.branch_id = ? AND members.data ->> 'recognition_date' <= ? AND members.data ->> 'recognition_date' >= ?", branch, @end_date, @start_date).where("legal_dependents.date_of_birth::date >= ?",20.years.ago).count 
        
        @total_female += @female_members.select{|o| o[:branch_id] == branch.id}.count
        @total_inforce_male += @all_inforce.select{|o| o[:branch_id] == branch.id and (o[:gender] == "Male" or o[:gender] == "Others")}.count
        @total_inforce_female += @all_inforce.select{|o| o[:branch_id] == branch.id and o[:gender] == "Female"}.count
        @total_lapsed_male += @all_lapsed.select{|o| o[:branch_id] == branch.id and (o[:gender] == "Male" or o[:gender] == "Others")}.count
        # raise a.inspect 
        @total_lapsed_female += @all_lapsed.select{|o| o[:branch_id] == branch.id and o[:gender] == "Female"}.count
        @total_dormant_male += @all_dormant.select{|o| o[:branch_id] == branch.id and o[:gender] == "Male"}.count
        @total_dormant_female += @all_dormant.select{|o| o[:branch_id] == branch.id and o[:gender] == "Female"}.count        
        @total_resigned_male += @resigned_members.where(branch_id: branch, gender: ["Male", "Others"]).count
        @total_resigned_female += @resigned_members.where(branch_id: branch, gender: "Female").count    
   
        @total_resigned_inforce += @resigned_inforce.where(branch_id: branch).count
        @total_resigned_lapsed += @resigned_lapsed.where(branch_id: branch).count
        @total_resigned_dormant += @resigned_dormant.where(branch_id: branch).count        
        @total_single += @single_members.select{|o| o[:branch_id] == branch.id}.count
        @total_single_male += @single_male_members.select{|o| o[:branch_id] == branch.id}.count
        @total_single_female += @single_female_members.select{|o| o[:branch_id] == branch.id}.count
        @total_married += @married_members.select{|o| o[:branch_id] == branch.id}.count
        @total_married_male += @married_male_members.select{|o| o[:branch_id] == branch.id}.count
        @total_married_female += @married_female_members.select{|o| o[:branch_id] == branch.id}.count
        @total_maykinakasama += @maykinakasama_members.select{|o| o[:branch_id] == branch.id}.count
        @total_maykinakasama_male += @maykinakasama_male_members.select{|o| o[:branch_id] == branch.id}.count
        @total_maykinakasama_female += @maykinakasama_female_members.select{|o| o[:branch_id] == branch.id}.count
        @total_hiwalay += @hiwalay_members.select{|o| o[:branch_id] == branch.id}.count
        @total_hiwalay_male += @hiwalay_male_members.select{|o| o[:branch_id] == branch.id}.count
        @total_hiwalay_female += @hiwalay_female_members.select{|o| o[:branch_id] == branch.id}.count
        @total_biyuda += @biyuda_members.select{|o| o[:branch_id] == branch.id}.count
        @total_biyuda_male += @biyuda_male_members.select{|o| o[:branch_id] == branch.id}.count
        @total_biyuda_female += @biyuda_female_members.select{|o| o[:branch_id] == branch.id}.count

        @total_length_of_stay_member_3m += @length_of_stay_member_3m.select{|o| o[:branch_id] == branch.id}.count
        @total_length_of_stay_member_3m_1yr += @length_of_stay_member_3m_1yr.select{|o| o[:branch_id] == branch.id}.count
        @total_length_of_stay_member_1yr_2yr += @length_of_stay_member_1yr_2yr.select{|o| o[:branch_id] == branch.id}.count
        @total_length_of_stay_member_2yrs_3yr += @length_of_stay_member_2yrs_3yr.select{|o| o[:branch_id] == branch.id}.count
        @total_length_of_stay_member_3yr_above += @length_of_stay_member_3yr_above.select{|o| o[:branch_id] == branch.id}.count

        @total_member_3m_benefit += @length_of_stay_member_3m.select{|o| o[:branch_id] == branch.id}.count * 2000 
        @total_member_3m_1yr_benefit += @length_of_stay_member_3m_1yr.select{|o| o[:branch_id] == branch.id}.count * 6000
        @total_member_1yr_2yr_benefit += @length_of_stay_member_1yr_2yr.select{|o| o[:branch_id] == branch.id}.count * 10000
        @total_member_2yr_3yr_benefit += @length_of_stay_member_2yrs_3yr.select{|o| o[:branch_id] == branch.id}.count * 30000
        @total_member_3yr_above_benefit += @length_of_stay_member_3yr_above.select{|o| o[:branch_id] == branch.id}.count * 50000

        @data[:members] << member
      end

      @total = {}
      @total[:total_gk] = @total_gk
      @total[:total_gk_ytd] = @total_gk_ytd
      @total[:total_gk_male] = @total_gk_male
      @total[:total_gk_female] = @total_gk_female
      @total[:total_resigned] = @total_resigned
      @total[:total_resigned_old] = @total_resigned_old
      @total[:total_resigned_old_male] = @total_resigned_old_male
      @total[:total_resigned_old_female] = @total_resigned_old_female
      @total[:total_resigned_ytd] = @total_resigned_ytd
      @total[:total_all_resigned] = @total_all_resigned
      @total[:total_new] = @total_new
      @total[:total_new_male] = @total_new_male
      @total[:total_new_female] = @total_new_female
      @total[:total_active] = @total_active
      @total[:total_active_lapsed] = @total_active_lapsed
      @total[:total_active_inforce] = @total_active_inforce
      @total[:total_active_dormant] = @total_active_dormant
      @total[:total_pending] = @total_pending
      @total[:total_active_resigned_insurance] = @total_active_resigned_insurance
      @total[:total_male] = @total_male
      @total[:total_inforce_male] = @total_inforce_male
      @total[:total_inforce_female] = @total_inforce_female
      @total[:total_dormant_male] = @total_dormant_male
      @total[:total_dormant_female] = @total_dormant_female
      @total[:total_lapsed_male] = @total_lapsed_male
      @total[:total_lapsed_female] = @total_lapsed_female
      @total[:total_resigned_male] = @total_resigned_male
      @total[:total_resigned_female] = @total_resigned_female
      @total[:total_female] = @total_female
      @total[:total_with_spouse] = @total_with_spouse
      @total[:total_valid_dependent] = @total_valid_dependent + @total_with_spouse
      @total[:total_with_spouse_ytd] = @total_with_spouse_ytd
      @total[:total_valid_dependent_ytd] = @total_valid_dependent_ytd + @total_with_spouse_ytd      
      @total[:total_single] = @total_single
      @total[:total_single_male] = @total_single_male
      @total[:total_single_female] = @total_single_female      
      @total[:total_married] = @total_married
      @total[:total_married_male] = @total_married_male
      @total[:total_married_female] = @total_married_female
      @total[:total_maykinakasama] = @total_maykinakasama
      @total[:total_maykinakasama_male] = @total_maykinakasama_male
      @total[:total_maykinakasama_female] = @total_maykinakasama_female
      @total[:total_hiwalay] = @total_hiwalay
      @total[:total_hiwalay_male] = @total_hiwalay_male
      @total[:total_hiwalay_female] = @total_hiwalay_female
      @total[:total_biyuda] = @total_biyuda
      @total[:total_biyuda_male] = @total_biyuda_male
      @total[:total_biyuda_female] = @total_biyuda_female
      @total[:total_resigned_inforce] = @total_resigned_inforce
      @total[:total_resigned_lapsed] = @total_resigned_lapsed
      @total[:total_resigned_dormant] = @total_resigned_dormant

      @total[:total_length_of_stay_member_3m] = @total_length_of_stay_member_3m
      @total[:total_length_of_stay_member_3m_1yr] = @total_length_of_stay_member_3m_1yr
      @total[:total_length_of_stay_member_1yr_2yr] = @total_length_of_stay_member_1yr_2yr
      @total[:total_length_of_stay_member_2yrs_3yr] = @total_length_of_stay_member_2yrs_3yr
      @total[:total_length_of_stay_member_3yr_above] = @total_length_of_stay_member_3yr_above

      @total[:total_member_3m_benefit] = @total_member_3m_benefit
      @total[:total_member_3m_1yr_benefit] = @total_member_3m_1yr_benefit
      @total[:total_member_1yr_2yr_benefit] = @total_member_1yr_2yr_benefit
      @total[:total_member_2yr_3yr_benefit] = @total_member_2yr_3yr_benefit
      @total[:total_member_3yr_above_benefit] = @total_member_3yr_above_benefit
      
      @data[:total_members] << @total

      @data 
    end
  end
end