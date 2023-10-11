import template from './template.mjs';

class TlHeader extends HTMLElement {
    #password = "angie";

    #public_menu = [
        { title: "Consulting", page: "/" },
        { title: "Co-Hosting", page: "/co-hosting" },
        { title: "Management", page: "/management" }
    ];

    #private_menu = [
        { title: "Consulting2", page: "/" },
        { title: "Co-Hosting2", page: "/co-hosting" },
        { title: "Management2", page: "/management" }
    ];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector(`option[value="${document.location.pathname}"]`).selected = true;
        this.shadowRoot.querySelectorAll('button').forEach(button => button.textContent = localStorage.getItem('credential') ? "Logout" : "Login");
    }

    render() {
        const menu = localStorage.getItem('credential') ? this.#private_menu : this.#public_menu;
        const ul = this.shadowRoot.querySelector('ul')
        const select = this.shadowRoot.querySelector('select')
        
        menu.reverse().forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.page;
            a.textContent = item.title;
            li.appendChild(a)
            ul.prepend(li)

            const option = document.createElement('option');
            option.value = item.page + (item.page === '/' ? "" : "/");
            option.textContent = item.title;
            select.prepend(option);
        });
    }

    page(select) {
        document.location = select.value;
    }

    menu(event) {
        const credential = localStorage.getItem('credential');
        if (credential) this.logout(event.target)
        else this.login(event.target);
    }

    login(button, retry=false) {
        button.disabled = true;
        let password = window.prompt(retry ? "Incorrect password. Please try again:" : "Please enter your password:");
        if (password) {
            if (password.toLowerCase() === this.#password.toLowerCase()) {
                localStorage.setItem('credential', password);
                document.location = '/';
            } else this.login(button, true)
        } else button.disabled = false;
    }

    logout(button) {
        button.disabled = true;
        localStorage.removeItem('credential');
        document.location = '/';
    }
}

customElements.define("tl-header", TlHeader);