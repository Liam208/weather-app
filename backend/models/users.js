import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import pkg from 'validator'
const {isEmail} = pkg

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "please enter an email"],
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
    minlength: [6,"Minium password length is 6 characters"]
  },
});



//function before doc got saved
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    
    next()
})

userSchema.statics.login = async function(email,password) {
  const user = await this.findOne({email, password})
  if (user){
    const auth = bcrypt.compare(password, user.password)

    if (auth){
      return user;
    }
    throw Error('incorrect password')
  } 
  throw Error('incorrect email')
}


const User = mongoose.model('user', userSchema)

export default User