
import User from '../models/User.js';
import jwt from 'jsonwebtoken'

const handleErros = (err) =>{
    let errors = {username : '', password : ''};
    console.log(err.message, err.code);

    if(err.code === 11000){
        errors.username = 'ชื่อซ้ำครับ';
        return errors; 
    }

    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
};

/** @type {import("express").RequestHandler} */
export const userSignup = async (req,res) => {
    try{
        const newUser = await User.create(req.body);
        const token = createToken(newUser._id);
        res.status(200).json({ user: newUser, token });
    }
    catch (err){
        const errors  = handleErros(err);
        res.status(400).json(errors);
    }
};

/** @type {import("express").RequestHandler} */
export const userLogin = async (req,res) => {
    const {username , password} = req.body;

    try{
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.status(200).json({user, token});
    } catch (err){
        res.status(400).json({Error : err.message});
    }
};