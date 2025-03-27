class SystemTicketDesc < ApplicationRecord
    include AppendToHasManyAttached['file']
    has_many_attached :file

    def append_files=(attachables)
        file.attach(attachables)
      end
end
