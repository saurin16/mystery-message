import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module file
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
config({ path: join(__dirname, '.env') });

// Define the configuration object
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  // Other Next.js configuration options can be added here
};

// Export the configuration object as the default module
export default nextConfig;
