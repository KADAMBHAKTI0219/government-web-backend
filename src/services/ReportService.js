import ExcelJS from 'exceljs';
import { Parser } from 'json2csv';
import Application from '../models/Application.js';
import User from '../models/User.js';

class ReportService {
  async exportApplicationsExcel(res) {
    const applications = await Application.find()
      .populate('creator', 'name email phone district')
      .populate('category', 'title')
      .lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    worksheet.columns = [
      { header: 'Application ID', key: 'applicationId', width: 20 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Creator Name', key: 'creatorName', width: 25 },
      { header: 'Creator Email', key: 'creatorEmail', width: 25 },
      { header: 'Category', key: 'categoryTitle', width: 25 },
      { header: 'District', key: 'district', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Average Jury Score', key: 'averageJuryScore', width: 18 },
      { header: 'Total Votes', key: 'totalVotes', width: 15 }
    ];

    applications.forEach((app) => {
      worksheet.addRow({
        applicationId: app.applicationId,
        title: app.title,
        creatorName: app.creator ? app.creator.name : 'N/A',
        creatorEmail: app.creator ? app.creator.email : 'N/A',
        categoryTitle: app.category ? app.category.title : 'N/A',
        district: app.district,
        status: app.status,
        averageJuryScore: app.averageJuryScore || 0,
        totalVotes: app.totalVotes || 0
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename="Applications_Report.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportApplicationsCSV(res) {
    const applications = await Application.find()
      .populate('creator', 'name email phone district')
      .populate('category', 'title')
      .lean();

    const data = applications.map((app) => ({
      ApplicationID: app.applicationId,
      Title: app.title,
      CreatorName: app.creator ? app.creator.name : 'N/A',
      CreatorEmail: app.creator ? app.creator.email : 'N/A',
      Category: app.category ? app.category.title : 'N/A',
      District: app.district,
      Status: app.status,
      AverageJuryScore: app.averageJuryScore || 0,
      TotalVotes: app.totalVotes || 0
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Applications_Report.csv"');
    res.status(200).send(csv);
  }
}

export default new ReportService();
