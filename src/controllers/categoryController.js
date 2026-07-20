const Category = require('../models/Category');
const slugify = require('slugify');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const { isActive, active, tier } = req.query;
    const filter = {};

    // Support both isActive and active query params
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true' || isActive === true;
    } else if (active !== undefined) {
      filter.isActive = active === 'true' || active === true;
    }

    if (tier) {
      filter.tier = tier;
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Admin
const createCategory = async (req, res, next) => {
  try {
    const {
      tier,
      slug,
      title,
      shortDescription,
      taskBrief,
      hashtag,
      prizeTier,
      cashPrizeMin,
      prizeMin,
      cashPrizeMax,
      prizeMax,
      opensAt,
      closesAt,
      submissionOpens,
      submissionCloses,
      image,
      imageUrl,
      isActive,
      active
    } = req.body;

    if (!title || !shortDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and short description'
      });
    }

    const categorySlug =
      slug || slugify(title, { lower: true, strict: true });

    // Check existing slug
    const existingSlug = await Category.findOne({ slug: categorySlug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'A category with this title or slug already exists'
      });
    }

    // Determine image source (Priority 1: Uploaded File, Priority 2: Direct URL String)
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    } else if (image || imageUrl) {
      imagePath = image || imageUrl;
    }

    const category = await Category.create({
      tier: tier || 'A_CULTURE_IDENTITY',
      slug: categorySlug,
      title,
      shortDescription,
      taskBrief: taskBrief || '',
      hashtag: hashtag || '',
      prizeTier: prizeTier || 'FLAGSHIP',
      cashPrizeMin: cashPrizeMin !== undefined ? Number(cashPrizeMin) : (prizeMin ? Number(prizeMin) : 0),
      cashPrizeMax: cashPrizeMax !== undefined ? Number(cashPrizeMax) : (prizeMax ? Number(prizeMax) : 0),
      submissionWindow: {
        opensAt: opensAt || submissionOpens || Date.now(),
        closesAt: closesAt || submissionCloses || null
      },
      image: imagePath,
      isActive: isActive !== undefined
        ? (isActive === 'true' || isActive === true)
        : (active !== undefined ? (active === 'true' || active === true) : true)
    });

    console.log(`\n===================================================`);
    console.log(`✨ NEW CATEGORY CREATED`);
    console.log(`   Title: ${category.title}`);
    console.log(`   Slug:  ${category.slug}`);
    console.log(`   Tier:  ${category.tier}`);
    console.log(`   Image: ${category.image || 'None'}`);
    console.log(`===================================================\n`);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const updateFields = { ...req.body };

    if (updateFields.title && !updateFields.slug) {
      updateFields.slug = slugify(updateFields.title, {
        lower: true,
        strict: true
      });
    }

    // Image handling: File upload or Direct URL string
    if (req.file) {
      updateFields.image = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    } else if (req.body.image || req.body.imageUrl) {
      updateFields.image = req.body.image || req.body.imageUrl;
    }

    // Map backwards compatibility for cash prizes & active flags
    if (req.body.prizeMin !== undefined && updateFields.cashPrizeMin === undefined) {
      updateFields.cashPrizeMin = Number(req.body.prizeMin);
    }
    if (req.body.prizeMax !== undefined && updateFields.cashPrizeMax === undefined) {
      updateFields.cashPrizeMax = Number(req.body.prizeMax);
    }
    if (req.body.active !== undefined && updateFields.isActive === undefined) {
      updateFields.isActive = req.body.active === 'true' || req.body.active === true;
    }
    if (updateFields.isActive !== undefined) {
      updateFields.isActive = updateFields.isActive === 'true' || updateFields.isActive === true;
    }

    // Map submission window if opensAt/closesAt sent separately
    if (req.body.opensAt || req.body.closesAt) {
      updateFields.submissionWindow = {
        opensAt: req.body.opensAt || category.submissionWindow?.opensAt || Date.now(),
        closesAt: req.body.closesAt || category.submissionWindow?.closesAt || null
      };
    }

    category = await Category.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};
