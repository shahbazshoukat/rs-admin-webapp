echo "*****Listing all containers*****"
sudo docker ps --all
echo "*****Deleting container with name=rs-admin-webapp*****"
sudo docker rm -f $(sudo docker ps --filter name=rs-admin-webapp)
echo "*****Listing all images*****"
sudo docker images
echo "*****Deleting images with reference=resultsquare/rcc-webapp:latest*****"
sudo docker rmi -f $(sudo docker images --filter reference=resultsquare/rcc-webapp:latest)
echo "*****Pull and run new rcc-webapp container*****"
sudo docker run -d --name rs-admin-webapp -p 80:80 -e "WEBAPP_FQDN=rcc.resultsquare.pk" -e "API_SERVER_FQDN=3.21.127.241:3000" resultsquare/rcc-webapp:latest
echo "*****Closing the connection with ec2 instance*****"
exit
