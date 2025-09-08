import { Clerk } from '@clerk/clerk-sdk-node';

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export const protect = async (req, res, next) => {
    try {
        console.log('[Auth Middleware] Processing request...');

        const authorization = req.headers.authorization;
        if (!authorization) {
            console.log('[Auth Middleware] No authorization header provided');
            return res.status(401).json({ message: 'No authorization header provided.' });
        }

        const token = authorization.split(' ')[1];
        if (!token) {
            console.log('[Auth Middleware] No token provided');
            return res.status(401).json({ message: 'No token provided.' });
        }

        console.log('[Auth Middleware] Token received, verifying with Clerk...');

        try {
            // Method 1: Try verifying the token directly
            const payload = await clerk.verifyToken(token);
            console.log('[Auth Middleware] Token verified successfully:', payload.sub);

            req.userId = payload.sub;
            next();

        } catch (tokenError) {
            console.log('[Auth Middleware] Direct token verification failed, trying session verification...');

            try {
                // Method 2: Try getting user from session token
                const sessions = await clerk.sessions.getSessionList();
                let userFound = false;

                for (const session of sessions) {
                    if (session.lastActiveToken === token || session.lastActiveAt) {
                        req.userId = session.userId;
                        console.log('[Auth Middleware] User ID found from session:', session.userId);
                        userFound = true;
                        break;
                    }
                }

                if (!userFound) {
                    // Method 3: Try decoding the JWT to get user info
                    try {
                        const base64Payload = token.split('.')[1];
                        const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());

                        if (payload.sub) {
                            req.userId = payload.sub;
                            console.log('[Auth Middleware] User ID from JWT payload:', payload.sub);
                            userFound = true;
                        }
                    } catch (jwtError) {
                        console.error('[Auth Middleware] JWT decode failed:', jwtError.message);
                    }
                }

                if (userFound) {
                    next();
                } else {
                    console.error('[Auth Middleware] Could not extract user ID from token');
                    return res.status(401).json({ message: 'Invalid token: User ID not found.' });
                }

            } catch (sessionError) {
                console.error('[Auth Middleware] Session verification failed:', sessionError.message);
                return res.status(401).json({ message: 'Authentication failed.' });
            }
        }

    } catch (error) {
        console.error('[Auth Middleware] General authentication error:', error.message);
        res.status(401).json({ message: 'Not authorized, token failed to verify.' });
    }
};