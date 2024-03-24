const router = require('express').Router();

const { auth } = require('../middlewares/auth');
const {
    updateProfile,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses
} = require('../controllers/Profile');

router.delete('/deleteProfile',auth, deleteAccount);
router.put('/updateProfile', auth, updateProfile);
router.get('/getUserDetails', auth, getAllUserDetails);

router.get('getEnrolledCourses', auth, getEnrolledCourses);
router.put('updateDisplayPicture', auth, updateDisplayPicture);

module.exports = router;