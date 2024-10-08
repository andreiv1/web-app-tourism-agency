const express = require('express');
const router = express.Router();
const usersService = require('../services/users');

const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

const { userProfileUpdateSchema, updateUserSchema, addUserSchema} = require("../schema/user");
/**
 * USERS ROUTES
 */

router.get('/', isAdmin, async (req, res) => {
    try {
        const {users, pagination} = await usersService.getUsers(req.query.page, req.query.take);
        res.status(201).json({result: users, pagination});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    }
});

router.get('/profile', isAuth, async (req, res) => {
    const userId = req.session.userData.id;
    try {
        const user = await usersService.getUserProfile(userId);
        res.status(201).json({user: user})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    }
})

router.put('/profile', isAuth, async(req, res) => {
    const userId = req.session.userData.id;
    const userData = req.body;
    const validationResult = userProfileUpdateSchema.validate(userData);
    if(validationResult.error){
        return res.status(400).json({ message: validationResult.error.message });
    }
    try {
        await usersService.updateUser(userId, userData);
        res.status(201).json({message: `Profile updated`});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    }
})

router.get('/:id', isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await usersService.getUser(userId);
        if (!user) {
            return res.status(404).json({message: `User with id ${req.params.id} not found`});
        }
        res.status(201).json(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: 'Internal server error'});

    }
});

router.put('/:id', isAdmin, async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    try {
        const validate = updateUserSchema.validate(userData);
        if(validate.error){
            return res.status(400).json({ message: validate.error.message });
        }
        await usersService.updateUser(userId, userData);
        res.status(201).json({message: `User with id ${req.params.id} updated`});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    }
});

router.post('/add', isAdmin, async (req, res) => {
    const userData = req.body;
    try {
        const validate = addUserSchema.validate(userData);
        if(validate.error){
            return res.status(400).json({ message: validate.error.message });
        }
        const userId = await usersService.addUser(userData);
        res.status(201).json({message: 'User created', userId: userId});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    }
});

router.delete('/:id', isAdmin, async (req, res) => {
    const userId = req.params.id;
    if(userId === req.session.userData.id)
        return res.status(400).json({ message: 'You cannot delete yourself' });
    try {
        await usersService.deleteUser(userId);
        res.json({message: `User with id ${req.params.id} deleted`});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    }
});


const { generateUsers } = require("../seeders/user");

router.post('/seed', isAdmin, async (req, res) => {
    const no = req.query.no || 20;
    const users = await generateUsers(no);
    console.log(users)
    for(const user of users){
        await usersService.addUser(user);
    }
    res.json({ message: `Succesfully seeded ${no} users!` });
});


module.exports = router;