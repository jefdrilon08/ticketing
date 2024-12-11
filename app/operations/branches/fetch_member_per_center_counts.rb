module Branches
  class FetchMemberPerCenterCounts
    def initialize(config:)
      @config = config
      @branch   = @config[:branch]
      @as_of    = @config[:as_of].try(:to_date) || Date.today

      @data = {
        records: []
      }
      
    end

    def execute!
      queryAllBranch
      number_member_per_center_counts
      @data
    end

    def number_member_per_center_counts

      @data[:records] = @result.map{ |r|
                        branch_name = r.fetch("branch_name")
                        center_name = r.fetch("center_name")
                        center_member_counts = r.fetch("center_member_counts")
                        insurance_status = r.fetch("insurance_status")
                        kcoop_status = r.fetch("kcoop_status")
                        {
                          branch_name: branch_name,
                          center_name: center_name,
                          center_member_counts: center_member_counts,
                          insurance_status: insurance_status,
                          kcoop_status: kcoop_status
                        }
                      } 
    end

    def queryAllBranch
      @result = ActiveRecord::Base.connection.execute(<<-EOS).to_a
        SELECT 
          b.name AS branch_name, 
          c.name AS center_name, 
          COUNT(a.center_id) AS center_member_counts, 
          a.insurance_status AS insurance_status, 
          a.status AS kcoop_status
        FROM Members a
        LEFT JOIN branches b ON a.branch_id = b.id
        LEFT JOIN centers c ON a.center_id = c.id
        GROUP BY 
          a.center_id,
          b.name,
          C.name,
          a.insurance_status, 
          a.status
        ORDER BY 
          b.name ASC,
          c.name ASC,
          a.insurance_status ASC, 
          a.status ASC
      EOS
    end
  end
end
