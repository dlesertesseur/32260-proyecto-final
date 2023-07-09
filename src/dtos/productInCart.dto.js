import ProductDto from "./product.dto.js"

class ProductInCartDto{
    constructor({_id, product, quantity}){
        this.id = _id,
        this.product = new ProductDto(product),
        this.quantity = quantity
    }
}

export {ProductInCartDto}