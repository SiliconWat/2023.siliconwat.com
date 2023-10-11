import template from './template.mjs';

class TlHeader extends HTMLElement {
    #password = "angie";

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector(`option[value="${document.location.pathname}"]`).selected = true;
        this.shadowRoot.querySelector('button').textContent = localStorage.getItem('credential') ? "Logout" : "Login";
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