function authMiddleware(req, res, next) {
    const user = req.session.user || req.user;

    if (!user) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    next();
}

module.exports = authMiddleware;