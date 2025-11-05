/**
 * Email Service
 * Handles sending emails for notifications
 * Supports EmailJS (frontend) or Firebase Cloud Functions with Nodemailer (backend)
 * 
 * SETUP INSTRUCTIONS:
 * 
 * Option 1 - EmailJS (Recommended for frontend):
 * 1. Install: npm install @emailjs/browser (already installed)
 * 2. Get credentials from https://www.emailjs.com/
 * 3. Add to .env:
 *    VITE_EmailJS_PublicKey=your_public_key
 *    VITE_EmailJS_ServiceId=your_service_id
 *    VITE_EmailJS_TemplateId=your_template_id
 * 
 * Option 2 - Firebase Cloud Function with Nodemailer (Recommended for production):
 * 1. Initialize Firebase Functions: firebase init functions
 * 2. Install dependencies: cd functions && npm install
 * 3. Configure email: firebase functions:config:set email.user="your-email@gmail.com" email.password="your-password" email.service="gmail"
 * 4. Deploy: firebase deploy --only functions
 * 5. Add to .env:
 *    VITE_CloudFunction_EmailUrl=https://your-region-your-project.cloudfunctions.net/sendNotificationEmail
 */

/**
 * Send notification email using EmailJS or Cloud Function
 * @param {string} toEmail - Recipient email address
 * @param {string} notificationType - Type of notification (like, comment, follow, etc.)
 * @param {object} notificationData - Notification data (username, postId, etc.)
 */
export const sendNotificationEmail = async (toEmail, notificationType, notificationData = {}) => {
  if (!toEmail) {
    console.warn("No email address provided for notification");
    return;
  }

  try {
    // Check if EmailJS is configured
    const emailJSPublicKey = import.meta.env.VITE_EmailJS_PublicKey;
    const emailJSServiceId = import.meta.env.VITE_EmailJS_ServiceId;
    const emailJSTemplateId = import.meta.env.VITE_EmailJS_TemplateId;

    // Check if Cloud Function (Nodemailer) is configured
    const cloudFunctionUrl = import.meta.env.VITE_CloudFunction_EmailUrl;
    
    // Check if Express endpoint is configured
    const expressEmailUrl = import.meta.env.VITE_Express_EmailUrl;

    if (expressEmailUrl) {
      // Use Express endpoint with Nodemailer
      await sendEmailViaExpress(toEmail, notificationType, notificationData);
    }  else {
      console.error("❌ Email notification failed: No email service configured!");
      console.warn("Please set up one of the following options:");
      console.warn("Option 1 - EmailJS (Recommended for frontend):");
      console.warn("  Set in .env file:");
      console.warn("    VITE_EmailJS_PublicKey=your_public_key");
      console.warn("    VITE_EmailJS_ServiceId=your_service_id");
      console.warn("    VITE_EmailJS_TemplateId=your_template_id");
      console.warn("  Get credentials from: https://www.emailjs.com/");
      console.warn("");
      console.warn("Option 2 - Express.js Endpoint (Recommended for custom backend):");
      console.warn("  Set in .env file:");
      console.warn("    VITE_Express_EmailUrl=http://localhost:3000/api/send-notification-email");
      console.warn("  See EXPRESS_EMAIL_SETUP.md for setup instructions");
      console.warn("");
      console.warn("Option 3 - Cloud Function (Recommended for Firebase):");
      console.warn("  Set in .env file:");
      console.warn("    VITE_CloudFunction_EmailUrl=https://your-region-your-project.cloudfunctions.net/sendNotificationEmail");
      console.warn("  Deploy Cloud Function first: firebase deploy --only functions");
    }
  } catch (error) {
    console.error("❌ Error sending notification email:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      toEmail,
      notificationType,
    });
    // Don't throw error - email failure shouldn't break notification creation
  }
};

/**
 * Send email via EmailJS
 * To use EmailJS:
 * 1. Install: npm install @emailjs/browser
 * 2. Get your keys from https://www.emailjs.com/
 * 3. Add to .env:
 *    VITE_EmailJS_PublicKey=your_public_key
 *    VITE_EmailJS_ServiceId=your_service_id
 *    VITE_EmailJS_TemplateId=your_template_id
 */
