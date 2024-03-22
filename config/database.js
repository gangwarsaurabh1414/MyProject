const mongoose = require('mongoose');
require('dotenv').config();

exports.connectDB = () => {
    main()
        .then(() => console.log("Successfully Connected to MongoDB"))
        .catch((err) => console.log(err))
}
async function main() {
    await mongoose.connect(process.env.MONGO_URL)
}

