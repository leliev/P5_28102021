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
        let response = await fetch(this.url);
        return response.json();
    }
    /**
     * Fetch the product (object[]) with the given id
     * @param {String} id 
     * @returns {Promise}
     */
    async getOneProduct(id) {
        let response = await fetch(this.url + id);
        return response.json();
    }
    /**
     * Send the orderBody (object[]) with method POST
     * Return API response
     * @param {object[]} orderBody 
     * @returns {Promise}
     */
    async postOrder(orderBody) {
        let response = await fetch(this.url + "/order" , {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderBody),
        });
        return response.json();
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
        let productContainer = document.getElementById("items");
        let template = 
            `<a href="./product.html?id=/${this.oneProduct._id}">
                <article>
                <img src="${this.oneProduct.imageUrl}" alt="${this.oneProduct.altTxt}">
                <h3 class="productName">${this.oneProduct.name}</h3>
                <p class="productDescription">${this.oneProduct.description}</p>
                </article>
            </a>`
        productContainer.innerHTML += template;
    }
    /**
     * Insert the data of the product with the given id in product.html
     * @method 
     */
    insertInProduct() {
        //Set the page title as the name of the product
        document.title = this.oneProduct.name;
        //Set the image of the product
        let imgContainers = document.getElementsByClassName("item__img");
        let template = `<img src="${this.oneProduct.imageUrl}" alt="${this.oneProduct.altTxt}">`;
        imgContainers.item(0).innerHTML += template;

        document.getElementById("title").innerText += this.oneProduct.name;
        document.getElementById("price").innerText += this.oneProduct.price;
        document.getElementById("description").innerText += this.oneProduct.description;

        //Create an option for each available color of the product
        let colors = this.oneProduct.colors;
        colors.forEach(insertColor);

        /**
         * Insert the option of the given color in the color pick menu
         * @param {String} color 
         */
        function insertColor(color) {
            let colorContainer = document.getElementById("colors");
            let template = 
                `<option value="${color}">${color}</option>`
            colorContainer.innerHTML += template;
        }
    }
    /**
     * Creates a new object from API product object
     * Add quantity and color variable
     * Manage the conditional addition of the product in localstorage
     * @method
     */
    addListener() {
        const cartProduct = {
            id: this.oneProduct._id,
            name: this.oneProduct.name,
            price: this.oneProduct.price,
            imageUrl: this.oneProduct.imageUrl,
            description: this.oneProduct.description,
            altTxt: this.oneProduct.altTxt,
            color: "",
            quantity: 0 
        };
        //Add listener and add product when triggered
        document.getElementById("addToCart").addEventListener("click", function() {
            let toAddColor = document.getElementById("colors").value;
            let toAddQuantity = parseInt(document.getElementById("quantity").value);
            if (toAddColor === "" || toAddQuantity === 0) {
                alert("Please choose a color and a quantity")
            } else {
                cartProduct.color = toAddColor;
                cartProduct.quantity = toAddQuantity;
                let myCart = new Cart();
                myCart.add(cartProduct);
            }
        })
    }
}
/**
 * @class
 * @classdesc Manage the cart array in localstorage
 */
class Cart {
    //Initialyse the localstorage and get content if present
    constructor() {
        this.storageKey = "cart";
        this.content = [];
        this.get();
    }
    /**
     * Initialyse localstorage if null
     * Else parse the content of localstorage if present
     * @method
     */
    get() {
        this.content = localStorage.getItem(this.storageKey);
        if (this.content === null) {
            this.content = [];
        } else {
            this.content = JSON.parse(this.content);
        }
    }
    /**
     * Manage adding cartProduct in cart
     * @param {Object[]} oneProduct cartProduct from addListener() method
     * @method
     */
    add(oneProduct) {
        let cartContent = this.content;
        if (cartContent.length > 0) {
            //If oneProduct exist in cart (same id and color) add the new quantity to the old
            let index = cartContent.findIndex(product => product.id === oneProduct.id && product.color === oneProduct.color);
            if (index !== -1) {
                cartContent[index].quantity = oneProduct.quantity + parseInt(cartContent[index].quantity);
                alert("Product quantity changed");
            //Else add the product to cart
            } else {
                cartContent.push(oneProduct);
                alert("Product added to cart");
            }
        //If cart is empty push directly the product
        } else {
            cartContent.push(oneProduct);
            alert("Product added to cart");
        }
        localStorage.setItem(this.storageKey, JSON.stringify(cartContent));
    }
    /**
     * Reset the cart (localstorage)
     * @method
     */
    reset() {
        localStorage.clear();
        this.get();
    }
    /**
     * Listen if a quantity is changed in cart page input
     * If triggered update cart page and localstorage accordingly
     * @method
     */
    changeHandler() {
        let cartContent = this.content;
        let cartKey = this.storageKey;
        let container = document.querySelectorAll(".itemQuantity");
        for (let index = 0; index < container.length; index++) {
            container[index].addEventListener("change", function (event) {
                event.preventDefault();
                const newQuantity = event.target.value;
                cartContent[index].quantity = newQuantity;
                localStorage.clear();
                localStorage.setItem(cartKey, JSON.stringify(cartContent));
                location.reload();
                alert("Product quantity changed");
            })
        }
    }
    /**
     * Listen if a "supprimer" button is clicked in cart page
     * If triggered udatpe cart page and localstorage accordingly
     * @method
     */
    deleteHandler() {
        let cartContent = this.content;
        let cartKey = this.storageKey;
        let container = document.querySelectorAll(".deleteItem");
        for (let index = 0; index < container.length; index++) {
            container[index].addEventListener("click", function (event) {
                event.preventDefault();
                cartContent.splice(index, 1);
                localStorage.clear();
                localStorage.setItem(cartKey, JSON.stringify(cartContent));
                location.reload();
                alert("Product reference deleted");
            })
        }
    }
    /**
     * Push totals in cart page
     * @param {Number} totalQ 
     * @param {Number} totalP
     * @method
     */
    totals(totalQ, totalP) {
        let containerQ = document.getElementById("totalQuantity");
        let containerP = document.getElementById("totalPrice");
        containerQ.innerHTML += totalQ;
        containerP.innerHTML += totalP;
    }
}
/**
 * @class
 * @classdesc Creates an object with cart page form data
 */
class Form {
    constructor() {
      this.firstName = document.getElementById("firstName").value;
      this.lastName = document.getElementById("lastName").value;
      this.address = document.getElementById("address").value;
      this.city = document.getElementById("city").value;
      this.email = document.getElementById("email").value;
    }
}
/**
 * @class
 * @classdesc Creates an object with validation variables
 */
class regEx {
    /**
     * @param {RegExp} regEx 
     * @param {String} field 
     * @param {String} errMsg 
     * @constructor
     */
    constructor(regEx, field, errMsg) {
        this.regEx = regEx;
        this.field = field;
        this.errMsg = errMsg;
    }
    /**
     * Test a form field value for validation
     * Set the error message if fail
     * @param {String} testValue
     * @method
     */
    isValid(testValue) {
        let field = this.field;
        let msgField = field + "ErrorMsg";
        let msgContainer = document.getElementById(msgField);
        if (this.regEx.test(testValue)) {
            msgContainer.innerText = "";
            //Variable needed for total form validation
            validCounter++;
        } else {
            msgContainer.innerText = this.errMsg;
            msgContainer.style.color = "red";
        }
    }
}