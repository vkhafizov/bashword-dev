
class Header {
    constructor() {
        this.init();
    }

    init() {
        // Создаем header и добавляем его перед первым элементом body
        const header = document.createElement('header');
        header.innerHTML = `
            <h1>Һүҙ уйыны</h1>
        `;
        document.body.insertBefore(header, document.body.firstChild);
    }
}

// Создаем header при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new Header();
});