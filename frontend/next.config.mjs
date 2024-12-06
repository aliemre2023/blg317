/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        SECRET_KEY: process.env.SECRET_KEY,
    },
    sassOptions: {
        silenceDeprecations: ['legacy-js-api'],
    },
};

export default nextConfig;
