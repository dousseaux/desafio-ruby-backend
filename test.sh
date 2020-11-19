# MAKE SURE TEST DB IS READY
bundle exec rake db:test:prepare

# RUN ALL TESTS
bundle exec rails test
