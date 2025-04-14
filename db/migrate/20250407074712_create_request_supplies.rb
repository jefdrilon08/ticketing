class RequestSupply < ApplicationRecord
  belongs_to :item_request
  belongs_to :item

  validates :qty, numericality: { greater_than: 0 }
  validates :item_id, presence: true
  validates :item_request_id, presence: true

  before_create :set_initial_status_date
  before_update :update_status_date, if: :saved_change_to_status?

  private

  def set_initial_status_date
    self.status_dates ||= {}
    self.status_dates[status.downcase] = Date.today.to_s
  end

  def update_status_date
    self.status_dates ||= {}
    self.status_dates[status.downcase] = Date.today.to_s
  end
end