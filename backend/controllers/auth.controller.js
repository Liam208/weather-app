import User from "../models/users.js"
import jwt from 'jsonwebtoken'

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60

function createToken(id){
  return jwt.sign({ id }, 'Liam', {
    expiresIn: maxAge
  })
}

export function signup_get(req,res) {
    res.render('signup')
}
export function login_get(req,res) {
    res.render('login')
}
export async function signup_post(req,res) {
    const { email, password} = req.body

    try {
        const createUsers = await User.create({ email, password })
        res.status(201).json(createUsers)

    } catch (error) {
        handleErrors(error)
        res.status(400).json
    }
}
export async function login_post(req,res) {
    const {email, password} = req.body

    
}