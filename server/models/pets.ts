import mongoose from 'mongoose';

const objectID = mongoose.Schema.Types.ObjectId

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    animal: { type: String, enum: ["dog", "cat", "bird"]},
    owner: { type: objectID, required: true, ref: "users" }
}, { timestamps: true, collection: "pets" })

const PetModel = mongoose.model("pets", petSchema);

export default PetModel