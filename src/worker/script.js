const paymentMethodSelect = document.getElementById('payment-method');
const blockGuaranteeSection = document.getElementById('block-guarantee');
const timeValiditySection = document.getElementById('time-validity');
const percentSection = document.getElementById('percent');
const limitSection = document.getElementById('limit');
const bankSection = document.getElementById('bank-section');
const addressSection = document.getElementById('address-section');
const detailsSection = document.getElementById('details-section'); // Added for details selection
const submitButton = document.getElementById('submit-btn');

paymentMethodSelect.addEventListener('change', (e) => {
    const method = e.target.value;

    // Reset visibility
    blockGuaranteeSection.classList.add('hidden');
    timeValiditySection.classList.add('hidden');
    percentSection.classList.add('hidden');
    limitSection.classList.add('hidden');
    bankSection.classList.add('hidden');
    addressSection.classList.add('hidden');
    detailsSection.classList.add('hidden');

    if (method == 'cash') {
        blockGuaranteeSection.classList.remove('hidden');
        timeValiditySection.classList.remove('hidden');
        percentSection.classList.remove('hidden');
        limitSection.classList.remove('hidden');
        addressSection.classList.remove('hidden');
        detailsSection.classList.remove('hidden');
    } else if (method == 'nfc' || method == 'transfer' || method == 'sberbank' || method == 'card') {
        blockGuaranteeSection.classList.remove('hidden');
        timeValiditySection.classList.remove('hidden');
        percentSection.classList.remove('hidden');
        limitSection.classList.remove('hidden');
        bankSection.classList.remove('hidden');
    }
});

submitButton.addEventListener('click', async () => {
    const response = await fetch('https://casinotestweb.ru/sendPayment', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            initData: window.Telegram.WebApp.initData,
            method: document.getElementById('payment-method').value,
            block: document.getElementById('block-guarantee').value === 'yes',
            actual: parseInt(document.getElementById('time-validity').value),
            percent: parseInt(document.getElementById('percent').value),
            limit: parseInt(document.getElementById('limit').value),
            bank: document.getElementById('bank').value,
            address: document.getElementById('address').value,
            details: document.getElementById('details').value // Added for details
        })
    });
    const json = await response.json();
    if (json.msg) {
        return window.Telegram.WebApp.showAlert('Произошла ошибка. Заполните все поля, либо попробуйте позже');
    }
    Telegram.WebApp.close();
})