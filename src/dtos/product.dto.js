class ProductDto {
  constructor({ _id, title, description, code, price, status, stock, category, thumbnail, owner }) {
    this.id = _id;
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = status;
    this.stock = stock;
    this.category = category;
    this.thumbnail = thumbnail;
    this.owner = owner;
  }
}

export default ProductDto;
