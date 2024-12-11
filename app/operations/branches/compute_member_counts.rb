module Branches
  class ComputeMemberCounts
    def initialize(config:)
      @config = config

      @branch   = @config[:branch]
      @as_of    = @config[:as_of].try(:to_date) || Date.today
      @cluster  = @branch.cluster
      @area     = @cluster.area

      if Settings.activate_microloans
        @members          = ReadOnlyMember.active.where(
                              "branch_id = ?",
                              @branch.id
                            )

      @resigned_members = ReadOnlyMember.resigned.where(
                            "date_resigned > ? AND branch_id = ?", 
                            @as_of, 
                            @branch.id
                          )
      else
        @members          = ReadOnlyMember.active

        @resigned_members = ReadOnlyMember.resigned.where(
                            "date_resigned > ?", 
                            @as_of
                          )
      end


      @members  = ReadOnlyMember.where(id: [@members.pluck(:id) + @resigned_members.pluck(:id)])

      @default_savings_key  = Settings.default_savings_key
      @member_accounts      = MemberAccount.where(
                                account_subtype: @default_savings_key,
                                branch_id: @branch.id
                              )

      @account_transactions = AccountTransaction.savings.where(
                                "DATE(transacted_at) <= ? AND subsidiary_id IN (?)",
                                @as_of,
                                @member_accounts.pluck(:id)
                              )

      @valid_member_accounts  = @member_accounts.where(
                                  id: @account_transactions.pluck(:subsidiary_id).uniq
                                )

      @member_types = Settings.default_member_types

      if @member_types.blank?
        raise "default_member_types not found"
      end

      @data = {
        member_type_counts: [],
        counts: {
          pure_savers: {
            male: 0,
            female: 0,
            others: 0,
            total: 0,
            members: []
          },
          loaners: {
            male: 0,
            female: 0,
            others: 0,
            total: 0,
            members: []
          
          },
          inactive_members: {
            male: 0,
            female: 0,
            others: 0,
            total: 0,
            members: []
          },
          active_members: {
            inforce: 0,
            lapsed: 0,
            pending: 0,
            male: 0,
            female: 0,
            others: 0,
            total: 0,
            female_inforce: 0,
            male_inforce: 0,
            female_pending: 0,
            male_pending: 0,
            female_lapsed: 0,
            male_lapsed: 0,
            members: []
          }
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
        as_of: @as_of,
      }
    end

    def execute!
      if Settings.activate_microloans
        compute_member_counts_for_mfi!  
      elsif Settings.activate_microinsurance
        compute_member_counts_for_mii!
      end

      @data
    end

    private

    def compute_member_counts_for_mii!
      @active_members = Member.active.where(
                            "branch_id = ?",
                            @branch.id
                          )
      # Active Members = Pure Savers + Loaners
      total_inforce        = @active_members.where(insurance_status: "inforce").count
      total_lapsed         = @active_members.where(insurance_status: "lapsed").count
      total_pending        = @active_members.where(insurance_status: "pending").count
      total_female_inforce = @active_members.where(insurance_status: "inforce", gender: "Female").count
      total_male_inforce   = @active_members.where(insurance_status: "inforce", gender: "Male").count
      total_female_pending = @active_members.where(insurance_status: "pending", gender: "Female").count
      total_male_pending   = @active_members.where(insurance_status: "pending", gender: "Male").count
      total_female_lapsed  = @active_members.where(insurance_status: "lapsed", gender: "Female").count
      total_male_lapsed    = @active_members.where(insurance_status: "lapsed", gender: "Male").count
      total_female         = @active_members.where(gender: "Female").count
      total_male           = @active_members.where(gender: "Male").count
      total_others         = @active_members.where(gender: "Others").count
      total                = total_female + total_male + total_others

      @data[:counts][:active_members][:inforce] = total_inforce
      @data[:counts][:active_members][:lapsed] = total_lapsed
      @data[:counts][:active_members][:pending] = total_pending
      @data[:counts][:active_members][:female] = total_female
      @data[:counts][:active_members][:male]   = total_male
      @data[:counts][:active_members][:others] = total_others
      @data[:counts][:active_members][:female_inforce] = total_female_inforce
      @data[:counts][:active_members][:male_inforce] = total_male_inforce
      @data[:counts][:active_members][:female_lapsed] = total_female_lapsed
      @data[:counts][:active_members][:male_lapsed] = total_male_lapsed
      @data[:counts][:active_members][:female_pending] = total_female_pending
      @data[:counts][:active_members][:male_pending] = total_male_pending
      @data[:counts][:active_members][:others] = total_others
      
      @data[:counts][:active_members][:total]  = total

      @data[:counts][:active_members][:members] = @active_members.map{ |m|
                                                    {
                                                      id: m.id,
                                                      identification_number: m.identification_number,
                                                      first_name: m.first_name,
                                                      middle_name: m.middle_name,
                                                      last_name: m.last_name,
                                                      member_type: m.member_type,
                                                      branch: {
                                                        id: m.branch.id,
                                                        name: m.branch.name
                                                      },
                                                      center: {
                                                        id: m.center.id,
                                                        name: m.center.name
                                                      }
                                                    }
                                                  }


      compute_member_types!
    end

    def compute_member_counts_for_mfi!
      @active_loans       = ::Loans::FetchActiveAsOf.new(
                              config: {
                                as_of: @as_of,
                                branch: @branch
                              }
                            ).execute!

      @member_loaners     = @members.where(id: @active_loans.pluck(:member_id).uniq)


      # Pure Savers
      @data[:counts][:pure_savers]  = ::Stats::ComputePureSavers.new(
                                        config: {
                                          as_of: @as_of,
                                          branch: @branch
                                        }
                                      ).execute!

      @member_pure_savers = Member.where(
                              id: @data[:counts][:pure_savers][:members].map{ |o|
                                    o[:id]
                                  }
                            ).where.not(
                              id: @member_loaners.pluck(:id).uniq
                            )

      @active_members     = @members.where.not(id: [@member_pure_savers.pluck(:id) + @member_loaners.pluck(:id)])

      # Loaners
      total_female  = @member_loaners.where(gender: "Female").count
      total_male    = @member_loaners.where(gender: "Male").count
      total_others  = @member_loaners.where(gender: "Others").count
      total         = total_female + total_male + total_others

      @data[:counts][:loaners][:female] = total_female
      @data[:counts][:loaners][:male]   = total_male
      @data[:counts][:loaners][:others] = total_others
      @data[:counts][:loaners][:total]  = total

      @data[:counts][:loaners][:members]  = @member_loaners.map{ |m|
                                              {
                                                id: m.id,
                                                identification_number: m.identification_number,
                                                first_name: m.first_name,
                                                middle_name: m.middle_name,
                                                last_name: m.last_name,
                                                member_type: m.member_type,
                                                gender: m.gender,
                                                branch: {
                                                  id: m.branch.id,
                                                  name: m.branch.name
                                                },
                                                center: {
                                                  id: m.center.id,
                                                  name: m.center.name
                                                },
                                                officer: {
                                                  id: m.center.user.id,
                                                  first_name: m.center.user.first_name,
                                                  last_name: m.center.user.last_name
                                                }
                                              }
                                            }

      # Active Members = Pure Savers + Loaners
      total_female  = @active_members.where(gender: "Female").count
      total_male    = @active_members.where(gender: "Male").count
      total_others  = @active_members.where(gender: "Others").count
      total         = total_female + total_male + total_others

      @data[:counts][:active_members][:female] = total_female
      @data[:counts][:active_members][:male]   = total_male
      @data[:counts][:active_members][:others] = total_others
      @data[:counts][:active_members][:total]  = total

      @data[:counts][:active_members][:members] = @active_members.map{ |m|
                                                    {
                                                      id: m.id,
                                                      identification_number: m.identification_number,
                                                      first_name: m.first_name,
                                                      middle_name: m.middle_name,
                                                      last_name: m.last_name,
                                                      member_type: m.member_type,
                                                      gender: m.gender,
                                                      branch: {
                                                        id: m.branch.id,
                                                        name: m.branch.name
                                                      },
                                                      center: {
                                                        id: m.center.id,
                                                        name: m.center.name
                                                      },
                                                      officer: {
                                                        id: m.center.user.id,
                                                        first_name: m.center.user.first_name,
                                                        last_name: m.center.user.last_name
                                                      }
                                                    }
                                                  }


      compute_member_types!
    end

    def compute_member_types!
      @member_types.each do |m|
        m_data  = {
          member_type: m,
          members: [],
          count: 0
        }

        @data[:counts][:active_members][:members].select{ |o|
          o[:member_type] == m
        }.each do |o|
          m_data[:members] << o
        end

        @data[:counts][:pure_savers][:members].select{ |o|
          o[:member_type] == m
        }.each do |o|
          m_data[:members] << o
        end

        @data[:counts][:loaners][:members].select{ |o|
          o[:member_type] == m
        }.each do |o|
          m_data[:members] << o
        end

        m_data[:count]  = m_data[:members].size

        @data[:member_type_counts] << m_data
      end
    end
  end
end
