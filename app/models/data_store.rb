class DataStore < ApplicationRecord
    belongs_to :concern_ticket, optional: true
end