const sendEmailViaEmailJS = async (toEmail, notificationType, notificationData) => {
  try {
    // Import EmailJS (now installed)
    // @emailjs/browser exports send as a named export
    const emailjsModule = await import("@emailjs/browser");
    const { send } = emailjsModule;
    
    const emailJSPublicKey = import.meta.env.VITE_EmailJS_PublicKey;
    const emailJSServiceId = import.meta.env.VITE_EmailJS_ServiceId;
    const emailJSTemplateId = import.meta.env.VITE_EmailJS_TemplateId;

    if (!emailJSPublicKey || !emailJSServiceId || !emailJSTemplateId) {
      const missing = [];
      if (!emailJSPublicKey) missing.push("VITE_EmailJS_PublicKey");
      if (!emailJSServiceId) missing.push("VITE_EmailJS_ServiceId");
      if (!emailJSTemplateId) missing.push("VITE_EmailJS_TemplateId");
      throw new Error(`EmailJS configuration missing. Missing environment variables: ${missing.join(", ")}`);
    }

    const emailContent = formatNotificationEmail(notificationType, notificationData);

    const templateParams = {
      to_email: toEmail,
      to_name: notificationData.recipientName || "User",
      from_name: notificationData.actorName || "Socialite",
      subject: emailContent.subject,
      message: emailContent.message,
      notification_type: notificationType,
      post_url: notificationData.postUrl || "",
      html_content: emailContent.html,
    };

    const result = await send(
      emailJSServiceId,
      emailJSTemplateId,
      templateParams,
      emailJSPublicKey
    );

    console.log("Notification email sent via EmailJS:", result);
    return result;
  } catch (error) {
    console.error("EmailJS error:", error);
    // Fallback to cloud function with Nodemailer
    try {
      await sendEmailViaCloudFunction(toEmail, notificationType, notificationData);
    } catch (fallbackError) {
      console.error("Both EmailJS and Cloud Function failed:", fallbackError);
      throw error; // Throw original EmailJS error
    }
  }
};

/**
 * Send email via Express.js endpoint (using Nodemailer)
 * 
 * SETUP:
 * 1. Copy express-email-endpoint.js to your Express app
 * 2. Install dependencies: npm install express nodemailer cors dotenv
 * 3. Configure .env: EMAIL_USER, EMAIL_PASSWORD, EMAIL_SERVICE
 * 4. Set environment variable: VITE_Express_EmailUrl=http://localhost:3000/api/send-notification-email
 * 5. See EXPRESS_EMAIL_SETUP.md for detailed instructions
 */
const sendEmailViaExpress = async (toEmail, notificationType, notificationData) => {
  try {
    const expressEmailUrl = import.meta.env.VITE_Express_EmailUrl|| "https://blogup-nine.vercel.app/api/send-notification-email";
    
    if (!expressEmailUrl) {
      console.warn("No Express email endpoint configured. Please set up Express endpoint.");
      console.warn("Set VITE_Express_EmailUrl in your .env file");
      return;
    }

    const response = await fetch(expressEmailUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: toEmail,
        subject: `New Activity on your Account`,
        recipientName: notificationData.recipientName || "User",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || "Unknown error"}`);
    }

    const result = await response.json();
    console.log("Notification email sent via Express endpoint:", result.messageId);
    return result;
  } catch (error) {
    console.error("Express endpoint email error:", error);
    throw error;
  }
};

/**
 * Send email via Firebase Cloud Function (using Nodemailer)
 * 
 * SETUP:
 * 1. Deploy Cloud Function: firebase deploy --only functions
 * 2. Set environment variable: VITE_CloudFunction_EmailUrl=https://your-region-your-project.cloudfunctions.net/sendNotificationEmail
 * 3. Configure email in Firebase: firebase functions:config:set email.user="your-email@gmail.com" email.password="your-password" email.service="gmail"
 */
const sendEmailViaCloudFunction = async (toEmail, notificationType, notificationData) => {
  try {
    const cloudFunctionUrl = import.meta.env.VITE_CloudFunction_EmailUrl;
    
    if (!cloudFunctionUrl) {
      console.warn("No email service configured. Please set up EmailJS or Cloud Function.");
      console.warn("Set VITE_CloudFunction_EmailUrl in your .env file");
      return;
    }

    const emailContent = formatNotificationEmail(notificationType, notificationData);

    const response = await fetch(cloudFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: toEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.message,
        notificationType,
        notificationData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || "Unknown error"}`);
    }

    const result = await response.json();
    console.log("Notification email sent via Cloud Function (Nodemailer):", result.messageId);
    return result;
  } catch (error) {
    console.error("Cloud Function email error:", error);
    throw error;
  }
};

/**
 * Format email content based on notification type
 */
