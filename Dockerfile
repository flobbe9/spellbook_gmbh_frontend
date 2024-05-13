# these have to be overriden in prod
ARG HTTPS
ARG PORT
ARG NODE_VERSION

ARG REACT_APP_CRYPTO_KEY
ARG REACT_APP_CRYPTO_COUNTER
ARG REACT_APP_CRYPTO_ALG
ARG REACT_APP_CRYPTO_LENGTH

ARG SSL_PASSWORD
ARG SSL_KEYSTORE_FILE_NAME
ARG SSL_KEY_FILE_NAME
ARG SSL_CRT_FILE_NAME
ARG SSL_DIR


######### Build
FROM node:${NODE_VERSION}

# copy all files
COPY . .

# Crypto env
ARG REACT_APP_CRYPTO_KEY
ARG REACT_APP_CRYPTO_COUNTER
ARG REACT_APP_CRYPTO_ALG
ARG REACT_APP_CRYPTO_LENGTH

ENV REACT_APP_CRYPTO_KEY=${REACT_APP_CRYPTO_KEY}
ENV REACT_APP_CRYPTO_COUNTER=${REACT_APP_CRYPTO_COUNTER}
ENV REACT_APP_CRYPTO_ALG=${REACT_APP_CRYPTO_ALG}
ENV REACT_APP_CRYPTO_LENGTH=${REACT_APP_CRYPTO_LENGTH}

# SSL
ARG HTTPS
ARG SSL_KEYSTORE_FILE_NAME
ARG SSL_PASSWORD
ARG SSL_CRT_FILE_NAME
ARG SSL_KEY_FILE_NAME
ARG SSL_DIR

# install openssl
RUN yes | apt-get install libssl-dev

# generate ssl files
RUN if [ "$HTTPS" ]; then \
        openssl pkcs12 -in ./${SSL_DIR}/${SSL_KEYSTORE_FILE_NAME} -out ./${SSL_DIR}/${SSL_CRT_FILE_NAME} -clcerts -nokeys -passin pass:${SSL_PASSWORD}; \
        openssl pkcs12 -in ./${SSL_DIR}/${SSL_KEYSTORE_FILE_NAME} -out ./${SSL_DIR}/${SSL_KEY_FILE_NAME} -nocerts -nodes  -passin pass:${SSL_PASSWORD}; \
    fi;


# Install and build
RUN npm i
RUN npm run build


######### Run
FROM node:${NODE_VERSION}

WORKDIR /app

# Args
ARG PORT
ENV PORT=${PORT}

ARG HTTPS
ENV HTTPS=${HTTPS}

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

ENTRYPOINT if [ "$HTTPS" ]; then \
                serve -s -L ./build -l ${PORT} -n --no-port-switching --ssl-cert ${SSL_CRT_FILE_NAME} --ssl-key ${SSL_KEY_FILE_NAME}; \
            else \
                serve -s -L ./build -l ${PORT} -n --no-port-switching; \
           fi