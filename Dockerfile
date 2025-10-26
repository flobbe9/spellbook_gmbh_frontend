ARG NODE_VERSION


FROM node:${NODE_VERSION} as build

WORKDIR /app

# copy all files
COPY . .

# Install and build
RUN npm i
RUN npm run build


# NOTE: mount nginx.conf using compose
FROM nginx:alpine

WORKDIR /app

ENV TZ="Europe/Berlin"

# Copy to nginx dir
WORKDIR /usr/share/nginx/html
# remove default nginx static assets
RUN rm -rf ./*
COPY --from=build /app/build .

# run in foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]