module Users
  class AuthenticateUser
    attr_accessor :username,
                  :password,
                  :user_type,
                  :valid,
                  :roles,
                  :access_token,
                  :first_name,
                  :last_name,
                  :branches,
                  :branch,
                  :center,
                  :status

    def initialize(username:, password:, user_type:)
      @roles      = []
      @branches   = []
      @valid      = false
      @username   = username
      @password   = password
      @user_type  = user_type
      @first_name = nil
      @last_name  = nil
      @branch     = nil
      @center     = nil
      @status     = nil

      @access_token = nil
    end

    def execute!
      if @user_type == "USER"
        authenticate_user!
      elsif @user_type == "MEMBER"
        authenticate_member!
      end
    end

    def authenticate_user!
      user  = User.find_by_username(@username)

      if user.present? and user.valid_password?(@password)
        user.update!(access_token: SecureRandom.hex(40))

        @valid        = true
        @access_token = user.access_token
        @roles        = user.current_roles

        @default_branch_name = Settings.try(:defaults).try(:default_branch).try(:name)
        @branches = ReadOnlyBranch.where(
                      id: ReadOnlyUserBranch.where(active: true, user_id: user.id).pluck(:branch_id)
                    ).order(Arel.sql("name#{" = '#{@default_branch_name}'" if @default_branch_name} ASC")).map{ |o|
                      {
                        id: o.id,
                        name: o.name
                      }
                    }

        @first_name = user.first_name
        @last_name  = user.last_name
      end
    end

    def authenticate_member!
      member  = Member.find_by_username(@username)

      if member.present? and member.access_token.present? and member.valid_password?(@password)
        @valid        = true
        @access_token = member.access_token
        @roles        = ["MEMBER"]

        @branch = member.branch
        @center = member.center

        @first_name = member.first_name
        @last_name  = member.last_name

        @status = member.status
      end
    end
    
    def valid?
      @valid
    end
  end
end
