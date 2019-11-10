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
const MAXIMUM_RETRY_NUMBER = 5;
console.log('k0d0.js', 'MAXIMUM_RETRY_NUMBER', MAXIMUM_RETRY_NUMBER);

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
    let dt1 = new Date().getTime();
    console.log('sleep()', 'dt1', dt1);
    let dt2 = new Date().getTime();
    while (dt2 < dt1 + a) {
        dt2 = new Date().getTime();
    }
    console.log('sleep()', 'dt2', dt2);
    return;
}

async function main() {
    console.log('main()', 'Start');

    try {
        for (let index = 0; index < MAXIMUM_RETRY_NUMBER; index++) {
            console.log('main()', 'index', index);
            let result = await test();
            console.log('main()', 'index', index, 'result', result);
            if (result) {
                // passed
                notify.email(true, base64);
                console.log('main()', 'index', index, 'email');
                notify.teams(true, base64);
                console.log('main()', 'index', index, 'teams');
                process.exit(0); // 正常終了
            }
        }
    } catch (e) {
        console.error('test()', e);
    }

    // failed
    notify.email(false, base64);
    console.log('main()', 'index', 'failed', 'email');
    notify.teams(false, base64);
    console.log('main()', 'index', 'failed', 'teams');
    process.exit(1); // GitHub Actions側でエラー扱い(Process completed with exit code 1.)される
}

async function test() {
    console.log('test()', 'Start');
    const SITE_ID = process.env.SITE_ID || '';
    console.log('test()', 'SITE_ID');
    const SITE_PW = process.env.SITE_PW || '';
    console.log('test()', 'SITE_PW');
    const SITE_URL = process.env.SITE_URL || '';
    console.log('test()', 'SITE_URL', SITE_URL);

    let driver;
    try {
        const capabilities = await buildCapabilities();
        console.log('test()', 'capabilities');
        driver = await new webdriver.Builder().withCapabilities(capabilities).build();
        console.log('test()', 'driver');
        await driver.manage().window().maximize();
        console.log('test()', 'driver.manage().window().maximize()');
        await driver.manage().deleteAllCookies();
        console.log('test()', 'driver.manage().deleteAllCookies()');

        await driver.get(SITE_URL);
        console.log('test()', 'driver.get(SITE_URL)', SITE_URL);

        // to be customized

        console.log('test()', 'Signin');
        sleep(10000);
        console.log('test()', 'Signin', 'sleep(10000)');
        await driver.wait(until.elementLocated(By.className('sign-in-link')), 10000);
        console.log('test()', 'Signin', 'driver.wait(until.elementLocated(By.className(\'sign-in-link\')), 10000)');
        console.log('test()', 'Signin', 'title', await driver.getCurrentUrl(), await driver.getTitle());
        await driver.findElement(By.className('sign-in-link')).click();
        console.log('test()', 'Signin', 'driver.findElement(By.className(\'sign-in-link\')).click()');

        console.log('test()', 'ID');
        sleep(10000);
        console.log('test()', 'ID', 'sleep(10000)');
        await driver.wait(until.elementLocated(By.name('loginfmt')), 10000); // By.id('i0116')
        console.log('test()', 'ID', ' driver.wait(until.elementLocated(By.name(\'loginfmt\')), 10000)');
        console.log('test()', 'ID', 'title', await driver.getCurrentUrl(), await driver.getTitle());
        await driver.findElement(By.name('loginfmt')).sendKeys(SITE_ID, webdriver.Key.ENTER);
        console.log('test()', 'ID', 'driver.findElement(By.name(\'loginfmt\')).sendKeys(SITE_ID, webdriver.Key.ENTER)');

        // to be customized

        console.log('test()', 'Screenshot');
        sleep(30000);
        console.log('test()', 'Screenshot', 'sleep(30000)');
        await driver.wait(until.elementLocated(By.tagName('body')), 30000);
        console.log('test()', 'Screenshot', 'driver.wait(until.elementLocated(By.tagName(\'body\')), 30000)');
        console.log('test()', await driver.getCurrentUrl(), await driver.getTitle());
        const base64 = await driver.takeScreenshot();
        console.log('test()', 'Screenshot', 'base64', base64);
        const buffer = Buffer.from(base64, 'base64');
        console.log('test()', 'Screenshot', 'buffer', buffer);
        fs.writeFileSync('screenshot.jpg', buffer);
        console.log('test()', 'Screenshot', 'fs.writeFileSync()');

        driver && (await driver.quit());
        console.log('test()', 'Final', 'driver.quit()');

        return true;
    } catch (e) {
        console.error('test()', e);
        driver && (await driver.quit());
        console.log('test()', 'Final', 'driver.quit()');
    }
    return false;
}

main();