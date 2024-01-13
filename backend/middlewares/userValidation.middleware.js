import User from '../models/User.model.js';

const checkIfEmailExists = async (req, res, next) => {
    try{
        const email = req.body.email;
        const user = await User.findOne({email: email})

        if(user){
            return res.status(409).json({
                msg: 'email already exist'
            })
        }
        else{
            next();
        }
    }catch(error){
        return res.status(500).json({
            error: 'Internal server error'
        })
    }
}

const checkIfUsernameExists = async (req, res, next) => {
    try{
        const username = req.body.username;

        const user = await User.findOne({username: username})

        if(user){
            return res.status(409).json({
                msg: 'usename already exist'
            })
        }
        else{
            next();
        }
    }catch(error){
        return res.status(500).json({
            error: 'Internal server error'
        })
    }
}

const checkIfContactNumberExists = async (req, res, next) => {
    try{
        const contactNumber = req.body.contactNumber;

        const user = await User.findOne({contactNumber: contactNumber})

        if(user){
            return res.status(409).json({
                msg: 'contact number already exist'
            })
        }
        else{
            next();
        }
    }catch(error){
        return res.status(500).json({
            error: 'Internal server error'
        })
    }
}
export {checkIfEmailExists, checkIfUsernameExists, checkIfContactNumberExists};