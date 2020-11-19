# STARTS A CONTAINER FROM THE BUILT IMAGE.
echo "BE PACIENT. This operation can take up to 10 MINUTES to setup everything for the first time."
sudo docker run -itd -p 3000:3000 -v $(pwd):/app --name desafio-ruby-container desafio-ruby
