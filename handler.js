import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION || "ap-south-1" });
const BUCKET_NAME = process.env.CLICK_BUCKET;

export const processClicks = async (event) => {
  console.log("Lambda invoked with event:", JSON.stringify(event, null, 2));

  try {
    for (const record of event.Records) {
      const clickData = JSON.parse(record.body);
      const timestamp = new Date(clickData.clickedAt)
        .toISOString()
        .replace(/[:.]/g, "-");
      const key = `shortCode=${clickData.shortCode}/${timestamp}.json`;

      console.log(`Uploading to S3: ${key}`);
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: JSON.stringify(clickData),
          ContentType: "application/json",
        })
      );
    }

    return { statusCode: 200, body: `Processed ${event.Records.length} messages` };
  } catch (err) {
    console.error("Error processing clicks:", err);
    throw err; // Let Lambda handle retries/DLQ
  }
};
