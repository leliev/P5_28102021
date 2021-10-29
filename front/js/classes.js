class API {

    constructor() {
        this.url = "http://localhost:3000/api/products"
    }

    async getAllProducts() {
        let response = await fetch(this.url)
        return response.json()
    }

    async getOneProduct(id) {
        let response = await fetch(this.url + id)
        return response.json()
    }
}

class DomManager {
    constructor(oneProduct) {
        this.oneProduct = oneProduct
    }

    insertInIndex() {
        let productContainer = document.getElementById("items")
        let template = 
            `<a href="./product.html?id=/${this.oneProduct._id}">
                <article>
                <img src="${this.oneProduct.imageUrl}" alt="${this.oneProduct.altTxt}">
                <h3 class="productName">${this.oneProduct.name}</h3>
                <p class="productDescription">${this.oneProduct.description}</p>
                </article>
            </a>`
        productContainer.innerHTML += template
    }

    insertInProduct() {
        document.title = this.oneProduct.name
        
        let imgContainers = document.getElementsByClassName("item__img")
        let template = `<img src="${this.oneProduct.imageUrl}" alt="${this.oneProduct.altTxt}">`
        imgContainers.item(0).innerHTML += template

        document.getElementById("title").innerText += this.oneProduct.name
        document.getElementById("price").innerText += this.oneProduct.price
        document.getElementById("description").innerText += this.oneProduct.description

        let colors = this.oneProduct.colors
        colors.forEach(insertColor);

        function insertColor(color) {
            let colorContainer = document.getElementById("colors")
            let template = 
                `<option value="${color}">${color}</option>`
            colorContainer.innerHTML += template
        }
    }
}