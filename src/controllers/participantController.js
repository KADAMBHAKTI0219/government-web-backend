const Participant = require('../models/Participant');
const Otp = require('../models/Otp');
const Category = require('../models/Category');

// @desc    Submit participation / nomination form (Creates or updates single participant document with category nomination)
// @route   POST /api/participants
// @access  Public
const createParticipant = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      age,
      district,
      platform,
      category,
      submissionLink,
      instagram,
      youtube,
      twitter,
      linkedin,
      isInternational,
      privacyAccepted,
      consentAccepted
    } = req.body;

    console.log(`\n===================================================`);
    console.log(`📝 PARTICIPANT NOMINATION SUBMISSION`);
    console.log(`   Name:     ${fullName || 'N/A'}`);
    console.log(`   Phone:    ${phone || 'N/A'}`);
    console.log(`   Category: ${category || 'N/A'}`);
    console.log(`===================================================`);

    // Basic required field validation
    if (
      !fullName ||
      !email ||
      !phone ||
      !age ||
      !district ||
      !platform ||
      !category ||
      !submissionLink
    ) {
      console.log(`❌ Validation Failed: Missing required fields`);
      return res.status(400).json({
        success: false,
        message: 'Please fill all required basic information fields (fullName, email, phone, age, district, platform, category, submissionLink)'
      });
    }

    const cleanPhone = String(phone).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    // Verify category existence (either by ID or Slug)
    let categoryObj;
    const catStr = String(category).trim();
    if (catStr.match(/^[0-9a-fA-F]{24}$/)) {
      categoryObj = await Category.findById(catStr);
    } else {
      categoryObj = await Category.findOne({ slug: catStr });
    }

    if (!categoryObj) {
      console.log(`❌ Submission Failed: Award category "${catStr}" does not exist in database`);
      return res.status(404).json({
        success: false,
        message: `Selected award category "${catStr}" does not exist in database. Please check available categories at GET /api/categories`
      });
    }

    // Check if participant document ALREADY exists for this mobile number or email
    let participant = await Participant.findOne({
      $or: [{ phone: cleanPhone }, { email: cleanEmail }]
    });

    // Determine OTP verification status
    if (!participant) {
      // For new participants, check active verified OTP record
      const verifiedOtp = await Otp.findOne({
        phone: cleanPhone,
        verified: true
      });

      if (!verifiedOtp) {
        console.log(`❌ Submission Failed: Mobile number "${cleanPhone}" is not verified via OTP`);
        return res.status(400).json({
          success: false,
          message: `Mobile number ${cleanPhone} has not been verified via OTP. Please complete OTP verification first.`
        });
      }
    }

    const initialStatus = req.body.status ? req.body.status.toUpperCase() : 'SUBMITTED';
    const newSubmission = {
      category: categoryObj._id,
      submissionLink,
      status: initialStatus,
      submittedAt: new Date()
    };

    if (participant) {
      // Participant ALREADY exists -> Update profile & manage category submission inside categorySubmissions array!
      participant.fullName = fullName;
      participant.email = cleanEmail;
      participant.age = age;
      participant.district = district;
      participant.platform = platform;
      if (instagram !== undefined) participant.instagram = instagram;
      if (youtube !== undefined) participant.youtube = youtube;
      if (twitter !== undefined) participant.twitter = twitter;
      if (linkedin !== undefined) participant.linkedin = linkedin;
      if (isInternational !== undefined) participant.isInternational = isInternational;
      participant.isMobVerified = true;
      participant.otpVerified = true;

      // Check if this category has already been submitted by this participant
      const existingSubIndex = participant.categorySubmissions.findIndex(
        (sub) => sub.category.toString() === categoryObj._id.toString()
      );

      if (existingSubIndex > -1) {
        console.log(`❌ Submission Failed: Participant "${fullName}" has already nominated for category "${categoryObj.title}"`);
        return res.status(400).json({
          success: false,
          message: `You have already submitted a nomination for the "${categoryObj.title}" category. Duplicate nominations for the same category are not allowed.`
        });
      }

      // Push new category submission to participant's categorySubmissions array
      participant.categorySubmissions.push(newSubmission);

      await participant.save();
    } else {
      // Create single participant profile with first category submission
      participant = await Participant.create({
        fullName,
        email: cleanEmail,
        phone: cleanPhone,
        age,
        district,
        platform,
        categorySubmissions: [newSubmission],
        instagram: instagram || '',
        youtube: youtube || '',
        twitter: twitter || '',
        linkedin: linkedin || '',
        isInternational: isInternational || false,
        privacyAccepted: true,
        consentAccepted: true,
        isMobVerified: true,
        otpVerified: true
      });

      // Clean up active OTP record after successful first registration
      await Otp.deleteMany({ phone: cleanPhone });
    }

    const populatedParticipant = await Participant.findById(participant._id).populate(
      'categorySubmissions.category',
      'title slug tier taskBrief hashtag prizeTier cashPrizeMin cashPrizeMax image'
    );

    console.log(`✅ Participant Category Nomination Saved Successfully!`);
    console.log(`   Participant ID: ${participant._id}`);
    console.log(`   Category Title: ${categoryObj.title}`);
    console.log(`   Total Categories Entered: ${participant.categorySubmissions.length}`);
    console.log(`===================================================\n`);

    res.status(201).json({
      success: true,
      message: 'Category nomination submitted successfully',
      participant: populatedParticipant
    });
  } catch (error) {
    console.error(`❌ Submission Error:`, error.message);
    next(error);
  }
};

