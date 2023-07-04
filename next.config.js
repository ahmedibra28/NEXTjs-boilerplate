const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['github.com', 'ui-avatars.com']
    },
    webpack: (config) => {
        config.resolve.alias['@'] = path.resolve(__dirname);
        return config;
    },
}

module.exports = nextConfig
