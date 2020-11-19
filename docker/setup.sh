# STARTS A CONTAINER FROM THE BUILT IMAGE.
sudo docker run -itd -p 3000:3000 -v $(pwd):/app --name desafio-ruby-container desafio-ruby
