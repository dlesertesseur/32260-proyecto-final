import { insertProduct } from "../services/product.service.js";

let data = null;
let code = null;
let cat = null;
let price = null;
let stock = null;

for (let index = 0; index < 50; index++) {
  code = Math.floor(Math.random() * 999) + 1;
  price = Math.floor(Math.random() * 9999) + 1;
  stock = Math.floor(Math.random() * 9999) + 1;
  cat = Math.floor(Math.random() * 5) + 1;

  data = {title:`Producto ${index+1}`,description:`Descripcion ${index+1}`,code: code, price: price, status:"true",stock: stock, category:`cat-${cat}`,thumbnail:["img1.png","img2.png"]};

  await insertProduct(data);
  
  console.log("insertProduct", data.title);
}
