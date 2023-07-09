import { insertCategory } from "../services/category.service.js";

let data = null;

for (let index = 0; index < 5; index++) {

  data = {name:`cat-${index+1}`,description:`Descripcion ${index+1}`};

  await insertCategory(data);
  
  console.log("insertCategory", data.name);
}
