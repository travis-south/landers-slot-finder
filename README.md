# Landers Delivery Slot Finder
Due to COVID-19, there was a huge demand on Landers' grocery deliveries. This made the slot for deliveries limited and you need to monitor for the whole day if there's an available slot.

This app can help you monitor and notify you via email if there's already available delivery slot for your groceries (auto checkout will be on future verions).

## Requirements
1. Docker (https://docs.docker.com/install/)
1. Docker Compose (https://docs.docker.com/compose/install/)
1. Valid Landers account
1. Valid Gmail account - to be used for sending email notifications. If you have two-factor authentication, you need to create an app password. (https://support.google.com/accounts/answer/185833?hl=en)
1. Another email account to receive the actual email notifications

## How to use
1. Login to your Landers account then add your grocery items to your cart. This is important as the app assumes you have done this before starting the app.
1. Checkout this repo and `cd` into it.
1. Copy `.env.dist` to `.env` then update the following values:
    1. `USERNAME` - This is your Landers username
    1. `PASSWORD` - This is your Landers password
    1. `GMAIL_ACCT` - The gmail account to be used for sending out emails
    1. `GMAIL_PASS` - The gmail account password
    1. `NOTIFY_EMAIL` - The email account that will receive the actual email notifications
    1. `FIRSTNAME` - Firstname you used when you signup for your Landers account. You can see it at the upper right corner after logging in to your Landers account. Uppercase.
1. Run `docker-compose up --build -d`.
1. Voila! This will run every 1 min (can be changed in `.env`, `INTERVAL_SECS`) and will notify you via `NOTIFY_EMAIL`.
1. If you are done, run `docker-compose down -v` to stop the app.
