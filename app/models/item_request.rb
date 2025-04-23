class ItemRequest < ApplicationRecord
  belongs_to :user
  has_many :inventory_requests, dependent: :destroy
  has_many :inventory_request_details, through: :inventory_requests
  has_many :item_request_details, dependent: :destroy

  belongs_to :request_supply
  belongs_to :item
  belongs_to :sato 

  before_create :generate_request_number
  before_validation :set_default_date_request, on: :create

  validates :item_id, presence: true
  validates :request_supply, presence: true

  before_create :set_initial_status_date
  before_update :update_status_date, if: :saved_change_to_status?

  private

  def set_default_date_request
    self.date_request ||= Date.today
  end

  def generate_request_number
    loop do
      self.request_number = "REQ-#{SecureRandom.hex(4).upcase}"
      break unless ItemRequest.exists?(request_number: request_number)
    end
  end

  def set_initial_status_date
    initialize_status_dates
    status_dates[status.downcase] = Date.today
  end

  def update_status_date
    initialize_status_dates
    status_dates[status.downcase] = Date.today
  end

  def initialize_status_dates
    self.status_dates ||= {}
  end

  def generate_sato_id
    if sato_id.blank?
      self.sato_id = SecureRandom.uuid
    end
  end
end
