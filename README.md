# spellbook_gmbh_frontend

# Run
- override the following ```.env``` variables with following values:
    - REACT_APP_PROTOCOL=http
    - REACT_APP_HOST=localhost
    - PORT=3000
    - WORDPRESS_PROTOCOL=http
    - WORDPRESS_HOST=localhost
    - WORDPRESS_PORT=8080
    
Alternatively use an ```.env.local``` file with all ```.env``` file variables including the above replacemnts.

### Locally
- replace the env vairables as explained above
- run ```npm start```

### docker-compose
- replace the env vairables as explained above
- run ```docker-compose -f docker-compose.dev.yml up```