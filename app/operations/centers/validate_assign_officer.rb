 module Centers
  class ValidateAssignOfficer < AppValidator
    def initialize(config:)
      super()

      @config   = config
      @user     = @config[:user]
      @officer  = @config[:officer]
      @center   = @config[:center]
      @valid_roles = ["MIS" , "SBK"]
    end

    def execute!
      if @center.blank?
        @errors[:messages] << {
          key: "center",
          message: "Center not found"
        }
      end

      if @user.blank?
        @errors[:messages] << {
          key: "user",
          message: "User not found"
        }
      elsif (@user.roles & @valid_roles).size == 0
        @errors[:messages] << {
          key: "user",
          message: "User not authorized"
        }
      end

      if @officer.blank?
        @errors[:messages] << {
          key: "officer",
          message: "Officer not found"
        }
      end

      if @officer.present? and @center.present? and @center.try(:user_id).present? and @officer.id == @center.user_id
        @errors[:messages] << {
          key: "officer",
          message: "Current officer"
        }
      end

      #not_yet_implemented!

      @errors[:messages].each do |o|
        @errors[:full_messages] << o[:message]
      end

      @errors
    end
  end
 end
