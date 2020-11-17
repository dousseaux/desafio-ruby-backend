require_relative 'boot'
require 'rails/all'

Bundler.require(*Rails.groups)

class Application < Rails::Application
    config.load_defaults 5.2
    config.i18n.fallbacks = true
    config.i18n.fallbacks = [:en]
    config.i18n.default_locale = :'pt-BR'
    config.exceptions_app = self.routes
end
