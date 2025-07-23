import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, default: "Anon" },
  password: { type: String, required: true },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "pets" }]
}, { timestamps: true, collection: "users" })

const UserModel = mongoose.model("users", userSchema);

export default UserModel