const router = require('express').Router();

const {
    createCourse,
    getAllCourses,
    getCourseDetails,
} = require('../controllers/Course');


const {
    showAllCategory,
    createCategory,
    categoryPageDetails,
} = require('../controllers/Category');



const {
    createSection,
    updateSection,
    deleteSection
} = require('../controllers/Section')


const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require('../controllers/SubSection');


const {
    createRating,
    getAverageRating,
    getAllRatingReview,
} = require('../controllers/RatingsAndReview');


const { auth, isStudent, isInstructor, isAdmin } = require('../middlewares/auth');


router.post('/createCourse', auth, isInstructor, createCourse);
router.post('/getCourseDetails', auth, isInstructor, getCourseDetails);
router.post('/getAllCourses', auth, isInstructor, getAllCourses);

router.post('/addSection', auth, isInstructor, createSection);
router.post('/updateSection', auth, isInstructor, updateSection);
router.post('/deleteSection', auth, isInstructor, deleteSection);

router.post('/addSubSection', auth, isInstructor, createSubSection);
router.post('/updateSubsection', auth, isInstructor, updateSubSection);
router.post('/deleteSubSection', auth, isInstructor, deleteSubSection);

router.post('/createCategory', auth, isAdmin, createCategory);
router.get('/showAllCategory', showAllCategory)
router.get('/categoryPageDetails', categoryPageDetails);

router.post('/createRating', auth, isStudent, createRating);
router.get('/getAverageRating', getAverageRating);
router.get('/getReviews', getAllRatingReview);

module.exports = router;