import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    name: {type: 'string', required: true},
    description: {type: 'string', required: true},
})

export default categorySchema;