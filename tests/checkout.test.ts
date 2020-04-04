export default describe('Landers', () => {
    beforeAll(async () => {
        await page.goto(process.env.SERVER_URL);
        await page.setViewport({ width: 1920, height: 1080 });
    });

    it('should display the login button', async () => {
        await page.waitFor(1000);
        await expect(page).toMatchElement('button.ld-header__menu--item', { timeout: 60000 });
    });

    it('should login and check delivery slot', async () => {
        await page.waitFor(1000);
        await expect(page).toClick('div.appComponent > div.headwrap > div > div.ld-header > div > div.ld-header__menu > button:nth-child(6)');
        await expect(page).toMatchElement('input[name="email"]', { timeout: 60000 });
        await expect(page).toFillForm('form.loginComponent', {
            email: process.env.USERNAME,
            '': process.env.PASSWORD,
        }, { timeout: 60000 });
        await expect(page).toClick('form.loginComponent .loginbtn');
        await page.waitFor(1000);
        await expect(page).toMatch(process.env.FIRSTNAME, { timeout: 60000 });
        
        // go to cart
        await expect(page).toClick('div.ld-header__menu--item.ld-header__menu--cart');
        await page.waitFor(1000);
        await expect(page).toMatch('Order Summary', { timeout: 60000 });
        
        // checkout
        await expect(page).toClick('button.checkoutBtn');
        await page.waitFor(1000);
        await expect(page).toMatch('Delivery Address', { timeout: 60000 });
        
        // check delivery slot
        await expect(page).toClick('div.appComponent.ld-page--checkout-delivery-address > div.bodyComponent > div > div.ld-body-middle-content > div > div.ld-wrapper-order-summary > div.sc-jzJRlG.bWAyrP.ld-rncontent.flex3.ldDeliveryAddress.ld-animated-fade-in > div:nth-child(3) > div > div:nth-child(2) > button');
        await page.waitFor(1000);
        await expect(page).toMatch('Reserve Your Delivery Slot', { timeout: 60000 });
        const element = await page.$$('div.DeliveryTimeSlotItem__body-slot-item.isDisabled');
        // expect(element.length).toBeLessThan(8);

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
