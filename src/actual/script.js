(async()=>{
    
    const response = await fetch('https://casinotestweb.ru/actual', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ initData: window.Telegram.WebApp.initData })
    });
    const json = await response.json();
    if (!json.ok) {
        window.Telegram.WebApp.showAlert('Не получилось обновить список заявок');
    }
    
    const table = document.querySelector('.table')
    const form = document.querySelector('.form-view');
    const formTable = document.querySelector('.form-table');
    const head = document.querySelector('.head');
    const button = document.querySelector('.collect');

    window.Telegram.WebApp.BackButton.onClick(() => {
        table.classList.remove('hidden');
        form.classList.add('hidden');
        document.querySelector('.menu').classList.remove('hidden');
        ispolForm.classList.remove('hidden');
        head.innerText = 'Список заявок';
        window.Telegram.WebApp.BackButton.hide();
    })

    let choosedData, page = 0;
    
    function updateButtons() {
        console.log(page);
        document.querySelector('.first').innerText = page === 0 ? '1' : (page+1).toString();
        document.querySelector('.second').innerText = page === 0 ? '2' : (page+2).toString();
        document.querySelector('.third').innerText = page === 0 ? '3' : (page+3).toString();
    }

    document.querySelector('.first').addEventListener('click', (e) => { page = Number(e.target.innerText)-1; updateTables(); updateButtons(); })
    document.querySelector('.second').addEventListener('click', (e) => { page = Number(e.target.innerText)-1; updateTables(); updateButtons(); })
    document.querySelector('.third').addEventListener('click', (e) => { page = Number(e.target.innerText)-1; updateTables(); updateButtons(); })
    document.querySelector('.back').addEventListener('click', () => {
        page--;
        updateButtons();
        updateTables();
    })
    document.querySelector('.next').addEventListener('click', () => {
        page++;
        updateButtons();
        updateTables();
    })
    updateTables();
    async function updateTables() { 
        table.innerHTML = `
        <tr>
            <td>Цена в %</td>
            <td>Банк 🏦</td>
            <td>Метод 💳</td>
            <td>Сумма 💵</td>
        </tr>`;
        for(const data of json.data.filter((e,i) => i>=page*10 && i < (page+1)*10)) {
            
            const tr = document.createElement('tr');
            table.appendChild(tr);

            const field1 = document.createElement('td');
            field1.innerText = data.percent;
            const field2 = document.createElement('td');
            field2.innerText = data.limit;
            const field3 = document.createElement('td');
            field3.innerText = data.method
            const field4 = document.createElement('td');
            field4.innerText = data.methodName == 'cash' ? data.address.split(',')[0].trim() : data.bank 

            tr.appendChild(field1);
            tr.appendChild(field2);
            tr.appendChild(field3);
            tr.appendChild(field4);

            tr.addEventListener('click', () => {
                document.querySelector('.menu').classList.add('hidden');
                choosedData = data;
                head.innerText = 'Заявка #'+data.id;
                window.Telegram.WebApp.BackButton.show()
                formTable.innerHTML = `<tr>
                    <td class="form-label">Поле</td>
                    <td class="form-value">Значение</td>
                </tr>`;
                table.classList.add('hidden');
                form.classList.remove('hidden');
                
                const valuesList = {
                    'Метод': data.method,
                    'Выплата блокировок': data.block,
                    'Актуальность': data.actual,
                    'Процент': data.percent,
                    'Лимит': data.limit,
                    'Банк': data.methodName == 'cash' ? '' : data.bank,
                    'Адресс': data.address,
                    'Детали': data.details
                };

                const keys = Object.keys(valuesList);
                for(const key of keys) {
                    const tr = document.createElement('tr');
                    formTable.appendChild(tr);
                    const label = document.createElement('td');
                    label.classList.add('form-label');
                    label.innerText = key;
                    const value = document.createElement('td');
                    value.classList.add('form-value');
                    let exitValue = valuesList[key];
                    exitValue = ['true','false'].includes(exitValue) ? (exitValue=='true'?'✅ Да':'❌ Нет') : exitValue;
                    exitValue = [
                        'sberbank', 'tinkoff', 'ozon', 'home', 'rosbank', 'uralbank', 'alfabank', 'vtbbank', 'raiffaisen', 'pochtabank', 'mtsbank', 'sovkombank'
                    ].includes(exitValue) ? {
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
                    }[exitValue] : exitValue;
                    exitValue = ['nfc', 'cash', 'transfer', 'card'].includes(exitValue) ? {
                        nfc: "📱 Cash in / NFC",
                        cash: "🛻 Курьер наличных",
                        transfer: "💳 Перевод по счету",
                        card: "💳 Перевод по карте",
                    }[exitValue] : exitValue;

                    value.innerText = exitValue;
                    tr.appendChild(label);
                    tr.appendChild(value);
                } 

            })

        }
    }
    button.addEventListener('click', async () => {
        const response = await fetch('https://casinotestweb.ru/get', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                initData: window.Telegram.WebApp.initData,
                id: choosedData.id
            })
        });
        const json = await response.json();
        if (!json.ok) {
            window.Telegram.WebApp.showAlert('Не удалось взять заявку.');
            return;
        }
        window.Telegram.WebApp.close();
    })

})()