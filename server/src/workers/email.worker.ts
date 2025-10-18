import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis();

const worker = new Worker(
  "email",
  async (job) => {
    if (job.name === "sendWelcomeEmail") {
      console.log(`📧 Sending welcome email to ${job.data.email}`);
      // TODO: integrate with Postmark/SendGrid/mailgun later
    }
  },
  { connection }
);

worker.on("completed", (job) => console.log(`✅ Email job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`❌ Email job ${job?.id} failed: ${err.message}`));
