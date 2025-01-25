const conf = {
    mongodbUrl: String(process.env.MONGODB_URL),
    accessTokenSecret: String(process.env.ACCESS_TOKEN_SECRET),
    accessTokenExpiry: String(process.env.ACCESS_TOKEN_EXPIRY),
    refreshTokenSecret: String(process.env.REFRESH_TOKEN_SECRET),
    refreshTokenExpiry: String(process.env.REFRESH_TOKEN_EXPIRY),
    cloudinaryApiSecret: String(process.env.CLOUDINARY_API_SECRET),
    cloudinaryName: String(process.env.CLOUDINARY_CLOUD_NAME),
    cloudinaryApiKey: String(process.env.CLOUDINARY_API_KEY)
}

export default conf;