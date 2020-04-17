const express = require('express');
const jwt = require('jsonwebtoken');
const redibase = require('./connect')

const app = express();

app.use(express.json())

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/add-account', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.json({
                message: "Forbidden"
            })
        } else {
            const username = req.body.username
            const password = req.body.password
            const decide = redibase.get(`validUsers.${username}`)
            if (!decide) {
                await redibase.set(`validUsers.${username}`, password).catch(err => console.error("ERROR IN ADDING ACCOUNT" + err))
            } else {
                res.json({
                    message: ` ERROR: username ${username} already exists`
                })
            }
            res.json({
                message: "Success"
            })
        }
    })
})

app.post('/api/verify-token', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.json({
                message: false
            })
        } else {
            res.json({
                message: true
            })
        }
    })
})

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.json({
                message: 'Forbidden'
            });
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
});

app.post('/api/login-token-generator', async (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }

    const validate = async (usernameparam) => {
        const checking_password = await redibase.get(`validUsers.${usernameparam}`).catch(err => console.error('ERROR IN GETTING USERNAME + PASSWORD FROM REDIBASE' + err))
        return checking_password
    }

    if (user.password === await validate(user.username)) {
        jwt.sign({ user }, 'secretkey', (err, token) => {
            res.json({
                message: token,
                username: req.body.username,
                password: req.body.password
            });
        });
    } else {
        res.json({
            message: 'INVALID LOGIN',
            username: req.body.username,
            password: req.body.password
        })
    }
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers[''];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.json({
            message: 'Forbidden from verify token'
        });
    }
}

const port = process.env.PORT || 4040

app.listen(port, () => console.log(`Server started on port ${port}`));