// @desc    Get all participants
// @route   GET /api/participants
// @access  Admin
const getParticipants = async (req, res, next) => {
  try {
    const { status, category, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const participants = await Participant.find(filter)
      .populate(
        'categorySubmissions.category',
        'title slug tier taskBrief hashtag prizeTier cashPrizeMin cashPrizeMax image'
      )
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Participant.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: participants.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      participants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get participant profile (by phone, email, or id)
// @route   GET /api/participants/profile
// @access  Public / Admin
const getParticipantProfile = async (req, res, next) => {
  try {
    const { phone, email, id } = req.query;

    if (!phone && !email && !id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number, email address, or participant ID as a query parameter (e.g., /api/participants/profile?phone=9274322242)'
      });
    }

    const filter = {};
    if (id) {
      filter._id = id;
    } else if (phone) {
      filter.phone = String(phone).trim();
    } else if (email) {
      filter.email = String(email).trim().toLowerCase();
    }

    const participant = await Participant.findOne(filter).populate(
      'categorySubmissions.category',
      'title slug tier taskBrief hashtag prizeTier cashPrizeMin cashPrizeMax image'
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant profile not found'
      });
    }

    res.status(200).json({
      success: true,
      participant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single participant details by ID
// @route   GET /api/participants/:id
// @access  Admin
const getParticipantById = async (req, res, next) => {
  try {
    const participant = await Participant.findById(req.params.id).populate(
      'categorySubmissions.category',
      'title slug tier taskBrief hashtag prizeTier cashPrizeMin cashPrizeMax image'
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    res.status(200).json({
      success: true,
      participant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update participant status for specific category or overall
// @route   PUT /api/participants/:id/status
// @access  Admin
const updateParticipantStatus = async (req, res, next) => {
  try {
    const { status, categoryId, category } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const upperStatus = status.toUpperCase();
    const validStatuses = ['PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'];

    if (!validStatuses.includes(upperStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const participant = await Participant.findById(req.params.id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    // Update status inside categorySubmissions array
    if (categoryId || category) {
      const targetCatId = categoryId || category;
      const subIndex = participant.categorySubmissions.findIndex(
        (sub) => sub.category.toString() === targetCatId.toString() || sub._id.toString() === targetCatId.toString()
      );
      if (subIndex > -1) {
        participant.categorySubmissions[subIndex].status = upperStatus;
      }
    } else {
      // Update status for all category submissions
      participant.categorySubmissions.forEach((sub) => {
        sub.status = upperStatus;
      });
    }

    await participant.save();

    const populatedParticipant = await Participant.findById(participant._id).populate(
      'categorySubmissions.category',
      'title slug tier taskBrief hashtag prizeTier cashPrizeMin cashPrizeMax image'
    );

    res.status(200).json({
      success: true,
      message: `Participant status updated to ${upperStatus}`,
      participant: populatedParticipant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete participant
// @route   DELETE /api/participants/:id
// @access  Admin
const deleteParticipant = async (req, res, next) => {
  try {
    const participant = await Participant.findById(req.params.id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    await Participant.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Participant deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createParticipant,
  getParticipants,
  getParticipantProfile,
  getParticipantById,
  updateParticipantStatus,
  deleteParticipant
};
