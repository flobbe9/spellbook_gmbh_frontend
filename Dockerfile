ARG PORT=3000

# Build
FROM node:20.11.0-slim

# copy all files
COPY . .

# install and build
RUN npm i
RUN npm run build


# Run
FROM node:20.11.0-slim

WORKDIR /app

# args
ARG PORT
ENV PORT_ENV=${PORT}

# copy necessary files only
COPY --from=0 /build ./build
COPY --from=0 /package.json .

# install serve
RUN npm i -g serve

ENTRYPOINT serve -s -L ./build -l ${PORT_ENV} -n --no-port-switching ;