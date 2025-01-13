
const validateLastFmOrigin = (req, res, next) => {
    const origin = req.headers.origin || `http://${req.headers.host}`;

    // If there's no origin, reject the request
    if (!origin) {
        return res.status(403).json({ message: 'No origin provided' });
    }

    const allowedOrigins = [
        'https://moreda.dev',
        'http://localhost:3500'
        
    ];
    
    console.log('Request origin:', origin);  // Debug log
    console.log('Allowed origins:', allowedOrigins);  // Debug log
    
    if (allowedOrigins.includes(origin)) {
        console.log('Origin Accepted')
        res.header('Access-Control-Allow-Credentials', true);
        next();
    } else {
        console.log('Origin rejected:', origin);  // Debug log
        res.status(403).json({ 
            message: 'Access to LAST FM API not allowed from this origin',
            requestOrigin: origin  // Include the rejected origin in response
        });
    }
};

module.exports = validateLastFmOrigin;