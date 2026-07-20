import jwt from "jsonwebtoken";
import SibApiV3Sdk from "sib-api-v3-sdk"
const sendVerificationEmail = async (
  userEmail: string,
  verificationCode: string,
  lng: string,
) => {
  try {
    const isArabic = lng === "ar";
    const subject = isArabic ? "رمز تفعيل حسابك" : "Verification Code";
    const htmlContent = isArabic
      ? `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #eee; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">السلام عليكم</h2>
        <p>شكرًا لتسجيلك. يرجى استخدام الرمز التالي لتفعيل حسابك، الرمز صالح لمدة 15 دقيقة:</p>
        <div style="background-color: #f9f9f9; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333; display: inline-block; border-radius: 5px; border: 1px dashed #4CAF50; margin: 20px 0;">
          ${verificationCode}
        </div>
        <p style="font-size: 12px; color: #777;">إذا لم تكن أنت من طلب هذا الرمز، يمكنك تجاهل هذا البريد الإلكتروني بأمان.</p>
      </div>
    `
      : `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #eee; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">AL SALAM ALIKOUM</h2>
        <p>Thank you for registering. Please use the following code to activate your account. The code is valid for 15 minutes:</p>
        <div style="background-color: #f9f9f9; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333; display: inline-block; border-radius: 5px; border: 1px dashed #4CAF50; margin: 20px 0;">
          ${verificationCode}
        </div>
        <p style="font-size: 12px; color: #777;">If you are not the one who requested this code, you can safely ignore this email.</p>
      </div>
    `;

    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications["api-key"].apiKey = process.env.API_KEY;

    const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const data = await emailApi.sendTransacEmail({
      sender: { email: process.env.EMAIL, name: "PTCR" },
      to: [{ email: userEmail }],
      subject: subject,
      htmlContent: htmlContent,
    });
    return true;
  } catch (e) {
    console.error("System Error:", e);
    return false;
  }
};

export default sendVerificationEmail;
