import serverless from "serverless-http";
import { app } from "../src/app";

// Serverless entry handler for Vercel, AWS Lambda, Netlify Functions
export const handler = serverless(app);

export default handler;
