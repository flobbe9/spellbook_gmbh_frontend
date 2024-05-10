# copy all arguments passed to this command to the .env file
for envVariable in "$@"
do
   echo "$envVariable" >> .env
done