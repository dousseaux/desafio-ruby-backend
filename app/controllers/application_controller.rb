class ApplicationController < ActionController::Base

    include ApplicationHelper

    before_action do
        @config = Rails.configuration.x.desafio_backend
        require_session
    end

end
