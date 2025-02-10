class SystemTicketDesc < ApplicationRecord

    # def attachment_url
    #     if self.data['attached_file'].attached? and self.data['attached_file'].representable?
    #         return rails_blob_path(self.data['attached_file'], disposition: "attachment", only_path: true)
    #     else
    #         ActionController::Base.helpers.asset_url("missing_attached_file.png")
    #     end
    # end

end
