const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const fetchUserCollection = require('../db/models/user');

const authUtils = () => {
    return {
        async validateAndHash(user) {
            const fields = Object.keys(user);
            if(!validator.isEmail(user.email)) {
                return undefined;
            }
            if(fields.includes('password')) {
                user.password = await bcrypt.hash(user.password, 8);
            }
            return user;
        },
        async hash(user) {
            const fields = Object.keys(user);
            if(fields.includes('password')) {
                user.password = await bcrypt.hash(user.password, 8);
            }
            return user;
        },
        async validate(uipassword, dbpassword) {
            return await bcrypt.compare(uipassword, dbpassword);
        },
        async generateAuthToken(user) {
            const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1 minutes' });
            if(!user.tokens) {
                user.tokens = [{ token }];
            } else {
                user.tokens.push({ token });
            }
            const userCollection = await fetchUserCollection();
            user = await userCollection.updateOne({ _id: user._id }, { $set: user }, { returnOriginal : false });
            return token;
        },
        toPublic(user) {
            delete user.password;
            delete user.tokens;
            return user;
        },
        publicFilter() {
            return { projection: { password: 0, tokens: 0 } };
        }
    };
}

module.exports = authUtils;