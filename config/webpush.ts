// config/webpush.ts
import webpush from 'web-push';
import 'dotenv/config';

const Public_Key = process.env.VAPID_PUBLIC_KEY;
const Private_Key = process.env.VAPID_PRIVATE_KEY;

if (!Public_Key || !Private_Key) {
  throw new Error('VAPID keys غير موجودة بملف .env');
}

webpush.setVapidDetails(
  'mailto:you@example.com',
  Public_Key,
  Private_Key
);

export default webpush;