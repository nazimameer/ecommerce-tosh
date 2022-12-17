const nodemailer = require("nodemailer");


module.exports={
     mailTransporter : nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: 'nazimameerpp@gmail.com',
          pass:  'azrhebpbupdaulca',
        },
      }),

      OTP  : `${Math.floor(1000 + Math.random() * 9000)}` ,
      
}