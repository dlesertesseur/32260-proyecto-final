import Product from "../entities/product.entity.js";

import { faker } from '@faker-js/faker/locale/es';

const mockingproducts = async (req, res) => {
    const cant = req.query.cant ? parseInt(req.query.cant) : 100;
    const products = [];
    try {
      for (let index = 0; index < cant; index++) {
        const product = new Product({
          id : faker.datatype.uuid(),
          title : faker.commerce.product(),
          description: faker.commerce.productDescription(),
          code: faker.random.alphaNumeric(5),
          price: Number(faker.commerce.price(100, 200, 0)),
          stock : Number(faker.random.numeric(4, { allowLeadingZeros: true })) ,
          category: faker.commerce.department(),
          thumbnail:[faker.image.food()],
          status:"true"
        });
        products.push(product);
      }
      res.send(products);
      
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  
  export {mockingproducts}