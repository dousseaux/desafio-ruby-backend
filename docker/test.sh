# RUN ALL RAILS TESTS ON A RUNNING CONTAINER

# MAKE SURE TEST DB IS READY
sudo docker exec -it desafio-ruby-container /bin/bash -c "source ~/.profile; bundle exec rake db:test:prepare;";
# RUN ALL TESTS
sudo docker exec -it desafio-ruby-container /bin/bash -c "source ~/.profile; bundle exec rails test;";
