let myCart = new Cart();
let myApi = new API();
let totalQ = 0;
let totalP = 0;
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
/**
 * Loop through cart array in localstorage to add them to page
 * Update cart totals accordingly
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
 * Check validity of the entire form
 * If valid send to API and redirect to confiration page
 * If not alert error message
 * @function
 */
function orderValidation() {
    let orderBtn = document.getElementById("order");
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