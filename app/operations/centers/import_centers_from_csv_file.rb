module Centers
  class ImportCentersFromCsvFile
    def initialize(file:, user:)
      @file = file
      @user = user
    end

    def execute!
      load_csv_file!
    end

    private

    def load_csv_file!
      CSV.foreach(@file.path, headers: true) do |row|
        uuid = row['uuid']

        if !uuid.nil?
          center_record = Center.where(id: uuid).first

          if center_record.nil?
            center = Center.new

            if uuid.present?
              center.id = uuid
            end

            center.branch_id = row['branch_id']
            center.name = row['name']
            center.short_name = row['short_name']
            center.meeting_day = row['meeting_day']
            center.user = @user.id

            center.save!
          else
            center_record.update!( 
                                      branch_id: row['branch_id'],
                                      name: row['name'],
                                      short_name: row['short_name'],
                                      meeting_day: row['meeting_day'],
                                      user_id: @user.id
                                    )
          end
        end  
      end
    end
  end
end
