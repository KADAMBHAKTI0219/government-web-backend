import ReportService from '../services/ReportService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const exportApplicationsExcel = asyncHandler(async (req, res) => {
  await ReportService.exportApplicationsExcel(res);
});

export const exportApplicationsCSV = asyncHandler(async (req, res) => {
  await ReportService.exportApplicationsCSV(res);
});
