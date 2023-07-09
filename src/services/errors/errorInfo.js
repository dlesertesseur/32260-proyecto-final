const generateProductErrorInfo = (product) => {
  const info = `One or more product properties are incomplete or invalid
    List of required properties:
    title           : needs to be a string, received: ${product.title}
    description     : needs to be a string, received: ${product.description}
    code            : needs to be a string, received: ${product.code}
    price           : needs to be a number, received: ${product.price}
    stock           : needs to be a number, received: ${product.stock}
    status          : needs to be a boolean, received: ${product.status}
    category        : needs to be a string, received: ${product.category}
    thumbnail       : needs to be a array of strigns, received: ${product.thumbnail}`;
  return info;
};

export {generateProductErrorInfo}
