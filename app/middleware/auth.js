const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/auth.config');

function verifyToken(req, res, next) {
    
    const token = req.headers.authorization?.replace("Bearer", "").trim();

    if (!token) {
        return res.status(401).json({ message: 'El token no ha sido proporcionado' });
    }

    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            return res.status(403).json({ message: 'Token inválido' });
        }

        req.userId = decoded.userId;
        next();
    });
};

module.exports = verifyToken;