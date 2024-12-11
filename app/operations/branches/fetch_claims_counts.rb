module Branches
  class FetchClaimsCounts
    def initialize(config:)
      @config = config

      @branch   = @config[:branch]
      @as_of    = @config[:as_of].try(:to_date) || Date.today
      @cluster  = @branch.cluster
      @area     = @cluster.area

      @data = {
        counts: {
          approved_claims: {
            blip: 0,
            clip: 0,
            hiip: 0,
            k_bente: 0,
            calamity_assistance: 0,
            k_kalinga: 0,
            kjsp: 0,
            blip_member_count: 0,
            blip_spouse_legal_dependent_count: 0,
            total_amount: 0.00,
            total: 0,
            claims: []
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
      query!
      compute_claims_counts!

      @data
    end

    def compute_claims_counts!
      @data[:counts][:approved_claims][:claims] = @result.select{ |o|
                                                    ((o.fetch("status") == "approved"))
                                                  }.map{ |o|
                                                    {
                                                      id: o.fetch("id"),
                                                      member_identification_number: o.fetch("identification_number"),
                                                      member: o.fetch("name_of_insured"),
                                                      claim_type: o.fetch("claim_type"),
                                                      date_paid: o.fetch("date_paid"),
                                                      amount: o.fetch("amount").try(:to_f).try(:round, 2) || 0.00,
                                                      classification_of_insured: o.fetch("classification_of_insured"),
                                                      branch: {
                                                        id: @branch.id,
                                                        name: @branch.name
                                                      },
                                                      center: {
                                                        id: o.fetch("center_id"),
                                                        name: o.fetch("center_name")
                                                      }
                                                    }
                                                  }
      
      @data[:counts][:approved_claims][:blip]                 = @data[:counts][:approved_claims][:claims].select{ |o| o[:claim_type] == "BLIP" }.size
      @data[:counts][:approved_claims][:clip]                 = @data[:counts][:approved_claims][:claims].select{ |o| o[:claim_type] == "CLIP" }.size
      @data[:counts][:approved_claims][:hiip]                 = @data[:counts][:approved_claims][:claims].select{ |o| o[:claim_type] == "HIIP" }.size
      @data[:counts][:approved_claims][:k_bente]              = @data[:counts][:approved_claims][:claims].select{ |o| o[:claim_type] == "K-BENTE" }.size
      @data[:counts][:approved_claims][:calamity_assistance]  = @data[:counts][:approved_claims][:claims].select{ |o| o[:claim_type] == "CALAMITY ASSISTANCE" }.size
      @data[:counts][:approved_claims][:k_kalinga]            = @data[:counts][:approved_claims][:claims].select{ |o| o[:claim_type] == "K-KALINGA" }.size
      @data[:counts][:approved_claims][:kjsp]                 = @data[:counts][:approved_claims][:claims].select{ |o| o[:claim_type] == "KUYA JUN SCHOLARSHIP PROGRAM" }.size  

      @data[:counts][:approved_claims][:blip_member_count]                 += @data[:counts][:approved_claims][:claims].select{ |o| o[:classification_of_insured] == "Member" }.size
      @data[:counts][:approved_claims][:blip_spouse_legal_dependent_count] += @data[:counts][:approved_claims][:claims].select{ |o| o[:classification_of_insured] == "Legal Dependent (Spouse)" }.size

      @data[:counts][:approved_claims][:total]                = @data[:counts][:approved_claims][:claims].size
    end

    def query!
      @result = ActiveRecord::Base.connection.execute(<<-EOS).to_a
                  SELECT
                    claims.id,
                    claims.branch_id,
                    claims.claim_type,
                    claims.status,
                    claims.member_id,
                    CASE
                      WHEN claims.data->>'type_of_loan' ISNULL then 'N/A'
                      ELSE claims.data->>'type_of_loan'   
                      END AS type_of_loan,
                    
                    CASE
                      WHEN claims.data->>'creditors_name' ISNULL then 'N/A'
                      ELSE claims.data->>'creditors_name'   
                      END AS creditors_name,
                    
                    CASE
                      WHEN claims.data->>'classification_of_insured' ISNULL then 'N/A'
                      ELSE claims.data->>'classification_of_insured'   
                      END AS classification_of_insured,
                    
                    CASE
                      WHEN claims.data->>'type_of_insurance_policy' ISNULL then 'N/A'
                      ELSE claims.data->>'type_of_insurance_policy'   
                      END AS type_of_insurance_policy,
                    
                    CASE
                      WHEN claims.data->>'cause_of_death_tpd_accident' ISNULL then 'N/A'
                      ELSE claims.data->>'cause_of_death_tpd_accident'   
                      END AS cause_of_death_tpd_accident,
                    
                    CASE
                      WHEN claims.data->>'gender' ISNULL then 'N/A'
                      ELSE claims.data->>'gender'   
                      END AS gender,
                    
                    CASE
                      WHEN claims.data->>'name_of_insured' ISNULL then 'N/A'
                      ELSE claims.data->>'name_of_insured'   
                      END AS name_of_insured,
                    
                    CASE
                      WHEN claims.data->>'identification_number' ISNULL then 'N/A'
                      ELSE claims.data->>'identification_number'   
                      END AS identification_number,
                    
                    CASE
                      WHEN claims.data->>'policy_number' ISNULL then 'N/A'
                      ELSE claims.data->>'policy_number'   
                      END AS policy_number,
                    
                    CASE
                      WHEN claims.data->>'type_of_insurance_policy' ISNULL then 'N/A'
                      ELSE claims.data->>'type_of_insurance_policy'   
                      END AS type_of_insurance_policy,
                    
                    CASE
                      WHEN claims.data->>'date_reported' ISNULL then 'N/A'
                      ELSE claims.data->>'date_reported'   
                      END AS date_reported,
                    
                    CASE
                      WHEN claims.data->>'date_paid' ISNULL then 'N/A'
                      ELSE claims.data->>'date_paid'   
                      END AS date_paid,
                    
                    COALESCE(claims.data->>'total_amount_payable', '0.00')::float AS total_amount_payable,
                    COALESCE(claims.data->>'amount', '0.00')::float AS amount,
                    centers.id AS center_id,
                    centers.name AS center_name,
                    CONCAT(members.first_name,' ',members.middle_name,' ',members.last_name) AS membername
                            FROM claims
                            LEFT JOIN
                              centers ON centers.id = claims.center_id
                    LEFT JOIN 
                      members ON claims.member_id = members.id
                    WHERE 
                      (claims.branch_id::text = '#{@branch.id}')
                    GROUP BY
                      claims.id, 
                      centers.id,
                      members.first_name,
                      members.middle_name,
                      members.last_name
                EOS
    end
  end
end
