class InventoryRequest < ApplicationRecord
  belongs_to :branch
  belongs_to :user
  belongs_to :request_to, class_name: 'Branch', foreign_key: 'request_to_id', optional: true

  has_many :inventory_request_details, dependent: :destroy

  accepts_nested_attributes_for :inventory_request_details 

  before_validation :generate_request_number, on: :create
  before_create :set_default_date_request

  enum status: {
    pending: 'pending',
    for_checking: 'for checking',
    checked: 'checked',
    approve: 'approve',
    on_process: 'on process',
    for_delivery: 'for delivery',
    received: 'received'
  }
  
  
  private

  def generate_request_number
    self.request_number = "REQ#{Time.now.strftime('%Y%m%d%H%M%S')}" if request_number.blank?
  end

  def set_default_date_request
    self.date_request ||= Date.today
  end
end
