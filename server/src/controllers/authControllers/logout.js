export const logout = async (req, res) => {
    try {
        // Clear the refresh token cookie
        res.clearCookie('jwt', { 
            httpOnly: true, 
            sameSite: 'None', 
            secure: true 
        });
        
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (e) {
        console.error('Logout error:', e);
        res.status(500).json({ error: 'Logout failed' });
    }
};