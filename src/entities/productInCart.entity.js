import Product from "./product.entity.js"

class ProductInCart{
    constructor({id, product, quantity}){
        this.id = id.toString(),
        this.product = new Product(product),
        this.quantity = quantity
    }
}

export {ProductInCart}