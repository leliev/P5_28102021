/**
 * @class
 * @classdesc Manage exchanges with the API
 */
class API {

    /**Set the API object URL property */
    constructor() {
        this.url = "http://localhost:3000/api/products"
    }

    /**
     * Fetch the list of available products (object[])
     * @returns {Promise} 
     */
    async getAllProducts() {
        let response = await fetch(this.url)
        return response.json()
    }

    /**
     * Fetch the product (object[]) with the given id
     * @param {String} id 
     * @returns {Promise}
     */
    async getOneProduct(id) {
        let response = await fetch(this.url + id)
        return response.json()
    }
}

/**
 * @class
 * @classdesc Manage the dom elements
 */
class DomManager {

    /**
     * Give access of oneProduct properties
     * @param {Object[]} oneProduct
     * @param {Object[]} oneProduct.colors
     * @param {String} oneProduct._id
     * @param {String} oneProduct.name
     * @param {Number} oneProduct.price
     * @param {String} oneProduct.imageUrl
     * @param {String} oneProduct.description
     * @param {String} oneProduct.altTxt
     */
    constructor(oneProduct) {
        this.oneProduct = oneProduct
    }

    /**
     * Insert one product into index.html by adding the template at the given place(id:items")
     * @method
     */
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

    /**
     * Insert the data of the product with the given id in product.html
     * @method 
     */
    insertInProduct() {
        
        //Set the page title as the name of the product
        document.title = this.oneProduct.name

        //Set the image of the product
        let imgContainers = document.getElementsByClassName("item__img")
        let template = `<img src="${this.oneProduct.imageUrl}" alt="${this.oneProduct.altTxt}">`
        imgContainers.item(0).innerHTML += template

        document.getElementById("title").innerText += this.oneProduct.name
        document.getElementById("price").innerText += this.oneProduct.price
        document.getElementById("description").innerText += this.oneProduct.description

        //Create an option for each available color of the product
        let colors = this.oneProduct.colors
        colors.forEach(insertColor);

        /**
         * Insert the option of the given color in the color pick menu
         * @param {String} color 
         */
        function insertColor(color) {
            let colorContainer = document.getElementById("colors")
            let template = 
                `<option value="${color}">${color}</option>`
            colorContainer.innerHTML += template
        }
    }
    addListener() {
        let newId = "/" + this.oneProduct._id
        const cartProduct = {
            id: newId,
            color: "",
            quantity: 0 
        };
        document.getElementById("addToCart").addEventListener("click", function() {
            let toAddColor = document.getElementById("colors").value
            let toAddQuantity = parseInt(document.getElementById("quantity").value)
            if (toAddColor === "" || toAddQuantity === 0) {
                alert("Please choose a color and a quantity")
            } else {
                cartProduct.color = toAddColor
                cartProduct.quantity = toAddQuantity
                let myCart = new Cart()
                myCart.add(cartProduct)
            }
        })
    }

    insertInCart(quantity) {
        let container = document.getElementById("cart__items")
        let template = 
            `<article class="cart__item" data-id="{product-ID}">
            <div class="cart__item__img">
              <img src="${this.oneProduct.imageUrl}" alt="${this.oneProduct.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__titlePrice">
                <h2>${this.oneProduct.name}</h2>
                <p>${this.oneProduct.price}€</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`
          container.innerHTML += template 
    }
}

class Cart {

    constructor() {
        this.storageKey = "cart"
        this.content = []
    }

    get() {
        this.content = localStorage.getItem(this.storageKey)
        if (this.content === null) {
            this.content = []
        } else {
            this.content = JSON.parse(this.content)
        }
    }

    add(oneProduct) {
        this.get()
        let cartContent = this.content
        if (cartContent.length > 0) {
            let index = cartContent.findIndex(product => product.id === oneProduct.id && product.color === oneProduct.color)
            if (index !== -1) {
                cartContent[index].quantity = oneProduct.quantity + parseInt(cartContent[index].quantity)
            } else {
                cartContent.push(oneProduct)
            }
        } else {
            cartContent.push(oneProduct)
        }
        localStorage.setItem(this.storageKey, JSON.stringify(cartContent))
    }

    cartTotals() {
        let quantities = document.getElementsByName("itemQuantity")
        console.log(quantities)
        console.log(quantities.length)
        for (let i = 0; i < quantities.length; i++) {
            const element = quantities[i];
            alert(element.value)
        }
    }
}