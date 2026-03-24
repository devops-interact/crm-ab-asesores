const { Resend } = require('resend');
const resend = new Resend('re_3XkDpbMH_6eMgmUhMtVkSwe84CB3tfayc');

async function test() {
  console.log("Testing with contact@yourdomain.com");
  try {
    const res = await resend.emails.send({
      from: 'contact@yourdomain.com', // Simulate system default
      to: 'delivered@resend.dev',
      subject: 'Test Resend',
      html: '<p>Test from crm</p>'
    });
    console.log("Response 1:", res);
  } catch (e) {
    console.log("Error 1:", e.message);
  }

  console.log("\nTesting with onboarding@resend.dev");
  try {
    const res = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'delivered@resend.dev', // This might still fail if delivered@resend.dev isn't the registered owner
      subject: 'Test Resend',
      html: '<p>Test from crm</p>'
    });
    console.log("Response 2:", res);
  } catch (e) {
    console.log("Error 2:", e.message);
  }
}

test();
