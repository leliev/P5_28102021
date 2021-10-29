let myApi = new API()
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id")
myApi.getOneProduct(id).then(function(oneProduct) {
    let product = new DomManager(oneProduct)
    product.insertInProduct()
})