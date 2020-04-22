
const DATA_FILE = './data.json';

export default describe('Landers', () => {
    beforeAll(async () => {
        await page.goto(process.env.SERVER_URL);
        await page.setViewport({ width: 1280, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36');
        page.setDefaultTimeout(5000);
        page.setCacheEnabled();
    });
    
    it('should login and check delivery slot', async () => {
        const loggedIn = await page.$$('#root > div.appComponent > div.headwrap > div > div.ld-header > div > div.ld-header__menu > div.ld-header__menu--item.ld-header__menu--customer > div.ld-header__menu--name');

        if (loggedIn.length < 1) {
            await page.waitForSelector('div.appComponent > div.headwrap > div > div.ld-header > div > div.ld-header__menu > button:nth-child(6)');
            await expect(page).toClick('div.appComponent > div.headwrap > div > div.ld-header > div > div.ld-header__menu > button:nth-child(6)');
            await page.waitForSelector('input[name="email"]');
            await expect(page).toMatchElement('input[name="email"]');
            await page.waitForSelector('form.loginComponent');
            await expect(page).toFillForm('form.loginComponent', {
                email: process.env.LANDERS_USERNAME,
                '': process.env.LANDERS_PASSWORD,
            });
            await page.waitForSelector('form.loginComponent .loginbtn');
            await expect(page).toClick('form.loginComponent .loginbtn');
            await page.waitForSelector('div.appComponent.ld-page--checkout-cart > div.headwrap > div > div.ld-header > div > div.ld-header__menu > div.ld-header__menu--item.ld-header__menu--customer > div.ld-header__menu--name');
            await expect(page).toMatch(process.env.LANDERS_FIRSTNAME);
        }
        
        // go to cart
        await page.waitForSelector('div.ld-header__menu--cart-icon > span');
        await expect(page).toClick('div.ld-header__menu--cart-icon > span');
        await page.waitForSelector('div.orderSummary > div.heading > span');
        await expect(page).toMatch('Order Summary');
        
        // checkout
        await page.waitForSelector('div.checkoutBtnWrapper > button.checkoutBtn');
        await expect(page).toClick('div.checkoutBtnWrapper > button.checkoutBtn');
        const outOfStockButton = await page.$$('div.OutOfStockPrompt button.btn-success');
        if (outOfStockButton.length > 0) {
            await expect(page).toClick('div.OutOfStockPrompt button.btn-success');
        }
        await page.waitForSelector('div.ldDeliveryAddress > span.checkoutTitle');
        await expect(page).toMatch('Delivery Address');
        
        // check delivery slot
        await page.waitForSelector('div.ldDeliveryAddress button.primary:not(.block)');
        await expect(page).toClick('div.ldDeliveryAddress button.primary:not(.block)');
        await page.waitForSelector('div.deliverySlotsWrapper > span.checkoutTitleDelivery');
        await expect(page).toMatch('Reserve Your Delivery Slot');
        await page.waitForSelector('div.DeliveryTimeSlotItem.isToday');
        const elementDisabled = await page.$$('div.DeliveryTimeSlotItem__body-slot-item.isDisabled');
        const elementTotal = await page.$$('div.DeliveryTimeSlotItem__body-slot-item');
        
        const isSlotAvailable = elementDisabled.length < elementTotal.length ? true : false;
        await sendNotification(isSlotAvailable, checkStatus(isSlotAvailable));
        
        // auto checkout if there's a slot
        if (isSlotAvailable && Number(process.env.AUTO_CHECKOUT) === 1) {
            await expect(page).toClick('div.DeliveryTimeSlotItem__body-slot-item:not(.isDisabled)');
            await expect(page).toClick('div.deliverySlotsWrapper button.primary');
            await expect(page).toClick('div.ldPaymentMethodList div.ldPaymentMethodItem:nth-child(3) button');
            await expect(page).toClick('div.ldPaymentMethodList div.ldPaymentMethodItem div.ld-rnview button');
            await page.waitForSelector('div.ld-payment-success');
            await expect(page).toMatch('Thank You For Your Order');
        }

        await new Promise(r => setTimeout(r, (1000 * Number(process.env.INTERVAL_SECS))));

    });

});

function checkStatus(isSlotAvailable: boolean): boolean {
    const fs = require('fs');
    let data = { isSlotAvailable: null };
    
    if (fs.existsSync(DATA_FILE)) {
        const jsonString = fs.readFileSync(DATA_FILE);
        data = JSON.parse(jsonString);
    }

    if (data.isSlotAvailable !== isSlotAvailable) {
        data.isSlotAvailable = isSlotAvailable;
        const updateJsonString = JSON.stringify(data);
        fs.writeFileSync(DATA_FILE, updateJsonString);
        return true;
    }

    return false;
}

async function sendNotification(isSlotAvailable: boolean, sendNotif: boolean): Promise<void> {
    if (sendNotif) {
        const slotSubject = isSlotAvailable ? 'Slot(s) Available' : 'No more slots';
        const slotBody = isSlotAvailable ? 'There are slot(s) available! Hurry!' : 'No more delivery slots avaialable, just go to sleep.';

        const options = {
            user: process.env.GMAIL_ACCT,
            pass: process.env.GMAIL_PASS,
            to:   process.env.NOTIFY_EMAIL.split(','),
            subject: `${slotSubject} - Landers delivery slot`,
            text: slotBody,
        }

        const send = require('gmail-send')(options);
        
        try {
            await send();
        } catch(error) {
            console.error('ERROR', error);
        }
    }
}
