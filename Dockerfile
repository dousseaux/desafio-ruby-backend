FROM ubuntu:18.04

SHELL ["/bin/bash", "-c"]

# Create path where the app will be mounted
RUN mkdir -p /app

# Fix bug
RUN sed -i ~/.profile -e "s/mesg n || true/tty -s \&\& mesg n/g"

# Install dependencies
RUN apt update && apt upgrade -y
RUN apt install -y autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev git nodejs curl

# Install Maria DB
RUN echo "mariadb-server-10.0 mysql-server/root_password password railsdev" | debconf-set-selections
RUN echo "mariadb-server-10.0 mysql-server/root_password_again password railsdev" | debconf-set-selections
RUN apt -y install mariadb-server mariadb-client libmariadbclient-dev
RUN chown -R mysql:root /var/lib/mysql

# Install Ruby
RUN git clone https://github.com/rbenv/rbenv.git ~/.rbenv
RUN echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.profile
RUN echo 'eval "$(rbenv init -)"' >> ~/.profile
RUN source ~/.profile
RUN git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
RUN source ~/.profile; rbenv install 2.6.3
RUN source ~/.profile; rbenv global 2.6.3
RUN echo "gem: --no-document" > ~/.gemrc
RUN source ~/.profile; gem install bundler

# Expose port 3000 and start Rails server
EXPOSE 3000

# Start everything
WORKDIR /app/
ENTRYPOINT ls /app > /dev/null && /app/entrypoint.sh
