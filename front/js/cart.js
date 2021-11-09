let myCart = new Cart
let myApi = new API()

myCart.get()
myCart.content.forEach(function(cartProduct) {
    let productId  = cartProduct.id
    let productQuantity = cartProduct.quantity
    myApi.getOneProduct(productId).then(function(oneProduct) {
        let product = new DomManager(oneProduct)
        product.insertInCart(productQuantity)
    }) 
    console.log("mon panier:" + myCart.content )
})
myCart.cartTotals()