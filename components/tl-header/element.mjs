import template from './template.mjs';

class TlHeader extends HTMLElement {
    #username = "angie";

    #public_menu = [
        { title: "Home", page: "/" },
        { title: "Main House", page: "/public/house", submenu: true },
        { title: "Studio Guesthouse", page: "/public/guesthouse", submenu: true },
        { title: "Backyard Patio", page: "/public/patio", submenu: true },
        { title: "Apply Now", page: "/public/apply" },
        { title: "Section 8", page: "/public/section8", submenu: true },
        { title: "Lease Terms", page: "/public/lease", submenu: true },
        { title: "Contact Us", page: "/public/contact" }
    ];

    #private_menu = [
        { title: "Pay Rent", page: "/private/pay" },
        { title: "Submit Docs", page: "/private/docs" },
        { title: "Pay Stub", page: "/private/paystub", submenu: true },
        { title: "Renter's Insurance", page: "/private/insurance", submenu: true },
        { title: "Pet License", page: "/private/pet", submenu: true },
        { title: "Lease Agreement", page: "/private/agreement" },
        { title: "Home Inspection", page: "/private/inspection", submenu: true },
        { title: "Lease Extension", page: "/private/addendum", submenu: true },
        { title: "Rental Application", page: "/private/application", submenu: true },
        { title: "Contact Us", page: "/public/contact" }
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
            option.textContent = item.submenu ? "- " + item.title : item.title;
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
        let username = window.prompt(retry ? "Incorrect username. Please try again:" : "Please enter your username:");
        if (username) {
            if (username.toLowerCase() === this.#username.toLowerCase()) {
                localStorage.setItem('credential', username);
                document.location = this.#private_menu[0].page;
            } else this.login(button, true)
        } else button.disabled = false;
    }

    logout(button) {
        button.disabled = true;
        localStorage.removeItem('credential');
        document.location = this.#public_menu[0].page;
    }
}

customElements.define("tl-header", TlHeader);