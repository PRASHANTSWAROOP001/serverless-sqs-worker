import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";

const s3 = new S3Client({ region: process.env.AWS_REGION || 'ap-south-1' });
const sqs = new SQSClient({ region: process.env.AWS_REGION || 'ap-south-1' });


// Environment variables
const BUCKET_NAME = process.env.CLICK_BUCKET;
const QUEUE_URL = process.env.CLICK_QUEUE_URL;

export const processClicks = async () => {
  try {
    // 1️⃣ Receive messages from SQS (up to 10 at a time)
    const receiveCommand = new ReceiveMessageCommand({
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 5, // long-poll
    });

    const response = await sqs.send(receiveCommand);
    const messages = response.Messages || [];

    if (messages.length === 0) {
      return { statusCode: 200, body: "No messages to process" };
    }

for (const message of messages) {
  try {
    if (!message.Body) continue;

    const clickData = JSON.parse(message.Body);
    const timestamp = new Date(clickData.clickedAt).toISOString().replace(/[:.]/g, "-");
    const key = `shortCode=${clickData.shortCode}/${timestamp}.json`;

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(clickData),
      ContentType: "application/json",
    }));

    if (message.ReceiptHandle) {
      await sqs.send(new DeleteMessageCommand({
        QueueUrl: QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle,
      }));
    }
  } catch (msgErr) {
    console.error("Failed to process message:", msgErr, message.Body);
  }
}


    return { statusCode: 200, body: `Processed ${messages.length} messages` };
  } catch (err) {
    console.error("Error processing clicks:", err);
    return { statusCode: 500, body: JSON.stringify(err) };
  }
};
