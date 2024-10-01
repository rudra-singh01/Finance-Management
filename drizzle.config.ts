import type { Config } from "drizzle-kit";

const config: Config = {
    schema: "./src/utils/schema.tsx",
    dialect: "postgresql",
    dbCredentials: {
        url:'postgresql://neondb_owner:FTfIKLGSJ2r8@ep-withered-bread-a5a2ep8s.us-east-2.aws.neon.tech/neondb?sslmode=require',
    }
};

export default config;