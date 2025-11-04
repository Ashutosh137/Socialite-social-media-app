/**
 * Firebase Cloud Functions for Socialite
 * Email Notification Service using Nodemailer
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Initialize: firebase init functions
 * 3. Install dependencies: cd functions && npm install
 * 4. Deploy: firebase deploy --only functions
 * 
 * REQUIRED ENVIRONMENT VARIABLES:
 * - email.user: Your email address (e.g., noreply@socialite.com)
 * - email.password: Your email password or app password
 * - email.service: Email service (gmail, outlook, etc.)
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

/**
 * Create email transporter based on service
 */
const createTransporter = () => {
  const emailUser = functions.config().email?.user;
  const emailPassword = functions.config().email?.password;
  const emailService = functions.config().email?.service || "gmail";

  if (!emailUser || !emailPassword) {
    throw new Error("Email configuration missing. Please set email.user and email.password in Firebase config.");
  }

  return nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

/**
 * Cloud Function to send notification emails
 * Endpoint: POST https://your-region-your-project.cloudfunctions.net/sendNotificationEmail
 */
exports.sendNotificationEmail = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  // Only allow POST
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const { to, subject, html, text, notificationType, notificationData } = req.body;

    if (!to || !subject) {
      res.status(400).json({ error: "Missing required fields: to, subject" });
      return;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `Socialite <${functions.config().email?.user || "noreply@socialite.com"}>`,
      to: to,
      subject: subject,
      html: html || text,
      text: text || "",
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);
    res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to send email",
    });
  }
});

/**
 * Cloud Function using onCall (alternative method)
 * More secure, requires authentication
 */
exports.sendNotificationEmailCallable = functions.https.onCall(async (data, context) => {
  // Optional: Verify user is authenticated
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  // }

  try {
    const { to, subject, html, text, notificationType, notificationData } = data;

    if (!to || !subject) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required fields: to, subject"
      );
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `Socialite <${functions.config().email?.user || "noreply@socialite.com"}>`,
      to: to,
      subject: subject,
      html: html || text,
      text: text || "",
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "Failed to send email"
    );
  }
});

