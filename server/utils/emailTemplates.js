export const generateResetPasswordEmail = (resetLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8fafc;
      padding: 20px;
    }
    .container {
      max-width: 480px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }
    .header {
      font-size: 22px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 10px;
    }
    .text {
      font-size: 15px;
      color: #555555;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 12px 20px;
      background-color: #f97316;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      font-size: 12px;
      color: #aaaaaa;
      margin-top: 20px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <p class="header">Reset Your Password</p>
    <p class="text">You requested to reset your password. Click the button below to proceed. This link will expire in 15 minutes.</p>
    <p style="text-align: center;">
      <a href="${resetLink}" class="button">Reset Password</a>
    </p>
    <p class="text">If you did not request this, please ignore this email.</p>
    <p class="footer">© ${new Date().getFullYear()} CaterEase. All rights reserved.</p>
  </div>
</body>
</html>
`;
