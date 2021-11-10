let myCart = new Cart();
let myApi = new API();

function insertInCart(cartProduct) {
    let container = document.getElementById("cart__items");
    let template = 
        `<article class="cart__item" data-id="${cartProduct.id}">
        <div class="cart__item__img">
          <img src="${cartProduct.imageUrl}" alt="${cartProduct.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__titlePrice">
            <h2>${cartProduct.name}</h2>
            <p>${cartProduct.price}€</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartProduct.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
      container.innerHTML += template;
}

let totalQ = 0
let totalP = 0

function cartPrinter() {
    myCart.content.forEach(function(cartProduct) {
        console.log(cartProduct);
        insertInCart(cartProduct);
        totalP += parseInt(cartProduct.quantity) * parseInt(cartProduct.price);
        totalQ += parseInt(cartProduct.quantity);
    })
}
cartPrinter();

function cartTotals(totalQ, totalP) {
    let containerQ = document.getElementById("totalQuantity");
    let containerP = document.getElementById("totalPrice");
    containerQ.innerHTML += totalQ;
    containerP.innerHTML += totalP;
}
cartTotals(totalQ, totalP);

function changeHandler() {
    let container = document.querySelectorAll(".itemQuantity");
    for (let index = 0; index < container.length; index++) {
        container[index].addEventListener('change', function (event) {
            event.preventDefault();
            const newQuantity = event.target.value;
            myCart.content[index].quantity = newQuantity;
            console.log(myCart.content , myCart.storageKey);
            localStorage.clear();
            localStorage.setItem(myCart.storageKey, JSON.stringify(myCart.content));
            location.reload();
            alert("Product quantity changed");
        })
    }
}
changeHandler();

function deleteHandler() {
    let container = document.querySelectorAll(".deleteItem");
    for (let index = 0; index < container.length; index++) {
        container[index].addEventListener('click', function (event) {
            event.preventDefault();
            myCart.content.splice(index, 1);
            console.log(myCart.content , myCart.storageKey);
            localStorage.clear();
            localStorage.setItem(myCart.storageKey, JSON.stringify(myCart.content));
            location.reload();
            alert("Product reference deleted");
        })
    }
}
deleteHandler();


let validCounter= 0;

let nameRegEx = /^[-'a-zA-ZÀ-ÖØ-öø-ÿ\s]{3,}$/;
let nameErrMsg = "At least 3 characters and letters only";

let addrRegEx = /^[-'a-zA-Z0-9À-ÖØ-öø-ÿ\s]{3,}$/;
let addrErrMsg = "At least 3 characters and valid address format";

let mailRegEx = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
let mailErrMesg = "Must be valid e-mail address exemple@exemple.com";

let fNameTest = new regEx(nameRegEx, "firstName", nameErrMsg);
let lNameTest = new regEx(nameRegEx, "lastName", nameErrMsg);
let addrTest = new regEx(addrRegEx, "address", addrErrMsg);
let cityTest = new regEx(nameRegEx, "city", nameErrMsg);
let mailTest = new regEx(mailRegEx, "email", mailErrMesg);

let orderBtn = document.getElementById("order")
orderBtn.addEventListener("click", function(event){
    event.preventDefault();

    let contact = new Form();

    fNameTest.isValid(contact.firstName);
    lNameTest.isValid(contact.lastName);
    addrTest.isValid(contact.address);
    cityTest.isValid(contact.city);
    mailTest.isValid(contact.email);

    if (validCounter !== 5) {
        validCounter = 0;
        alert("Contact form is not valid");
    } else {
        validCounter = 0;
        let products = [];
        myCart.content.forEach(function(cartProduct){
            products.push(cartProduct.id);
        });
        const orderBody = {
            contact,products
        };
        myApi.postOrder(orderBody)
        .then(function (id) {
            localStorage.clear();
            myCart.get();
            document.location.href = `confirmation.html?id=${id.orderId}`;
        })
        .catch((error) => {
            alert(
                "Something went wrong with the server, sorry!"
            );
            console.log(error);
        });
    }
});