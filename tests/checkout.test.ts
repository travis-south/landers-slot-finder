export default describe('Landers', () => {
    beforeAll(async () => {
        await page.goto(process.env.SERVER_URL);
        await page.setViewport({ width: 1920, height: 1080 });
        page.setDefaultTimeout(5000);
        page.setCacheEnabled();
    });

    // it('should display the login button', async () => {
    //     await page.waitForSelector('button.ld-header__menu--item');
    //     await expect(page).toMatchElement('button.ld-header__menu--item');
    // });
    
    it('should login and check delivery slot', async () => {
        await page.waitForSelector('div.appComponent > div.headwrap > div > div.ld-header > div > div.ld-header__menu > button:nth-child(6)');
        await expect(page).toClick('div.appComponent > div.headwrap > div > div.ld-header > div > div.ld-header__menu > button:nth-child(6)');
        await page.waitForSelector('input[name="email"]');
        await expect(page).toMatchElement('input[name="email"]');
        await page.waitForSelector('form.loginComponent');
        await expect(page).toFillForm('form.loginComponent', {
            email: process.env.USERNAME,
            '': process.env.PASSWORD,
        });
        await page.waitForSelector('form.loginComponent .loginbtn');
        await expect(page).toClick('form.loginComponent .loginbtn');
        await page.waitForSelector('div.appComponent.ld-page--checkout-cart > div.headwrap > div > div.ld-header > div > div.ld-header__menu > div.ld-header__menu--item.ld-header__menu--customer > div.ld-header__menu--name');
        await expect(page).toMatch(process.env.FIRSTNAME);
        
        // go to cart
        await expect(page).toClick('div.ld-header__menu--item.ld-header__menu--cart');
        await page.waitForSelector('div.appComponent.ld-page--checkout-cart > div.bodyComponent > div > div.ld-body-middle-content > div > div.ld-wrapper-order-summary > div.sc-cSHVUG.kQwYYC.ld-rnfooter.fixed.padder.white.flex1.OrderSummaryFooter.ld-animated-fade-in > div.sc-gqjmRU.eESKSx.ld-rnview.bgLightGrey.orderSummary.ldOrderSummary > div.sc-gqjmRU.eESKSx.ld-rnview.rowFlexStart.heading > span');
        await expect(page).toMatch('Order Summary');
        
        // checkout
        await expect(page).toClick('button.checkoutBtn');
        await page.waitForSelector('div.appComponent.ld-page--checkout-delivery-address > div.bodyComponent > div > div.ld-body-middle-content > div > div.ld-wrapper-order-summary > div.sc-jzJRlG.bWAyrP.ld-rncontent.flex3.ldDeliveryAddress.ld-animated-fade-in > span');
        await expect(page).toMatch('Delivery Address');
        
        // check delivery slot
        await expect(page).toClick('div.appComponent.ld-page--checkout-delivery-address > div.bodyComponent > div > div.ld-body-middle-content > div > div.ld-wrapper-order-summary > div.sc-jzJRlG.bWAyrP.ld-rncontent.flex3.ldDeliveryAddress.ld-animated-fade-in > div:nth-child(3) > div > div:nth-child(2) > button');
        await page.waitForSelector('div.appComponent.ld-page--checkout-delivery-timeslots > div.bodyComponent > div > div.ld-body-middle-content > div > div.sc-jzJRlG.bWAyrP.ld-rncontent.deliverySlotsWrapper.padder.ld-delivery-timeslots.ld-animated-fade-in > span');
        await expect(page).toMatch('Reserve Your Delivery Slot');
        await page.waitForSelector('div.DeliveryTimeSlotItem.isToday');
        const element = await page.$$('div.DeliveryTimeSlotItem__body-slot-item.isDisabled');
        
        const slotSubject = element.length < 8 ? 'Slot(s) Available' : 'No Slot Available';
        const slotBody = element.length < 8 ? 'There are slot(s) available! Hurry!' : 'No slot available, just go to sleep.';

        const options = {
            user: process.env.GMAIL_ACCT,
            pass: process.env.GMAIL_PASS,
            to:   process.env.NOTIFY_EMAIL,
            subject: `${slotSubject} - Landers delivery slot`,
            text: slotBody,
        }

        const send = require('gmail-send')(options);
        
        try {
            await send();
        } catch(error) {
            console.error('ERROR', error);
        }

        await new Promise(r => setTimeout(r, (1000 * Number(process.env.INTERVAL_SECS))));

    });

});
