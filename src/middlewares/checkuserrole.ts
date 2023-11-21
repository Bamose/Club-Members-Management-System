// middleware/authMiddleware.js

const checkUserRole = (requiredRole:string) => {
    return ({req, res, next}:any) => {
        // Assuming user role is stored in req.user.role after authentication
        const userRole = req.user.role;

        // Check if the user has the required role
        if (userRole === requiredRole) {
            next(); // User has the required role, proceed to the next middleware/route handler
        } else {
            res.status(403).json({ error: 'Access forbidden' });
        }
    };
};

module.exports = { checkUserRole };
