class Sato < ApplicationRecord
    validates :name, presence: true 
    has_many :item_requests, dependent: :nullify 
    
  end
  