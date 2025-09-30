## 🔗 URL Shortener Analytics Pipeline

This project is an extension of a URL shortener application, designed to **decouple the collection and processing of click analytics** from the core URL redirection service. This separation enhances the main application's performance and scalability by offloading analytical tasks to a dedicated, serverless pipeline.

<br>

### ✨ Key Features

  * **Decoupled Architecture**: The analytics pipeline runs independently of the main server, preventing performance degradation on the primary service.
  * **Scalability**: The use of AWS SQS, Lambda, and S3 provides a highly scalable solution that can handle millions of events per month with minimal operational overhead.
  * **Cost-Effective**: The architecture leverages AWS's free tiers for SQS and Lambda, making the solution extremely cost-effective, even at a significant scale.
  * **Data Lake**: All analytics data is stored in a structured manner in an S3 data lake, enabling easy querying and analysis using tools like AWS Athena.
  * **Reliable Messaging**: SQS ensures that every click event is reliably processed, as messages are stored in the queue until successfully handled by the Lambda function.

<br>

### ⚙️ Technical Architecture

The system is built on a serverless architecture using **AWS services**. When a user accesses a shortened URL, the main server performs the URL redirection and then sends a click analytics event to an **Amazon SQS (Simple Queue Service)** queue.

1.  **SQS Trigger**: The SQS queue is configured to trigger an **AWS Lambda** function whenever a new message (an analytics event) is added.
2.  **Data Processing**: The Lambda function receives the event data, which includes the unique short code for the URL.
3.  **Data Storage**: The Lambda function then writes this event data into a designated **Amazon S3** bucket. The data is organized within the S3 bucket using the short code as part of the file path, creating a structured data lake.
4.  **Analytics and Reporting**: The S3 bucket serves as a data lake, which can be queried directly using **AWS Athena** to run ad-hoc analytics on the click data.

This decoupled flow ensures that the primary server's response time is not impacted by the analytics processing.

-----

### 🛠️ Tech Stack

  * **Serverless Framework**: For managing and deploying the AWS resources.
  * **Node.js**: The runtime for the AWS Lambda function.
  * **AWS Services**:
      * **SQS**: A message queue for reliable event delivery.
      * **Lambda**: The compute service that processes the analytics data.
      * **S3**: The object storage service acting as the data lake.
      * **Athena**: A query service for analyzing data directly in S3.
      * **IAM (Identity and Access Management)**: To manage permissions and secure access between services.
      * **CloudWatch**: For monitoring and logging the application's performance and activity.

-----

### 🚀 Getting Started

#### Prerequisites

  * Node.js (LTS version)
  * AWS CLI configured with your AWS credentials
  * Serverless Framework installed globally (`npm install -g serverless`)

#### Deployment

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Deploy the serverless stack: `serverless deploy`

The deployment will create the SQS queue, the Lambda function, and the necessary S3 bucket, along with the required IAM roles.

-----

### 📈 Future Enhancements

  * **Real-time Analytics**: Integrate **Amazon Kinesis** to enable real-time streaming and processing of analytics data.
  * **Advanced Visualization**: Connect the S3 data lake to a business intelligence (BI) tool like **Amazon QuickSight** or **Tableau** for advanced dashboards and visualizations.
  * **Automated Data Archiving**: Implement **S3 lifecycle policies** to automatically archive or delete older data, optimizing storage costs.
  * **Enhanced Security**: Add **VPC Endpoints** to ensure all traffic between services remains within the AWS network.