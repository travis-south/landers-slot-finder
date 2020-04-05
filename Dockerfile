FROM node:12.16
RUN apt-get update && apt-get install chromium -y

ENV CHROME_BIN=/usr/bin/chromium
ENV CHROME_PATH=/usr/lib/chromium/
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

WORKDIR /www
ADD ./ /www
RUN yarn install
CMD ["yarn", "run", "test"]