const formatNotificationEmail = (notificationType, notificationData) => {
  const { actorName = "Someone", actorUsername = "", postUrl = "", postContent = "" } = notificationData;
  // Safely get base URL - fallback to empty string if window is not available
  const baseUrl = typeof window !== "undefined" && window.location ? window.location.origin : "";

  const notificationTemplates = {
    postlike: {
      subject: `${actorName} liked your post on Socialite`,
      message: `${actorName} (@${actorUsername}) liked your post.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1d9bf0;">New Like on Your Post</h2>
          <p>Hi there!</p>
          <p><strong>${actorName}</strong> (@${actorUsername}) liked your post on Socialite.</p>
          ${postUrl ? `<p><a href="${postUrl}" style="color: #1d9bf0; text-decoration: none;">View your post →</a></p>` : ""}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">You're receiving this because you have notifications enabled on Socialite.</p>
        </div>
      `,
    },
    addcomment: {
      subject: `${actorName} commented on your post`,
      message: `${actorName} (@${actorUsername}) commented on your post: "${postContent?.substring(0, 50)}..."`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1d9bf0;">New Comment on Your Post</h2>
          <p>Hi there!</p>
          <p><strong>${actorName}</strong> (@${actorUsername}) commented on your post:</p>
          <blockquote style="border-left: 3px solid #1d9bf0; padding-left: 15px; margin: 15px 0; color: #666;">
            ${postContent?.substring(0, 200)}${postContent?.length > 200 ? "..." : ""}
          </blockquote>
          ${postUrl ? `<p><a href="${postUrl}" style="color: #1d9bf0; text-decoration: none;">View and reply →</a></p>` : ""}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">You're receiving this because you have notifications enabled on Socialite.</p>
        </div>
      `,
    },
    addreply: {
      subject: `${actorName} replied to your comment`,
      message: `${actorName} (@${actorUsername}) replied to your comment.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1d9bf0;">New Reply to Your Comment</h2>
          <p>Hi there!</p>
          <p><strong>${actorName}</strong> (@${actorUsername}) replied to your comment.</p>
          ${postUrl ? `<p><a href="${postUrl}" style="color: #1d9bf0; text-decoration: none;">View the conversation →</a></p>` : ""}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">You're receiving this because you have notifications enabled on Socialite.</p>
        </div>
      `,
    },
    follow: {
      subject: `${actorName} started following you on Socialite`,
      message: `${actorName} (@${actorUsername}) started following you on Socialite.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1d9bf0;">New Follower</h2>
          <p>Hi there!</p>
          <p><strong>${actorName}</strong> (@${actorUsername}) started following you on Socialite.</p>
          <p><a href="${baseUrl}/profile/${actorUsername}" style="color: #1d9bf0; text-decoration: none;">View their profile →</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">You're receiving this because you have notifications enabled on Socialite.</p>
        </div>
      `,
    },
    commentlike: {
      subject: `${actorName} liked your comment`,
      message: `${actorName} (@${actorUsername}) liked your comment.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1d9bf0;">New Like on Your Comment</h2>
          <p>Hi there!</p>
          <p><strong>${actorName}</strong> (@${actorUsername}) liked your comment.</p>
          ${postUrl ? `<p><a href="${postUrl}" style="color: #1d9bf0; text-decoration: none;">View the comment →</a></p>` : ""}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">You're receiving this because you have notifications enabled on Socialite.</p>
        </div>
      `,
    },
    replylike: {
      subject: `${actorName} liked your reply`,
      message: `${actorName} (@${actorUsername}) liked your reply.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1d9bf0;">New Like on Your Reply</h2>
          <p>Hi there!</p>
          <p><strong>${actorName}</strong> (@${actorUsername}) liked your reply.</p>
          ${postUrl ? `<p><a href="${postUrl}" style="color: #1d9bf0; text-decoration: none;">View the reply →</a></p>` : ""}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">You're receiving this because you have notifications enabled on Socialite.</p>
        </div>
      `,
    },
  };

  return notificationTemplates[notificationType] || {
    subject: `New notification on Socialite`,
    message: `You have a new notification on Socialite.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1d9bf0;">New Notification</h2>
        <p>Hi there!</p>
        <p>You have a new notification on Socialite.</p>
        <p><a href="${baseUrl}/notification" style="color: #1d9bf0; text-decoration: none;">View notifications →</a></p>
      </div>
    `,
  };
};

export default sendNotificationEmail;

