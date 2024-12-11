class LegalDependent < ApplicationRecord
  belongs_to :member

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :date_of_birth, presence: true
  # validates :relationship, presence: true
  
  def full_name
    "#{last_name}, #{first_name} #{middle_name}"
  end
  
  def full_name_upcase
    "#{first_name.try(:upcase)} #{middle_name.try(:upcase)} #{last_name.try(:upcase)}"
  end

  def age
    if self.date_of_birth.nil?
      "Please set date of birth"
    else
      begin
        now = Time.now.utc.to_date
        now.year - self.date_of_birth.year - ((now.month > self.date_of_birth.month || (now.month == self.date_of_birth.month && now.day >= self.date_of_birth.day)) ? 0 : 1)
        # ((Time.zone.now - date_of_birth.to_time) / 1.year.seconds).floor
      rescue Exception
        "ERR IN AGE"
      end
    end
  end
end
