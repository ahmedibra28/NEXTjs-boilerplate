const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ahmedibra.com'
            },
            {
                protocol: 'https',
                hostname: 'github.com'
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com'
            }
        ]
    }
}

module.exports = nextConfig
