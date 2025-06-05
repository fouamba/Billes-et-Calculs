export const xapiConfig = {
  endpoint: process.env.NEXT_PUBLIC_LRS_ENDPOINT || 'http://localhost:8000/xapi/',
  auth: {
    username: process.env.NEXT_PUBLIC_LRS_USERNAME || 'addlearn',
    password: process.env.NEXT_PUBLIC_LRS_PASSWORD || 'addlearn123'
  }
};
