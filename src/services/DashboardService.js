import User from '../models/User.js';
import Application from '../models/Application.js';
import Vote from '../models/Vote.js';
import Category from '../models/Category.js';
import { ROLES } from '../constants/roles.js';

class DashboardService {
  async getAdminDashboardStats() {
    const [
      totalUsers,
      totalCreators,
      totalJury,
      totalApplications,
      applicationsByStatus,
      applicationsByDistrict,
      totalVotes
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: ROLES.CREATOR }),
      User.countDocuments({ role: ROLES.JURY }),
      Application.countDocuments(),
      Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Application.aggregate([{ $group: { _id: '$district', count: { $sum: 1 } } }]),
      Vote.countDocuments()
    ]);

    return {
      users: { total: totalUsers, creators: totalCreators, jury: totalJury },
      applications: { total: totalApplications, statusBreakdown: applicationsByStatus, districtBreakdown: applicationsByDistrict },
      votes: { total: totalVotes }
    };
  }

  async getJuryDashboardStats(juryId) {
    const assignments = await Application.aggregate([
      {
        $lookup: {
          from: 'juryassignments',
          localField: '_id',
          foreignField: 'application',
          as: 'assignment'
        }
      },
      { $unwind: '$assignment' },
      { $match: { 'assignment.jury': juryId } }
    ]);

    const totalAssigned = assignments.length;
    const completedCount = assignments.filter((a) => a.assignment.status === 'COMPLETED').length;
    const pendingCount = totalAssigned - completedCount;

    return { totalAssigned, completedCount, pendingCount };
  }
}

export default new DashboardService();
