let myCart = new Cart();
let myApi = new API();
let totalQ = 0;
let totalP = 0;
/**
 * Loop through cart array in localstorage to add them to page
 * Update cart totals accordingly
 * Set the listeners for changes (quantity and product entries)
 * @function
 */
function cartPrinter() {
    myCart.content.forEach(function(cartProduct) {
        DomManager.insertInCart(cartProduct);
        totalP += parseInt(cartProduct.quantity) * parseInt(cartProduct.price);
        totalQ += parseInt(cartProduct.quantity);
    })
    myCart.totals(totalQ, totalP);
    myCart.changeHandler();
    myCart.deleteHandler();   
}
cartPrinter();

/**
 * Check validity of the entire form when button is clicked
 * If valid send to API and redirect to confiration page
 * If not alert error message
 * @function
 */
function orderValidation() {
    let orderBtn = document.getElementById("order");
    orderBtn.addEventListener("click", function(event){
        event.preventDefault();
        let contact = new Form();
        contact.validform()
        if (contact.validCounter !== contact.fieldNbr) {
            alert("Contact form is not valid");
        } else {
            let products = [];
            myCart.content.forEach(function(cartProduct){
                products.push(cartProduct.id);
            });
            const orderBody = {contact,products};
            myApi.postOrder(orderBody)
            .then(function (id) {
                myCart.reset();
                document.location.href = `confirmation.html?id=${id.orderId}`;
            })
            .catch((error) => {
                alert("Something went wrong with the server, sorry!");
                console.log(error);
            });
        }
    });
}
orderValidation();