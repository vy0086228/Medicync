import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  hospitalID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  contactPersonName: { type: String, required: true },
  contactPersonPosition: { type: String, required: true },
  websiteURL: { type: String },
  specialties: { type: [String] },
});

export default mongoose.model("Hospital", hospitalSchema);
