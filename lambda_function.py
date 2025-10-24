import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import serverlessExpress from "@vendia/serverless-express";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { google } from "googleapis";

// Initialize Express app
const app = express();

// Initialize DynamoDB client (change region as needed)
const dynamoClient = new DynamoDBClient({ region: "ap-south-1" });

// ✅ Global CORS middleware to allow requests from any origin
app.use(
  cors({
    origin: "*", // You can restrict this to your domain in production
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Body parser to parse JSON requests
app.use(bodyParser.json());

/**
 * ✅ Gmail helper
 * Dynamically generates a Gmail client using OAuth2
 * Refreshes token automatically for every request
 */
async function getGmailClient() {
  if (!process.env.GMAIL_AUTH) {
    throw new Error("Missing GMAIL_AUTH environment variable");
  }

  const credentials = JSON.parse(process.env.GMAIL_AUTH);
  const { client_secret, client_id, redirect_uris, refresh_token } =
    credentials.installed;

  if (!refresh_token) {
    throw new Error("Missing refresh_token in GMAIL_AUTH");
  }

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Set refresh token
  oAuth2Client.setCredentials({ refresh_token });

  // Automatically refresh access token
  const { credentials: tokens } = await oAuth2Client.refreshAccessToken();
  oAuth2Client.setCredentials(tokens);

  return google.gmail({ version: "v1", auth: oAuth2Client });
}

/**
 * ✅ Send confirmation email
 * @param {string} toEmail - Recipient email
 * @param {string} name - Recipient name
 */
async function sendConfirmationMail(toEmail, name) {
  try {
    const gmail = await getGmailClient();

    // Email subject and body
    const subject = "Thank you for contacting Nipun Yadav!";
    const message = `
From: "Portfolio Contact" <no-reply@yourdomain.com>
To: ${toEmail}
Subject: ${subject}
Content-Type: text/plain; charset="UTF-8"

Hi ${name},

Thank you for reaching out through the portfolio website.
We’ve received your message and will get back to you soon.

Warm regards,
Portfolio Team
`;

    // Base64 encode the message for Gmail API
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Send email via Gmail API
    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    console.log("[EMAIL SUCCESS] Confirmation mail sent to", toEmail);
  } catch (error) {
    console.error("[EMAIL ERROR]", error.message);
  }
}

/**
 * ✅ Health check endpoint
 */
app.get("/health", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

/**
 * ✅ Contact form endpoint
 */
app.post("/submit", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log("[POST /submit] Incoming request:", req.body);

  const { fullName, subject, email, phone, message, feedback } = req.body;

  // Validate required fields
  if (!fullName || !email || !phone) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  // Unique ID for each submission
  const unique = `${phone}-${Date.now()}`;
  const createdDate = new Date().toLocaleDateString("en-GB");

  // Prepare DynamoDB item
  const item = {
    unique: { S: unique },
    FullName: { S: fullName },
    Subject: { S: subject || "" },
    Email: { S: email },
    Phone: { S: phone },
    Message: { S: message || "" },
    Feedback: { S: feedback || "" },
    Created_Date: { S: createdDate },
  };

  try {
    // Save to DynamoDB
    await dynamoClient.send(
      new PutItemCommand({
        TableName: "contact_form_entries",
        Item: item,
      })
    );

    // Send confirmation email
    await sendConfirmationMail(email, fullName);

    res.json({ success: true });
  } catch (error) {
    console.error("[DYNAMODB or EMAIL ERROR]", error.message);
    res
      .status(500)
      .json({ success: false, error: "Unable to process your request." });
  }
});

/**
 * ✅ Preflight CORS handler for contact form
 */
app.options("/submit", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(204).end();
});

// ✅ Lambda handler for serverless deployment
const serverlessHandler = serverlessExpress({ app });
export const handler = async (event, context) => {
  const response = await serverlessHandler(event, context);
  return response;
};

// ✅ Local development server
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => console.log("Local API running on port 3000"));
}
