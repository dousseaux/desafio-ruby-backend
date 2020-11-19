# CREATE DEVELOPMENT DATABASE
bundle exec rake db:create

# RUN ALL MIGRATIONS
bundle exec rake db:migrate

# LOAD DEFAULT DATA (TRANSACTION TYPES)
bundle exec rake db:seed

# CREATE TEST DATABASE
bundle exec rake db:create RAILS_ENV=test

# SETUP TEST DATABASE
bundle exec rake db:test:prepare
