let myApi = new API()

myApi.getAllProducts().then(function (allProducts) {
    allProducts.forEach(function (oneProduct) {
        let product = new DomManager(oneProduct)
        product.insertInIndex()
        })
})