ARG HTTPS
ARG PORT
ARG NODE_VERSION

ARG REACT_APP_CRYPTO_KEY
ARG REACT_APP_CRYPTO_IV

ARG SSL_KEY_PASSWORD
ARG SSL_KEY_FILE_NAME
ARG SSL_CRT_FILE_NAME
ARG SSL_DIR


##### Build
FROM node:${NODE_VERSION}

# copy all files
COPY . .

# Crypto env
ARG REACT_APP_CRYPTO_KEY
ENV REACT_APP_CRYPTO_KEY=${REACT_APP_CRYPTO_KEY}

ARG REACT_APP_CRYPTO_IV
ENV REACT_APP_CRYPTO_IV=${REACT_APP_CRYPTO_IV}

# Install and build
RUN npm i
RUN npm run build


##### Run
FROM node:${NODE_VERSION}

WORKDIR /app

# Args
ARG PORT
ENV PORT=${PORT}

ARG HTTPS
ENV HTTPS=${HTTPS}

ARG SSL_KEY_PASSWORD
ENV SSL_KEY_PASSWORD=${SSL_KEY_PASSWORD}

ARG SSL_DIR
ENV SSL_DIR=${SSL_DIR}

ARG SSL_CRT_FILE_NAME
ENV SSL_CRT_FILE_NAME=./${SSL_DIR}/${SSL_CRT_FILE_NAME}

ARG SSL_KEY_FILE_NAME
ENV SSL_KEY_FILE_NAME=./${SSL_DIR}/${SSL_KEY_FILE_NAME}

# copy necessary files only
COPY --from=0 /build ./build
# COPY ./build ./build
COPY --from=0 /package.json ./
# COPY ./package.json ./
COPY --from=0 /${SSL_DIR} ./${SSL_DIR}
# COPY ./${SSL_DIR} ./${SSL_DIR}

# install npm serve
RUN npm i -g serve

ENTRYPOINT  if [ $HTTPS = "true" ]; then \
                printf "${SSL_KEY_PASSWORD}" | serve -s ./build -l ${PORT} -n --no-port-switching --ssl-cert ${SSL_CRT_FILE_NAME} --ssl-key ${SSL_KEY_FILE_NAME} --ssl-pass /dev/stdin; \
            else \
                serve -s ./build -l ${PORT} -n --no-port-switching; \
           fi