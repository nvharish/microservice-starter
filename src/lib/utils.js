const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const jose = require('node-jose');
const fs = require('fs');
const path = require('path');

function verifyJwt(token, callback) {
    jwt.verify(token, getKey, (err, decoded) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, decoded);
        }
    });
}

function getKey(header, callback) {
    const client = jwksClient({
        jwksUri: process.env.JWKS_URI,
        timeout: process.env.JWKS_REQ_TIMEOUT ?? 30000,
    });

    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            callback(err, null);
        } else {
            const signingKey = key.getPublicKey();
            callback(null, signingKey);
        }
    });
}

function generateJwt(
    issuer,
    audience,
    payload,
    secretKey,
    algorithm = null,
    header = null
) {
    if (!header) {
        header = {
            alg: 'RS256',
            typ: 'JWT',
        };
    }

    header.kid = getKid();

    payload.iat = Math.floor(Date.now() / 1000);
    const options = {
        expiresIn: parseInt(process.env.JWT_EXP_SEC),
        audience,
        issuer,
        algorithm: algorithm ?? 'RS256',
        header,
    };

    const token = jwt.sign(payload, secretKey, options);

    return token;
}

function generateKid(length = 32) {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomStr = '';

    for (let i = 0; i < length; i++) {
        randomStr += chars[Math.floor(Math.random() * chars.length)];
    }

    return randomStr;
}

async function generateJwks() {
    const publicKey = fs.readFileSync(path.join('certs', 'public_key.pem'));
    const key = await jose.JWK.asKey(publicKey, 'pem');
    const jwk = key.toJSON();
    const jwks = {
        keys: [
            {
                kty: jwk.kty,
                kid: generateKid(),
                alg: 'RS256',
                use: 'sig',
                n: jwk.n,
                e: jwk.e,
            },
        ],
    };

    fs.writeFileSync(
        path.join('public', '.well-known', 'jwks.json'),
        JSON.stringify(jwks)
    );
}

function getKid(jwks = null, kty = 'RSA') {
    if (!jwks) {
        jwks = JSON.parse(
            fs
                .readFileSync(path.join('public', '.well-known', 'jwks.json'))
                .toString()
        );
    }

    const jwk = jwks.keys.find((val) => val.kty === kty);
    return jwk.kid;
}

function getRequestLog(req) {
    return {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body,
    };
}

function getResponseLog(res) {
    let responseBody;
    const send = res.send;

    res.send = function (body) {
        responseBody = body;
        return send.apply(res, arguments);
    };

    return {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        body: responseBody,
    };
}

function getErrorLog(err, req, res) {
    return {
        requestId: crypto.randomUUID(),
        request: getRequestLog(req),
        response: getResponseLog(res),
        message: err.message,
        headers: err.headers ?? null,
        stack: err.stack,
    };
}

module.exports = {
    verifyJwt,
    generateJwt,
    generateJwks,
    getRequestLog,
    getResponseLog,
    getErrorLog,
};
