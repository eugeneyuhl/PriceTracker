const puppeteer = require('puppeteer');

function scrapper(url) {
    return new Promise(async (resolve, reject) => {
        // Open browser/
        const browser = await puppeteer.launch({
            headless: true
        })
        try{
            // Create new page and navigate to URL.
            const page = await browser.newPage();
            await page.goto(url);

            let data = await page.evaluate(() => {
                const name = document.querySelector("span#productTitle").innerText;
                let price = document.querySelector("span#priceblock_ourprice");
                if (price) {
                    price = price.innerText.replace("$", "");
                }
                const rating = parseFloat(document.querySelector("span.a-icon-alt").innerText.split(" ")[0]);
                let json = {
                    name,
                    price,
                    rating
                };
                return json;
            });

            await browser.close();
            return resolve(data);
        } catch (e) {
            await browser.close();
            return reject(e);
        }
    });
}

const url = "https://www.amazon.com/Logitech-Advanced-Wireless-Keyboard-Creative/dp/B0768LTVCQ/ref=sr_1_17?dchild=1&keywords=logitech+keyboard&qid=1592542904&sr=8-17";
scrapper(url).then(console.log).catch(console.error);