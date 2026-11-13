"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../middleware/auth");
const mailer_1 = require("../utils/mailer");
const router = (0, express_1.Router)();
const APPLICATION_UPLOAD_DIR = path_1.default.resolve(process.env.PRIVATE_UPLOAD_DIR || './private-uploads/applications');
const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const applicationSubmitLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many applications were submitted. Please try again later.' },
});
const allowedResumeTypes = {
    '.pdf': ['application/pdf'],
    '.doc': ['application/msword', 'application/octet-stream'],
    '.docx': [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/octet-stream',
    ],
};
fs_1.default.mkdirSync(APPLICATION_UPLOAD_DIR, { recursive: true });
const resumeUpload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (_req, _file, callback) => callback(null, APPLICATION_UPLOAD_DIR),
        filename: (_req, file, callback) => {
            callback(null, `${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname).toLowerCase()}`);
        },
    }),
    limits: { fileSize: MAX_RESUME_SIZE, files: 1, fields: 1, parts: 2, fieldSize: 64 * 1024 },
    fileFilter: (_req, file, callback) => {
        const extension = path_1.default.extname(file.originalname).toLowerCase();
        const acceptedTypes = allowedResumeTypes[extension];
        if (!acceptedTypes || !acceptedTypes.includes(file.mimetype.toLowerCase())) {
            callback(new Error('Resume must be a PDF, DOC, or DOCX file.'));
            return;
        }
        callback(null, true);
    },
});
function parseApplication(value) {
    if (typeof value !== 'string')
        return null;
    try {
        return JSON.parse(value);
    }
    catch {
        return null;
    }
}
function validateApplication(data) {
    const maximumLengths = [
        ['Full name', data.fullName, 120],
        ['Email', data.email, 254],
        ['Phone', data.phone, 32],
        ['Country', data.country, 100],
        ['City', data.city, 100],
        ['Position', data.position, 191],
        ['Experience level', data.experienceLevel, 100],
        ['Relevant skills', data.relevantSkills, 12000],
        ['Software knowledge', data.softwareKnowledge, 8000],
        ['Employment status', data.employmentStatus, 100],
        ['Expected salary', data.expectedSalary, 100],
        ['LinkedIn profile', data.linkedinProfile, 500],
        ['Cover letter', data.coverLetter, 20000],
        ['Additional information', data.additionalInfo, 12000],
    ];
    const required = [
        data.fullName,
        data.email,
        data.phone,
        data.country,
        data.city,
        data.position,
        data.relevantSkills,
        data.softwareKnowledge,
    ];
    if (required.some(value => typeof value !== 'string' || !value.trim())) {
        return 'Complete all required application fields.';
    }
    const optionalTextFields = [
        data.experienceLevel,
        data.employmentStatus,
        data.expectedSalary,
        data.linkedinProfile,
        data.coverLetter,
        data.additionalInfo,
    ];
    if (optionalTextFields.some(value => value !== undefined && typeof value !== 'string')) {
        return 'Optional application fields must contain text.';
    }
    if (typeof data.yearsExperience !== 'number' || !Number.isFinite(data.yearsExperience)) {
        return 'Enter a valid number of years of experience.';
    }
    const oversizedField = maximumLengths.find(([, value, maximum]) => typeof value === 'string' && value.length > maximum);
    if (oversizedField)
        return `${oversizedField[0]} exceeds the allowed length.`;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        return 'Enter a valid email address.';
    }
    if (!/^\+?[\d\s().-]{7,24}$/.test(data.phone.trim())) {
        return 'Enter a valid phone number.';
    }
    if (!Number.isFinite(data.yearsExperience) || data.yearsExperience < 0 || data.yearsExperience > 60) {
        return 'Years of experience must be between 0 and 60.';
    }
    if (data.linkedinProfile && !/^https:\/\/(www\.)?linkedin\.com\//i.test(data.linkedinProfile)) {
        return 'Enter a valid LinkedIn profile URL.';
    }
    if (data.position === 'Tax Preparer' && !['Junior Tax Preparer', 'Senior Tax Preparer'].includes(data.experienceLevel || '')) {
        return 'Select a tax preparer experience level.';
    }
    if (data.position === 'Accountant / Bookkeeping' && !['Junior Accountant / Bookkeeper', 'Senior Accountant / Bookkeeper'].includes(data.experienceLevel || '')) {
        return 'Select an accountant / bookkeeper experience level.';
    }
    if (data.privacyAccepted !== true) {
        return 'Privacy policy consent is required.';
    }
    return null;
}
async function removeResume(filePath) {
    try {
        await fs_1.default.promises.unlink(filePath);
    }
    catch (error) {
        console.warn('Could not remove an unsubmitted application resume:', error);
    }
}
async function hasExpectedFileSignature(file) {
    const handle = await fs_1.default.promises.open(file.path, 'r');
    try {
        const signature = Buffer.alloc(8);
        const { bytesRead } = await handle.read(signature, 0, signature.length, 0);
        const bytes = signature.subarray(0, bytesRead);
        const extension = path_1.default.extname(file.originalname).toLowerCase();
        if (extension === '.pdf')
            return bytes.subarray(0, 5).toString() === '%PDF-';
        if (extension === '.doc')
            return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
        return bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;
    }
    finally {
        await handle.close();
    }
}
router.post('/', applicationSubmitLimiter, (req, res, next) => {
    resumeUpload.single('resume')(req, res, error => {
        if (error instanceof multer_1.default.MulterError) {
            const message = error.code === 'LIMIT_FILE_SIZE'
                ? 'Resume must be 5 MB or smaller.'
                : 'Upload one PDF, DOC, or DOCX resume.';
            return res.status(400).json({ error: message });
        }
        if (error)
            return res.status(400).json({ error: error.message });
        next();
    });
}, async (req, res) => {
    const file = req.file;
    const data = parseApplication(req.body.application);
    const validationError = data ? validateApplication(data) : 'Application details are missing or invalid.';
    if (!file)
        return res.status(400).json({ error: 'Resume / CV is required.' });
    let validResume = false;
    try {
        validResume = await hasExpectedFileSignature(file);
    }
    catch (error) {
        console.error('Could not verify uploaded application resume:', error);
    }
    if (!validResume) {
        await removeResume(file.path);
        return res.status(400).json({ error: 'The uploaded file does not match its PDF, DOC, or DOCX extension.' });
    }
    if (validationError || !data) {
        await removeResume(file.path);
        return res.status(400).json({ error: validationError || 'Application details are invalid.' });
    }
    try {
        const email = data.email.trim().toLowerCase();
        const fullName = data.fullName.trim();
        const position = data.position.trim();
        const phone = data.phone.trim();
        const duplicate = await prisma_1.default.careerapplication.findFirst({
            where: {
                email,
                fullName,
                position,
                phone,
                createdAt: { gte: new Date(Date.now() - 60 * 1000) },
            },
            orderBy: { createdAt: 'desc' },
            select: { id: true, createdAt: true },
        });
        if (duplicate) {
            await removeResume(file.path);
            return res.status(409).json({
                error: `This application was already received. Reference: ${duplicate.id}. Please do not submit it again.`,
            });
        }
        const application = await prisma_1.default.careerapplication.create({
            data: {
                id: (0, uuid_1.v4)(),
                fullName,
                email,
                phone,
                country: data.country.trim(),
                city: data.city.trim(),
                position: data.position.trim(),
                experienceLevel: data.experienceLevel?.trim() || null,
                yearsExperience: data.yearsExperience,
                relevantSkills: data.relevantSkills.trim(),
                softwareKnowledge: data.softwareKnowledge.trim(),
                employmentStatus: data.employmentStatus?.trim() || null,
                expectedSalary: data.expectedSalary?.trim() || null,
                linkedinProfile: data.linkedinProfile?.trim() || null,
                coverLetter: data.coverLetter?.trim() || null,
                additionalInfo: data.additionalInfo?.trim() || null,
                privacyAccepted: true,
                resumeOriginalName: path_1.default.basename(file.originalname.replace(/\\/g, '/')).slice(0, 255),
                resumeStoredName: file.filename,
                resumeMimeType: file.mimetype,
                resumeSize: file.size,
            },
            select: { id: true, createdAt: true },
        });
        const emailResult = await (0, mailer_1.sendCareerApplicationEmails)({
            fullName,
            email,
            phone,
            position,
            country: data.country.trim(),
            city: data.city.trim(),
            experienceLevel: data.experienceLevel?.trim() || null,
            yearsExperience: data.yearsExperience,
            relevantSkills: data.relevantSkills.trim(),
            softwareKnowledge: data.softwareKnowledge.trim(),
            coverLetter: data.coverLetter?.trim() || null,
            additionalInfo: data.additionalInfo?.trim() || null,
            applicationDate: application.createdAt,
            resumeName: path_1.default.basename(file.originalname.replace(/\\/g, '/')),
        }, application.id);
        if (!emailResult.customerSent || !emailResult.ownerSent) {
            return res.status(503).json({
                error: `${emailResult.error} Reference: ${application.id}. Your application is saved; please do not submit it again.`,
                submissionReceived: true,
                applicationId: application.id,
                receivedAt: application.createdAt,
                emailDelivery: {
                    customerConfirmation: emailResult.customerSent ? 'accepted_by_smtp' : 'not_accepted',
                    ownerNotification: emailResult.ownerSent ? 'accepted_by_smtp' : 'not_accepted',
                },
            });
        }
        return res.status(201).json({
            success: true,
            applicationId: application.id,
            receivedAt: application.createdAt,
            emailDelivery: {
                customerConfirmation: 'accepted_by_smtp',
                ownerNotification: 'accepted_by_smtp',
            },
            message: 'Your application has been received.',
        });
    }
    catch (error) {
        await removeResume(file.path);
        console.error('Failed to save job application:', error);
        return res.status(500).json({ error: 'Unable to save your application. Please try again later.' });
    }
});
router.get('/', auth_1.authenticate, async (_req, res) => {
    try {
        const applications = await prisma_1.default.careerapplication.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                country: true,
                city: true,
                position: true,
                experienceLevel: true,
                yearsExperience: true,
                relevantSkills: true,
                softwareKnowledge: true,
                employmentStatus: true,
                expectedSalary: true,
                linkedinProfile: true,
                coverLetter: true,
                additionalInfo: true,
                resumeOriginalName: true,
                resumeMimeType: true,
                resumeSize: true,
                status: true,
                createdAt: true,
            },
        });
        return res.json({ applications });
    }
    catch (error) {
        console.error('Failed to fetch job applications:', error);
        return res.status(500).json({ error: 'Failed to fetch job applications.' });
    }
});
router.get('/:id/resume', auth_1.authenticate, async (req, res) => {
    try {
        const applicationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const application = await prisma_1.default.careerapplication.findUnique({
            where: { id: applicationId },
            select: { resumeStoredName: true, resumeOriginalName: true, resumeMimeType: true },
        });
        if (!application)
            return res.status(404).json({ error: 'Application not found.' });
        const filePath = path_1.default.join(APPLICATION_UPLOAD_DIR, path_1.default.basename(application.resumeStoredName));
        await fs_1.default.promises.access(filePath, fs_1.default.constants.R_OK);
        res.setHeader('Content-Type', application.resumeMimeType);
        return res.download(filePath, application.resumeOriginalName);
    }
    catch (error) {
        console.error('Failed to retrieve application resume:', error);
        return res.status(404).json({ error: 'Resume file is unavailable.' });
    }
});
exports.default = router;
