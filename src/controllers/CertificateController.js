import CertificateService from '../services/CertificateService.js';
import Certificate from '../models/Certificate.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

export const generateCertificate = asyncHandler(async (req, res) => {
  const { nominationId, applicationId } = req.body;
  const targetId = nominationId || applicationId;
  const certificate = await CertificateService.generateCertificate(targetId);
  return ApiResponse.success(res, 'Certificate generated successfully', certificate, 201);
});

export const getCertificateById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cert = await Certificate.findOne({
    $or: [
      { certificateId: id },
      ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])
    ]
  }).populate('application');

  if (!cert) {
    return ApiResponse.error(res, 'Certificate not found', 404);
  }

  return ApiResponse.success(res, 'Certificate details retrieved', cert, 200);
});

export const downloadCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let cert = await Certificate.findOne({
    $or: [
      { certificateId: id },
      ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])
    ]
  });

  if (!cert) {
    return ApiResponse.error(res, 'Certificate not found', 404);
  }

  const pdfBuffer = await CertificateService.buildCertificatePDFBuffer(cert.certificateId);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Certificate_${cert.certificateId}.pdf`);
  return res.send(pdfBuffer);
});

export const verifyCertificate = asyncHandler(async (req, res) => {
  const certificateId = req.params.certificateId || req.query.certificateId || req.query.hash;
  const verification = await CertificateService.verifyCertificate(certificateId);
  if (!verification.isValid) {
    return ApiResponse.error(res, verification.message || 'Invalid certificate', 404);
  }
  return ApiResponse.success(res, 'Certificate verified successfully', verification, 200);
});
