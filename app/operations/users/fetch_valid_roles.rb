module Users
  class FetchValidRoles
    def initialize(module_name:)
      @module_name  = module_name
    end

    def execute!
      Settings
        .try(:module_authorization_roles)
        .try(@module_name.to_sym) || []
    end
  end
end
