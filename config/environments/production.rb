Rails.application.configure do
    # MAIN
    config.cache_classes = true
    config.eager_load = true
    config.consider_all_requests_local       = false
    config.action_controller.perform_caching = true

    # ASSETS
    config.assets.js_compressor = Uglifier.new(harmony: true, output: { comments: :copyright })
    config.assets.css_compressor = :sass
    config.assets.compile = false
    config.public_file_server.enabled = true
    config.serve_static_assets = true
    config.public_file_server.headers = {
        'Cache-Control' => 'public, max-age=700000'
    }

    # OTHER
    config.action_mailer.perform_caching = false
    config.i18n.fallbacks = true
    config.log_level = :debug
    config.log_tags = [:request_id]
    config.log_formatter = ::Logger::Formatter.new
    config.active_support.deprecation = :notify
    config.active_record.dump_schema_after_migration = false
    if ENV['RAILS_LOG_TO_STDOUT'].present?
        logger = ActiveSupport::Logger.new(STDOUT)
        logger.formatter = config.log_formatter
        config.logger = ActiveSupport::TaggedLogging.new(logger)
    end
end
