import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const DEFAULT_USER_ID = process.env.BACKFILL_USER_ID;

if (!DEFAULT_USER_ID) {
  console.error("Set BACKFILL_USER_ID environment variable to the Firebase UID to assign existing data to.");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  console.log(`Backfilling userId=${DEFAULT_USER_ID} on all existing data...`);

  const workspaceResult = await prisma.workspace.updateMany({
    where: { userId: null },
    data: { userId: DEFAULT_USER_ID },
  });
  console.log(`  Workspaces updated: ${workspaceResult.count}`);

  const taskResult = await prisma.task.updateMany({
    where: { userId: null },
    data: { userId: DEFAULT_USER_ID },
  });
  console.log(`  Tasks updated: ${taskResult.count}`);

  const tagResult = await prisma.tag.updateMany({
    where: { userId: null },
    data: { userId: DEFAULT_USER_ID },
  });
  console.log(`  Tags updated: ${tagResult.count}`);

  console.log("Backfill complete.");
}

main()
  .catch((e) => {
    console.error("Backfill failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
