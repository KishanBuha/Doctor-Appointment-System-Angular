import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('MongoDB Database Connected ✅'))
  // Ahia direct process.env.MONGODB_URI use kariye chiye. .env ma URI ma j "/DAS" hovu joiye.
  await mongoose.connect(process.env.MONGODB_URI)
}

export default connectDB;