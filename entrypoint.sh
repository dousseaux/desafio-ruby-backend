# START MYSQL AND GO TO APP DIRECTORY
service mysql start;
echo $USER;

# INSTALL GEMS
source ~/.profile; bundle install;

# CREATE DEVELOPMENT DATABASE
source ~/.profile; bundle exec rake db:create;

# RUN ALL MIGRATIONS
source ~/.profile; bundle exec rake db:migrate;

# LOAD DEFAULT DATA (TRANSACTION TYPES)
source ~/.profile; bundle exec rake db:seed;

# CREATE TEST DATABASE
source ~/.profile; bundle exec rake db:create RAILS_ENV=test;

# SETUP TEST DATABASE
source ~/.profile; bundle exec rake db:test:prepare;

# KEEP CONTAINER RUNNING FOREVER
source ~/.profile; sleep infinity;
