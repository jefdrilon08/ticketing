class InventoryDistribution < ApplicationRecord
  belongs_to :inventory
  belongs_to :cluster
  belongs_to :branch
  belongs_to :user
end
