const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const userRoutes = require('./routes/User');
const courseRoutes = require('./routes/Course');
const profileRoutes = require('./routes/Profile');
const paymentRoutes = require('./routes/Payment');

const { connectDB } = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true
}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}));
 
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/payment', paymentRoutes);
 
app.get('/', (req, res) => {
    return res.send('Index Route Working Well!');
});

app.listen(PORT, () => {
    connectDB();
    cloudinaryConnect();
    console.log("App is listening to Port : ", PORT);
}); 
 



 
