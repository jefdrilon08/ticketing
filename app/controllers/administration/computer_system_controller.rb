module Administration
    class ComputerSystemController < ApplicationController
        before_action :authenticate_user!
        
        def index
            @subheader_side_actions = [
                {
                    id: "btn-new",
                    link: "#",
                    class: "fa fa-plus",
                    text: "New"
                }
            ]
            @computer_system_list = ::ComputerSystem.all.sort_by(&:name)
        end





    end
end
