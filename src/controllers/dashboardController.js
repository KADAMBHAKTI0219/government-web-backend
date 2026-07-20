const Participant = require('../models/Participant');
const Category = require('../models/Category');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/dashboard/stats
// @access  Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalParticipants,
      pendingParticipants,
      submittedParticipants,
      approvedParticipants,
      rejectedParticipants,
      totalCategories,
      activeCategories
    ] = await Promise.all([
      Participant.countDocuments(),
      Participant.countDocuments({ status: 'PENDING' }),
      Participant.countDocuments({ status: 'SUBMITTED' }),
      Participant.countDocuments({ status: 'APPROVED' }),
      Participant.countDocuments({ status: 'REJECTED' }),
      Category.countDocuments(),
      Category.countDocuments({ isActive: true })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalParticipants,
        pendingParticipants,
        submittedParticipants,
        approvedParticipants,
        rejectedParticipants,
        totalCategories,
        activeCategories
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
