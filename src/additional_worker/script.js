const searchParams = new URLSearchParams(location.search);
if (!searchParams.get('id')) {
    window.Telegram.WebApp.close();
}
const submitButton = document.getElementById('submit-btn');
submitButton.addEventListener('click', async () => {
    const response = await fetch('https://casinotestweb.ru/additionalWorkerData', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            initData: window.Telegram.WebApp.initData,
            id: searchParams.get('id'),
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