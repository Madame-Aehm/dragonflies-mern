import mongoose from 'mongoose';

// const profileSchema = new mongoose.Schema({
//   birthdate: String,
//   image: String
// })

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, default: "Anon" },
  password: { type: String, required: true },
  // profile: { type: Boolean, default: false },
  image: { type: String, default: "https://res.cloudinary.com/dpqiaisdz/image/upload/v1753793578/dragonflies/user_profiles/placeholder_iq94uk.png" },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "pets" }]
}, { timestamps: true, collection: "users" })

const UserModel = mongoose.model("users", userSchema);

export default UserModel