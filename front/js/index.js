let myApi = new API()

//Get a usable array of all available products from the API
myApi.getAllProducts().then(function (allProducts) {
    
    //Loop throught the array and insert each product in the index page
    allProducts.forEach(function (oneProduct) {
        let product = new DomManager(oneProduct)
        product.insertInIndex()
        })
})