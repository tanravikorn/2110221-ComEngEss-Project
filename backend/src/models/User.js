import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, "กรุณาใส่ username ด้วยครับ"], 
    unique: true, 
    trim: true,
    lowercase: [true, "กรุณากรอกตัวเล็กทั้งหมด"]
  },
  password: { 
    type: String, 
    required: [true, "กรุณาใส่รหัสผ่านด้วย"],
    minlength: [6, "ความยาว 6 ตัวขึ้นไป"]}
});


//before save we have to hash first
userSchema.pre('save', async function (next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
//static method to login user
userSchema.statics.login = async function(username, password){
  const user = await this.findOne({username});
  if(user){
    const auth = await bcrypt.compare(password, user.password);
    if(auth){
      return user;
    }
    throw new Error('คาดว่า password อาจจะยังนะ');
  }
  throw new Error('ไม่พบข้อมูลของท่าน ณ ขณะนี้ครับ');
}

const User = mongoose.model("User", userSchema);
export default User;
