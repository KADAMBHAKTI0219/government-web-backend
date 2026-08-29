import User from '../models/User.js';
import Nomination from '../models/Nomination.js';
import Participant from '../models/Participant.js';
import Category from '../models/Category.js';
import Winner from '../models/Winner.js';
import { APPLICATION_STATUS } from '../constants/applicationStatuses.js';

class DashboardService {
  async getDashboardStats() {
    const userCount = await User.countDocuments({ role: { $ne: 'SUPER_ADMIN' } });
    const participantCount = await Participant.countDocuments();
    const nominationCount = await Nomination.countDocuments();

    const totalUsers = userCount + participantCount;
    const totalApplications = nominationCount + participantCount;

    const statusCounts = {
      submitted: await Nomination.countDocuments({ status: APPLICATION_STATUS.SUBMITTED }),
      underReview: await Nomination.countDocuments({ status: { $in: [APPLICATION_STATUS.ELIGIBILITY_REVIEW, APPLICATION_STATUS.PRELIMINARY_ASSESSMENT] } }),
      shortlisted: await Nomination.countDocuments({ status: APPLICATION_STATUS.SHORTLISTED }),
      tier1: await Nomination.countDocuments({ status: { $in: [APPLICATION_STATUS.TIER_1_SCREENING, APPLICATION_STATUS.TIER_1_PASSED, APPLICATION_STATUS.TIER_1_FAILED] } }),
      tier2: await Nomination.countDocuments({ status: { $in: [APPLICATION_STATUS.TIER_2_REVIEW, APPLICATION_STATUS.TIER_2_PASSED, APPLICATION_STATUS.TIER_2_FAILED] } }),
      tier3: await Nomination.countDocuments({ status: { $in: [APPLICATION_STATUS.TIER_3_DUE_DILIGENCE, APPLICATION_STATUS.TIER_3_PASSED, APPLICATION_STATUS.TIER_3_FAILED] } }),
      juryReview: await Nomination.countDocuments({ status: APPLICATION_STATUS.JURY_REVIEW }),
      winners: await Nomination.countDocuments({ status: APPLICATION_STATUS.WINNER }),
      rejected: await Nomination.countDocuments({ status: { $in: [APPLICATION_STATUS.INELIGIBLE, APPLICATION_STATUS.NOT_SELECTED] } })
    };

    // Category Breakdown
    const applicationsByCategory = await Nomination.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: '$categories.categoryTitle', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // District Breakdown
    const applicationsByDistrict = await Nomination.aggregate([
      { $group: { _id: '$applicant.district', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Gender Breakdown
    const applicationsByGender = await Nomination.aggregate([
      { $group: { _id: '$applicant.gender', count: { $sum: 1 } } }
    ]);

    // Platform Breakdown
    const applicationsByPlatform = await Nomination.aggregate([
      { $unwind: '$socialProfiles' },
      { $match: { 'socialProfiles.isPrimary': true } },
      { $group: { _id: '$socialProfiles.platform', count: { $sum: 1 } } }
    ]);

    // Monthly Applications
    const monthlyApplications = await Nomination.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    return {
      overview: {
        totalUsers,
        totalApplications,
        ...statusCounts
      },
      analytics: {
        applicationsByCategory,
        applicationsByDistrict,
        applicationsByGender,
        applicationsByPlatform,
        monthlyApplications
      }
    };
  }
}

export default new DashboardService();
