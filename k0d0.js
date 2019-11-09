console.log('k0d0.js', 'Start');
const fs = require('fs');
console.log('k0d0.js', 'fs');
const notify = require('./notify');
console.log('k0d0.js', 'notify');
const webdriver = require('selenium-webdriver');
console.log('k0d0.js', 'webdriver');
const By = webdriver.By;
console.log('k0d0.js', 'webdriver.By');
const until = webdriver.until;
console.log('k0d0.js', 'webdriver.until');

function buildCapabilities() {
    console.log('buildCapabilities()', 'Start');
    process.env.PATH = `${process.env.PATH};${__dirname}/Selenium.WebDriver.IEDriver.3.150.1/driver/;`;
    console.log('buildCapabilities()', 'process.env.PATH');
    const capabilities = webdriver.Capabilities.ie();
    console.log('buildCapabilities()', 'capabilities');
    capabilities.set('ignoreProtectedModeSettings', true);
    console.log('buildCapabilities()', 'ignoreProtectedModeSettings');
    capabilities.set('ignoreZoomSetting', true);
    console.log('buildCapabilities()', 'ignoreZoomSetting');
    return capabilities;
}

function sleep(a) {
    console.log('sleep()', 'a', a);
    var dt1 = new Date().getTime();
    console.log('sleep()', 'dt1', dt1);
    var dt2 = new Date().getTime();
    while (dt2 < dt1 + a) {
        dt2 = new Date().getTime();
    }
    console.log('sleep()', 'dt2', dt2);
    return;
}

async function main() {
    console.log('main()', 'Start');
    // const SITE_ID = process.env.SITE_ID;
    // console.log('main()', 'SITE_ID');
    // const SITE_PW = process.env.SITE_PW;
    // console.log('main()', 'SITE_PW');
    const SITE_URL = 'https://github.com/YA-androidapp/k0d0'; // process.env.SITE_URL;
    console.log('main()', 'SITE_URL');

    let driver;
    try {
        const capabilities = await buildCapabilities();
        console.log('main()', 'capabilities');
        driver = await new webdriver.Builder().withCapabilities(capabilities).build();
        console.log('main()', 'driver');
        await driver.manage().window().maximize();
        console.log('main()', 'driver.manage().window().maximize()');
        await driver.manage().deleteAllCookies();
        console.log('main()', 'driver.manage().deleteAllCookies()');

        await driver.get(SITE_URL);
        console.log('main()', 'driver.get(SITE_URL)');

        console.log('main()', 'Screenshot');
        sleep(30000);
        await driver.wait(until.elementLocated(By.tagName('body')), 30000);
        const base64 = await driver.takeScreenshot();
        const buffer = Buffer.from(base64, 'base64');
        fs.writeFileSync('screenshot.jpg', buffer);

        // notify.email(true, base64);
        // notify.teams(true, base64);

    } catch (e) {
        console.error('main()', e);
        process.exit(1);
    }

    console.log('main()', 'Final');
    driver && (await driver.quit());
    console.log('main()', 'Final', 'driver.quit()');
}

main();