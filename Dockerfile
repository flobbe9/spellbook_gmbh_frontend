# TODO: replace with build arg
ARG PORT=3000
# these have to be overriden in prod
ARG REACT_APP_CRYPTO_KEY
ARG REACT_APP_CRYPTO_COUNTER
ARG REACT_APP_CRYPTO_ALG
ARG REACT_APP_CRYPTO_LENGTH


######### Build
FROM node:20.11.0-slim

# copy all files
COPY . .

ARG REACT_APP_CRYPTO_KEY
ARG REACT_APP_CRYPTO_COUNTER
ARG REACT_APP_CRYPTO_ALG
ARG REACT_APP_CRYPTO_LENGTH

ENV REACT_APP_CRYPTO_KEY=${REACT_APP_CRYPTO_KEY}
ENV REACT_APP_CRYPTO_COUNTER=${REACT_APP_CRYPTO_COUNTER}
ENV REACT_APP_CRYPTO_ALG=${REACT_APP_CRYPTO_ALG}
ENV REACT_APP_CRYPTO_LENGTH=${REACT_APP_CRYPTO_LENGTH}

# add secrets to .env file
# TODO: replace this with ENV?
# RUN sh complementEnvFile.sh REACT_APP_CRYPTO_KEY=${REACT_APP_CRYPTO_KEY} REACT_APP_CRYPTO_COUNTER=${REACT_APP_CRYPTO_COUNTER} REACT_APP_CRYPTO_ALG=${REACT_APP_CRYPTO_ALG} REACT_APP_CRYPTO_LENGTH=${REACT_APP_CRYPTO_LENGTH} 

# install and build
RUN npm i
RUN npm run build


######### Run
FROM node:20.11.0-slim

WORKDIR /app

# Args
ARG PORT
ENV PORT=${PORT}

# copy necessary files only
COPY --from=0 /build ./build
COPY --from=0 /package.json .

# install serve
RUN npm i -g serve

ENTRYPOINT serve -s -L ./build -l ${PORT} -n --no-port-switching