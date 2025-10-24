# My Profile Portfolio - Serverless Architecture

This repository contains the frontend of my portfolio website, hosted on **AWS S3** and served through **CloudFront**, along with a **serverless backend** for handling contact form submissions using **AWS Lambda** and **DynamoDB**.

---

## Table of Contents

* [Frontend Hosting](#frontend-hosting)
* [Backend Architecture](#backend-architecture)
* [Contact Form API](#contact-form-api)
* [DynamoDB Table](#dynamodb-table)
* [Deployment Steps](#deployment-steps)
* [Technologies Used](#technologies-used)

---

## Frontend Hosting

1. The frontend React (or HTML/JS/CSS) build files are uploaded to an **S3 bucket**.
2. S3 bucket is configured for **static website hosting**.
3. **CloudFront distribution** is created pointing to the S3 bucket for global CDN delivery.
4. All routes except `/submit` are served by CloudFront from the S3 bucket.

**CloudFront Behavior for `/submit`:**

* Path pattern: `/submit*`
* Origin: Lambda Function (via API Gateway)
* Method: POST

---

## Backend Architecture

The backend is fully **serverless**:

* **API Gateway** exposes an endpoint `/submit`.
* **Lambda Function** written in **Node.js** handles POST requests.
* The Lambda function stores contact form submissions in **DynamoDB**.

**Lambda Function (Node.js example)**:

```javascript
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "ap-south-1" });
const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
    try {
        const { name, email, message } = JSON.parse(event.body);

        const params = {
            TableName: TABLE_NAME,
            Item: {
                id: { S: new Date().toISOString() },
                name: { S: name },
                email: { S: email },
                message: { S: message }
            },
        };

        await dynamoClient.send(new PutItemCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Form submitted successfully" }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to submit form" }),
        };
    }
};
```

---

## Contact Form API

* **Endpoint:** `https://<API-GATEWAY-ID>.execute-api.<region>.amazonaws.com/submit`
* **Method:** POST
* **Body JSON Structure:**

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, this is a test message."
}
```

* The Lambda function validates the input and writes it to DynamoDB.

---

## DynamoDB Table

* **Table Name:** `ContactFormSubmissions` (example)
* **Primary Key:** `id` (string)
* **Attributes:** `name`, `email`, `message`, `createdAt` (optional timestamp)

---

## Deployment Steps

1. **Frontend Deployment**

   * Run `npm run build` (React) or use your static files.
   * Upload files to the **S3 bucket**.
   * Configure bucket policy for public read access.
   * Create **CloudFront distribution** and point to the S3 bucket.
   * Add a behavior `/submit` for Lambda/API Gateway.

2. **Backend Deployment**

   * Create a **DynamoDB table** for submissions.
   * Write a Node.js Lambda function to handle the form POST.
   * Create an **API Gateway** endpoint `/submit` pointing to the Lambda function.
   * Update Lambda environment variable `TABLE_NAME` with your DynamoDB table name.

3. **Connect Frontend Form**

   * In your frontend, configure the contact form POST request to `/submit` via CloudFront or API Gateway endpoint.

---

## Technologies Used

* **Frontend:** HTML, CSS, JS, React (optional)
* **AWS Services:**

  * S3 (Static hosting)
  * CloudFront (CDN)
  * Lambda (Serverless function)
  * API Gateway (REST API)
  * DynamoDB (NoSQL Database)
* **Node.js** for Lambda backend
* **AWS SDK v3** for DynamoDB operations

---

## Notes

* Ensure CORS is configured for API Gateway to allow requests from your CloudFront domain.
* All serverless resources can be managed with **AWS SAM**, **Serverless Framework**, or manually via the AWS Console.

---

**Author:** Nipun Yadav
**GitHub:** [https://github.com/Nyadav123/My-Profile-Portfolio](https://github.com/Nyadav123/My-Profile-Portfolio)
