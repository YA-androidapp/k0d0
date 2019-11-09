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

    const SENDGRID_KEY = process.env.SENDGRID_KEY;
    console.log('email()', 'SENDGRID_KEY');
    const SENDGRID_TO = process.env.SENDGRID_TO;
    console.log('email()', 'SENDGRID_TO');
    const SENDGRID_FROM = process.env.SENDGRID_FROM;
    console.log('email()', 'SENDGRID_FROM');

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
}

const teams = (result, imgdata) => {
    console.log('teams()', result, imgdata);

    const WEBHOOK_HOST = process.env.WEBHOOK_HOST;
    console.log('email()', 'WEBHOOK_HOST');
    const WEBHOOK_PATH = process.env.WEBHOOK_PATH;
    console.log('email()', 'WEBHOOK_PATH');

    let https = require('https');
    console.log('teams()', 'https');
    let host = WEBHOOK_HOST;
    console.log('teams()', 'host');
    let path = WEBHOOK_PATH;
    console.log('teams()', 'path');

    let data = JSON.stringify({
        'text': get_subject(result) + ' / ' + 'data:image/png;base64,' + imgdata
    });
    console.log('teams()', 'data');

    let options = {
        hostname: host,
        port: 443,
        path: path,
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
}

exports.email = email;
exports.teams = teams;