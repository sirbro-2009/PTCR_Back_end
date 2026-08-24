// config/webpush.ts
import webpush from 'web-push';
import 'dotenv/config';

const Public_Key = process.env.Public_Key;
const Private_Key = process.env.Private_Key;

if (!Public_Key || !Private_Key) {
  throw new Error('VAPID keys غير موجودة بملف .env');
}

webpush.setVapidDetails(
  'mailto:you@example.com',
  Public_Key,
  Private_Key
);

export default webpush;