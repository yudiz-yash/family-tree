const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendAdminNotification(newUser) {
  await transporter.sendMail({
    from: `"Family Tree" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: 'New User Registration – Approval Required',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:10px">
        <h2 style="color:#6C3FC5;margin-top:0">New Registration Request</h2>
        <p>A new user has registered and is awaiting your approval:</p>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px 0;color:#6b7280;font-size:14px">Email</td><td style="padding:6px 0;font-weight:600">${newUser.email}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;font-size:14px">Registered</td><td style="padding:6px 0;font-weight:600">${new Date().toLocaleString('en-IN')}</td></tr>
        </table>
        <p style="margin-top:16px">Please log in to the <strong>Admin Panel</strong> to approve or reject this request.</p>
      </div>
    `
  });
}

async function sendApprovalEmail(user) {
  await transporter.sendMail({
    from: `"Family Tree" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Your Account Has Been Approved!',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:10px">
        <h2 style="color:#16a34a;margin-top:0">Account Approved!</h2>
        <p>Your registration for <strong>Luhar Dodiya Parivar Ekta Group</strong> family tree application has been approved.</p>
        <p>You can now log in to your account and start building your family tree.</p>
        <p style="margin-top:16px;color:#6b7280;font-size:13px">Email: <strong>${user.email}</strong></p>
      </div>
    `
  });
}

async function sendRejectionEmail(user) {
  await transporter.sendMail({
    from: `"Family Tree" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Registration Request Update',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:10px">
        <h2 style="color:#dc2626;margin-top:0">Registration Not Approved</h2>
        <p>Unfortunately, your registration request for the family tree application has not been approved.</p>
        <p>If you believe this is a mistake, please contact the administrator.</p>
      </div>
    `
  });
}

module.exports = { sendAdminNotification, sendApprovalEmail, sendRejectionEmail };
