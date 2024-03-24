const Category = require('../models/Category');

// Create category Ka Handler function
exports.createCategory = async (req, res) => {
    try {
        //fetch data from req body
        const { name, description } = req.body;

        //validate data
        if (!name || !description) {
            return res.status(402).json({
                success: false,
                message: "All fields are required",
            });
        }

        //create entry in DB
        const categoryDetails = await Category.create({
            name: name,
            description: description
        });
        console.log("category Details : ", categoryDetails);

        //sucess response
        return res.status(200).json({
            success: true,
            message: "Category Created Successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.messga
        });
    }
}

//fetch all categorys
exports.showAllCategory = async (req, res) => {
    try {
        const allCategorys = await Category.find({}, { name: true, description: true });
        console.log("All categorys : ", allCategorys);

        return res.status(200).json({
            success: true,
            message: "All categorys are fetched Successfully",
            data: allCategorys
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong While fetching All categorys',
            error: err.message,
        });
    }
}

exports.categoryPageDetails = async (req, res) => {
    try {
        // get categorId
        const { categoryId } = req.body;

        // get all courses for the specified Category
        const selectedCategory = await Category.findById(categoryId)
            .populate('courses')
            .exec();

        // validate Category
        if (!selectedCategory) {
            console.log("Category Not Found!");
            return res.status(400).json({
                success: false,
                messgae: "No Such Category Found",
            });
        }
        console.log("All Courses Of  Selected Category : ", selectedCategory);

        // get courses for different Categories
        const differentCategories = await Category.find({
            _id: { $ne: categoryId }
        })
        .populate('courses')
            .exec();
        
        // HW get top selling courses

        // return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories
            },

        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message:"Error in categoryPageDetails Controller"
        })
    }
}