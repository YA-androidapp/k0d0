const get_subject = (result) => {
    console.log('get_subject()', result);

    let subject = 'Tests Failed.';

    if (result) {
        subject = 'Tests passed.';
    }

    console.log('get_subject()', 'subject', subject);

    return subject;
}

const email = (result, imgdata) => {
    console.log('email()', result, imgdata);

    const SENDGRID_KEY = process.env.SENDGRID_KEY || '';
    console.log('email()', 'SENDGRID_KEY');
    const SENDGRID_TO = process.env.SENDGRID_TO || '';
    console.log('email()', 'SENDGRID_TO');
    const SENDGRID_FROM = process.env.SENDGRID_FROM || '';
    console.log('email()', 'SENDGRID_FROM');

    if (!SENDGRID_KEY || !SENDGRID_TO || !SENDGRID_FROM) {
        console.log('email()', '(!SENDGRID_KEY || !SENDGRID_TO || !SENDGRID_FROM)');
        return;
    }

    try {
        const sgMail = require('@sendgrid/mail');
        console.log('email()', 'sgMail');

        sgMail.setApiKey(SENDGRID_KEY);
        console.log('email()', 'sgMail.setApiKey(SENDGRID_KEY)');

        const msg = {
            to: SENDGRID_TO,
            from: SENDGRID_FROM,
            subject: get_subject(result),
            text: 'Test results: ......',
            html: '<strong>Test results:</strong><br>......',
            attachments: [{
                content: imgdata,
                filename: 'Result.png',
                type: 'image/png',
            }, ],
        };
        console.log('email()', 'msg');
        sgMail.send(msg);
        console.log('email()', 'sgMail.send(msg)');
    } catch (e) {
        console.error('email()', e);
    }
}

const teams = (result, imgdata) => {
    console.log('teams()', result, imgdata);

    const WEBHOOK_HOST = process.env.WEBHOOK_HOST || '';
    console.log('email()', 'WEBHOOK_HOST');
    const WEBHOOK_PATH = process.env.WEBHOOK_PATH || '';
    console.log('email()', 'WEBHOOK_PATH');

    if (!WEBHOOK_HOST || !WEBHOOK_PATH) {
        console.log('email()', '(!WEBHOOK_HOST || !WEBHOOK_PATH)');
        return;
    }

    try {
        let https = require('https');
        console.log('teams()', 'https');

        let data = JSON.stringify({
            'text': get_subject(result) + ' / ' + 'data:image/png;base64,' + imgdata
        });
        console.log('teams()', 'data');

        let options = {
            hostname: WEBHOOK_HOST,
            port: 443,
            path: WEBHOOK_PATH,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };
        console.log('teams()', 'options');

        let req = https.request(options, (res) => {
            console.log('status code : ' + res.statusCode);
            res.setEncoding('utf8');
            res.on('data', (d) => {
                console.log(d)
            });
        });
        console.log('teams()', 'req');

        req.on('error', (e) => {
            console.error(e);
        });
        console.log('teams()', 'req.on(\'error\')');

        req.write(data);
        console.log('teams()', 'req.write(data)');
        req.end();
        console.log('teams()', 'req.end()');
    } catch (e) {
        console.error('teams()', e);
    }
}

exports.email = email;
exports.teams = teams;