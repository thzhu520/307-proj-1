import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  createdDate: { type: Date, default: Date.now },
  status: String,
});
export default mongoose.model('Report', reportSchema);

