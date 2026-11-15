"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdminOtpEmailFromInbox = deleteAdminOtpEmailFromInbox;
// @ts-ignore
const imapflow_1 = require("imapflow");
const logger_1 = require("../utils/logger");
function getImapCredentials() {
    const host = (process.env.IMAP_HOST || 'imap.gmail.com').trim();
    const port = Number(process.env.IMAP_PORT || 993);
    const user = (process.env.SMTP_USER || process.env.EMAIL_HOST_USER)?.trim();
    const pass = (process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.EMAIL_HOST_PASSWORD)?.replace(/\s/g, '');
    if (!user || !pass) {
        throw new Error('IMAP credentials not configured in environment.');
    }
    return { host, port, user, pass };
}
/**
 * Connects to the inbox via secure IMAP and searches for & deletes
 * the temporary password email sent to the admin.
 *
 * It checks both:
 * 1. The recipient INBOX (if delivered to the admin mailbox)
 * 2. Sent Mail / All Mail folders (if applicable)
 */
async function deleteAdminOtpEmailFromInbox(options) {
    const { toEmail, otpCode } = options;
    let client = null;
    let deletedCount = 0;
    try {
        const { host, port, user, pass } = getImapCredentials();
        client = new imapflow_1.ImapFlow({
            host,
            port,
            secure: true,
            auth: { user, pass },
            logger: false,
        });
        await client.connect();
        const mailboxesToCheck = ['INBOX', '[Gmail]/All Mail', '[Gmail]/Sent Mail'];
        for (const mailbox of mailboxesToCheck) {
            try {
                const lock = await client.getMailboxLock(mailbox);
                try {
                    // Search for the temporary admin login password emails
                    const searchQueries = [
                        { subject: 'Preferred Tax Consultancy – Your Temporary Admin Login Password' },
                    ];
                    for (const query of searchQueries) {
                        const messageSeqs = await client.search(query);
                        if (Array.isArray(messageSeqs) && messageSeqs.length > 0) {
                            logger_1.logger.info(`Found ${messageSeqs.length} matching OTP emails in ${mailbox}. Deleting...`);
                            for (const seq of messageSeqs) {
                                try {
                                    await client.messageDelete(seq);
                                    deletedCount++;
                                    logger_1.logger.info(`Deleted temporary password email (seq ${seq}) from ${mailbox}`);
                                }
                                catch (delErr) {
                                    logger_1.logger.warn(`Could not delete message ${seq} in ${mailbox}:`, delErr?.message);
                                }
                            }
                        }
                    }
                }
                finally {
                    lock.release();
                }
            }
            catch (mboxErr) {
                // Mailbox might not exist on some server configurations
                logger_1.logger.debug(`Could not access mailbox ${mailbox}: ${mboxErr?.message}`);
            }
        }
        await client.logout();
        logger_1.logger.info(`Completed mailbox deletion for ${toEmail}. Total deleted: ${deletedCount}`);
        return { success: true, deletedCount };
    }
    catch (error) {
        logger_1.logger.error('Failed to delete temporary password email from inbox via IMAP', {
            toEmail,
            error: error?.message || error,
        });
        if (client) {
            try {
                await client.logout();
            }
            catch {
                // ignore logout error
            }
        }
        return { success: false, deletedCount, error: error?.message };
    }
}
