exports.signUpTemplate = (verifyLink, firstName) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to America</title>
        <style>
            body {
                font-family: 'Segoe UI', Arial, sans-serif;
                background-color: #f4f6f8;
                margin: 0;
                padding: 0;
                color: #1d1d1d;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
                overflow: hidden;
                border: 1px solid #e3e3e3;
            }
            .header {
                background: linear-gradient(90deg, #d4001a 0%, #003366 100%);
                color: #fff;
                padding: 24px 0 16px 0;
                text-align: center;
            }
            .logo {
                width: 120px;
                margin-bottom: 12px;
            }
            .header h1 {
                margin: 0;
                font-size: 2.1em;
                letter-spacing: 2px;
                font-weight: 700;
            }
            .content {
                padding: 32px 28px 24px 28px;
                background: #f9fafb;
            }
            .content p {
                font-size: 1.08em;
                margin: 18px 0;
                color: #1d1d1d;
            }
            .button-container {
                text-align: center;
                margin: 32px 0 24px 0;
            }
            .button {
                background: linear-gradient(90deg, #d4001a 0%, #003366 100%);
                color: #fff;
                padding: 16px 36px;
                font-size: 1.1em;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(212, 0, 26, 0.12);
                transition: background 0.2s;
                display: inline-block;
            }
            .button:hover {
                background: linear-gradient(90deg, #003366 0%, #d4001a 100%);
            }
            .footer {
                background: #003366;
                color: #fff;
                text-align: center;
                padding: 18px 0;
                font-size: 0.98em;
                border-top: 1px solid #d4001a;
            }
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                }
                .content {
                    padding: 18px 10px 16px 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://i.pinimg.com/736x/16/06/fd/1606fd0b9774328602a2cf26a3a47c9a.jpg" alt="Bank of America Logo" class="logo" />
                <h1>Bank of America</h1>
            </div>
            <div class="content">
                <p>Dear <strong>${firstName}</strong>,</p>
                <p>Thank you for choosing <b>America</b>. We're excited to welcome you to our community.</p>
                <p>To complete your registration, please verify your email address by clicking the button below:</p>
                <div class="button-container">
                    <a href="${verifyLink}" class="button" target="_blank" rel="noopener noreferrer">Verify My Account</a>
                </div>
                <p>If you did not initiate this request, please disregard this email.</p>
                <p>Sincerely,<br>The America Team</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} America Corporation. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};