import User from "../models/users.js";
import jwt from "jsonwebtoken";

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }
  if (err.message === 'incorrect email'){
    errors.email = "that email is not registered"
  }
  if (err.message === 'incorrect password'){
    errors.password = "that password is not registered"
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

const maxAge = 3 * 24 * 60 * 60;

function createToken(id) {
  return jwt.sign({ id }, "Liam", {
    expiresIn: maxAge,
  });
}

export function signup_get(req, res) {
  res.render("signup");
}
export function login_get(req, res) {
  res.render("login");
}
export async function signup_post(req, res) {
  const { email, password } = req.body;

  try {
    const createUsers = await User.create({ email, password }); 
    const token = createToken(createUsers._id);
    res.cookie("jwt", token, { httponly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: createUsers._id });
  } catch (error) {
    handleErrors(error);
    res.status(400).json;
  }
}
export async function login_post(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.login(email,password)
    const token = createToken(createUsers._id);
    res.cookie("jwt", token, { httponly: true, maxAge: maxAge * 1000 });
    res.status(200).json({user: user._id})
  } catch (error) {
    console.error("ERR: " + error)
    res.status(400).json({error})
  }
  
}
