// @ts-ignore
import { ImapFlow } from 'imapflow';
import { logger } from '../utils/logger';

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
export async function deleteAdminOtpEmailFromInbox(options: {
  toEmail: string;
  otpCode?: string;
  messageId?: string;
}): Promise<{ success: boolean; deletedCount: number; error?: string }> {
  const { toEmail, otpCode } = options;

  let client: any = null;
  let deletedCount = 0;

  try {
    const { host, port, user, pass } = getImapCredentials();

    client = new ImapFlow({
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
              logger.info(`Found ${messageSeqs.length} matching OTP emails in ${mailbox}. Deleting...`);
              for (const seq of messageSeqs) {
                try {
                  await client.messageDelete(seq);
                  deletedCount++;
                  logger.info(`Deleted temporary password email (seq ${seq}) from ${mailbox}`);
                } catch (delErr: any) {
                  logger.warn(`Could not delete message ${seq} in ${mailbox}:`, delErr?.message);
                }
              }
            }
          }
        } finally {
          lock.release();
        }
      } catch (mboxErr: any) {
        // Mailbox might not exist on some server configurations
        logger.debug(`Could not access mailbox ${mailbox}: ${mboxErr?.message}`);
      }
    }

    await client.logout();

    logger.info(`Completed mailbox deletion for ${toEmail}. Total deleted: ${deletedCount}`);
    return { success: true, deletedCount };
  } catch (error: any) {
    logger.error('Failed to delete temporary password email from inbox via IMAP', {
      toEmail,
      error: error?.message || error,
    });
    if (client) {
      try {
        await client.logout();
      } catch {
        // ignore logout error
      }
    }
    return { success: false, deletedCount, error: error?.message };
  }
}

