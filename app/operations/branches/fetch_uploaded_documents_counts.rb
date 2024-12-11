module Branches
  class FetchUploadedDocumentsCounts
    def initialize(config:)
      @config = config
      @branch   = @config[:branch]
      @as_of    = @config[:as_of].try(:to_date) || Date.today
      
      @cluster  = @branch.cluster
      @area     = @cluster.area

      @data = {
        
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
        number_of_attached_files: 0,
        number_of_active_members: 0,
        percentage: 0,
      }
    end

    def execute!
      queryattach!
      querymember!
      number_of_attached_files_counts!
      number_of_member_counts!
      compute_percentage!
      @data
    end

    def compute_percentage!
      @data[:percentage] = (@data[:number_of_attached_files] * 100 / @data[:number_of_active_members]).to_f.round(2) rescue 0
    end

    def number_of_attached_files_counts!
      @data[:number_of_attached_files] = @result.map{ |r|
                        number_of_attached_files = r.fetch("attachment_files")
                        {
                          number_of_attached_files: number_of_attached_files                                               
                        }
                      } 
      @data[:number_of_attached_files] = @data[:number_of_attached_files].select{ |o| o[:number_of_attached_files]}.size
    end

    def number_of_member_counts!
      @data[:number_of_active_members] = @members_counts_attachment.map{ |r|
                        number_of_active_members = r.fetch("active_members")
                        {
                          number_of_active_members: number_of_active_members                                                
                        }
                      }
      
      @data[:number_of_active_members] = @data[:number_of_active_members].select{ |o| o[:number_of_active_members]}.size 
      
    end

    def queryattach!
      @result = ActiveRecord::Base.connection.execute(<<-EOS).to_a
        SELECT 
          DISTINCT(b.id) AS attachment_files,
          0 AS active_members,
          c.name AS BNAME,
          c.id AS BID
        FROM attachment_files a
        LEFT JOIN Members b ON a.member_id = b.id
        LEFT JOIN Branches c ON b.branch_id = c.id
        WHERE b.insurance_status in ('inforce')
          and c.id  = '#{@branch.id}'               
      EOS
    end

    def querymember!
      @members_counts_attachment = ActiveRecord::Base.connection.execute(<<-EOS).to_a
        SELECT 
          0 AS attachment_files,
          a.id AS active_members,
          b.name AS BNAME,
          b.id AS BID
        FROM Members a
        LEFT JOIN Branches b ON a.branch_id = b.id
        WHERE a.insurance_status in ('inforce')
          and b.id = '#{@branch.id}'             
      EOS
    end

  end
end
