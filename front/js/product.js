let myApi = new API()

//Get the product id stored in the search param of the url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id")

//Fetch the product data using his id and insert them in the product page
myApi.getOneProduct(id).then(function(oneProduct) {
    let product = new DomManager(oneProduct)
    product.insertInProduct()
})