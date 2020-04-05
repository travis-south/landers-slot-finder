FROM node:12.16-alpine3.10
RUN apk add --no-cache \
    g++ \
    make \
    zlib \
    zlib-dev \
    libstdc++ \
    chromium \
    harfbuzz \
    nss \
    freetype \
    ttf-freefont \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
WORKDIR /www
ADD ./ /www
RUN yarn install
CMD ["yarn", "run", "test"]
