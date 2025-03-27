class ItemRequest < ApplicationRecord
  belongs_to :user
  has_many :item_request_details, dependent: :destroy  # Allows multiple detail records per request

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
