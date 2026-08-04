import CertificateService from '../services/CertificateService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const generateCertificate = asyncHandler(async (req, res) => {
  const certificate = await CertificateService.generateCertificate(req.body);
  return ApiResponse.success(res, 'Certificate generated successfully', certificate, 201);
});

export const verifyCertificate = asyncHandler(async (req, res) => {
  const cert = await CertificateService.verifyCertificate(req.query.hash);
  return ApiResponse.success(res, 'Certificate verified successfully', cert, 200);
});

export const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await CertificateService.getCreatorCertificates(req.user._id);
  return ApiResponse.success(res, 'Certificates fetched', certificates, 200);
});
