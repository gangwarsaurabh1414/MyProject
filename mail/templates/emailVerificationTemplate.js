exports.emailVerificationMail = (otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
    
    <title>OTP for Verification</title>
    <style>
    .main{
        font-family: Arial, sans-serif;
        background-color:pink;
        color:blue;
            }
            .container {
                margin: 0 auto;
                padding: 20px;
                background-color: ;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                max-width: 400px;
            }
            .otp {
                font-size: 18px;
                color: red;
            }
        </style>
    </head>
    <body class="main">
        <div class="container">
            <h2>OTP for Verification</h2>
            <p class="otp">Your OTP is: <strong>${otp}</strong></p>
        </div>
    </body>
    </html>


`}