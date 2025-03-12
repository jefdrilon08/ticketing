class User < ApplicationRecord
  include Rails.application.routes.url_helpers

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :trackable, :timeoutable

  has_many :concern_tickets

        
# end

  REMOTE_ROLES = [
    "REMOTE-OAS",
    "REMOTE-BK",
    "REMOTE-MIS",
    "REMOTE-FM",
  ]

  ROLES = [
    "OAS",
    "BK",
    "SBK",
    "CM",
    "SO",
    "FM",
    "AM",
    "MIS",
    "ACC",
    "AO",
    "REMOTE-OAS",
    "REMOTE-BK",
    "REMOTE-MIS",
    "REMOTE-FM",
    "OM",
    "OJT"
  ]

  FOR_MANAGING_BRANCH_ROLES = [
    "MIS",
    "AO"
  ]

  validates :username, presence: true, uniqueness: true
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :identification_number, presence: true, uniqueness: true

  # ActiveStorage
  #has_one_attached :profile_picture
  #has_many :announcements
  #has_many :user_demerits
  #has_many :user_branches
  # has_many :branches, through: :user_branches
  

  serialize :roles, type: Array

  attr_accessor :login

  def current_roles
    self.roles.select{ |o|
      o.present?
    }
  end

  def is_mis?
    roles.include?("MIS")
  end

  def is_admin?
    is_mis?
  end

  def profile_picture_url
    #if ["development", "production"].include?(ENV['RAILS_ENV'])
    #  if self.profile_picture.attached?
    #    return rails_blob_path(self.profile_picture, disposition: "attachment", only_path: true)
    #  else
    #    ActionController::Base.helpers.asset_url("missing_profile_picture.png")
    #  end
    #else
    #  ""
    #end
  end

  def to_s
    full_name
  end

  def full_name
    "#{last_name.upcase}, #{first_name.upcase}"
  end

  def print_full_name
    "#{first_name.upcase} #{last_name.upcase}"
  end

  def login=(login)
    @login  = login
  end

  def login
    @login || self.username || self.email
  end

  def generate_jwt
    payload = user_object
    payload[:exp] = 60.days.from_now.to_i

    JWT.encode(payload, Rails.application.secret_key_base)
  end

  def user_object
    {
      id: id,
      username: username,
      email: email,
      first_name: first_name,
      last_name: last_name,
      full_name: full_name,
      identification_number: identification_number,
      incentivized_date: incentivized_date,
      roles: roles
    }
  end

  def to_h
    user_object
  end

  def to_h_with_pic
    obj = to_h
    obj[:profile_picture_url] = profile_picture_url

    obj
  end

  def verified?
    is_verified
  end

  def self.find_first_by_auth_conditions(warden_conditions)
    conditions = warden_conditions.dup
    if login = conditions.delete(:login)
      where(conditions).where(["lower(username) = :value OR lower(email) = :value", { value: login.downcase }]).first
    else
      if conditions[:username].nil?
        where(conditions).first
      else
        where(username: conditions[:username]).first
      end
    end
  end
end
