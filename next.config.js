const withInterceptStdout = require('next-intercept-stdout')
/** @type {import('next').NextConfig} */
const nextConfig = {
    optimizeFonts: true,
    reactStrictMode: true,
    swcMinify: true,

}

module.exports = withInterceptStdout(nextConfig, (text) => (text.includes('Duplicate atom key') ? '' : text))
