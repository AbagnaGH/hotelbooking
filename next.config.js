// const securityHeaders = [];

module.exports = {
  reactStrictMode: true,
  // source: '/(.*)',
  // headers: securityHeaders,
  env: {
    PAYSTACK_API_KEY: 'pk_test_9aac5eb96fc41eb0e372e50dcd9e756170867aa3',
    PAYSTACK_SECRET_KEY: 'sk_test_f4cf43061757032b1ae0c830be3749481b47b5a6',
    DB_URI:
      'mongodb+srv://sasco:otompo123@cluster0.tflnf.mongodb.net/blueplanetdb?retryWrites=true&w=majority',
    // DB_LOCAL_URI: 'mongodb://localhost:27017/blueplanet',
    CLOUDINARY_CLOUD_NAME: 'codesmart',
    CLOUDINARY_API_KEY: '924552959278257',
    CLOUDINARY_API_SECRET: 'nyl74mynmNWo5U0rzF8LqzcCE8U',
    SMTP_HOST: 'smtp.mailtrap.io',
    SMTP_PORT: '2525',
    SMTP_USER: '1953d6ff4c8a58',
    SMTP_PASSWORD: 'c1122a5e58187a',
    SMTP_FROM_NAME: 'HOTEL BOOKINGS',
    SMTP_FROM_EMAIL: 'codesmartwebfoft@gmail.com',
    NEXTAUTH_URL:'https://blueplanethotel.vercel.app'
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};
