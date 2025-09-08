import { clerkClient } from '@clerk/clerk-sdk-node';

export const protect = async (req, res, next) => {
    try {
        console.log('[Auth Middleware] Processing request...');
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith('Bearer ')) {
            console.log('[Auth Middleware] No valid authorization header provided');
            return res.status(401).json({ message: 'Authorization header with Bearer token required.' });
        }

        const token = authorization.split(' ')[1];
        if (!token) {
            console.log('[Auth Middleware] No token provided');
            return res.status(401).json({ message: 'No token provided.' });
        }

        console.log('[Auth Middleware] Token received, verifying with Clerk...');

        try {
            // Primary method: Verify the session token
            const verifiedToken = await clerkClient.verifyToken(token);
            console.log('[Auth Middleware] Token verified successfully');
            req.userId = verifiedToken.sub;
            next();
        } catch (error) {
            console.error('[Auth Middleware] Token verification failed:', error.message);
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

    } catch (error) {
        console.error('[Auth Middleware] General authentication error:', error.message);
        res.status(401).json({ message: 'Authentication failed.' });
    }
}; 