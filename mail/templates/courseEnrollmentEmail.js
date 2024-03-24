exports.courseEnrollementEmail = (courseName, name) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Course Registration Confirmation!</title>
    </head>
    <body>
        <h1>Welcome ${name}</h1>
        <h2>You Enrolled in ${courseName}</h2>
    </body>
    </html>
`}
