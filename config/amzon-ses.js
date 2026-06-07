const {SESClient, SendEmailCommand} = require('@aws-sdk/client-ses')

const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
})

const sendEmail = async (to, subject, text) =>{
    try {
        const params = {
            Source: process.env.AWS_EMAIL,
            Destination: {ToAdrress: [to] },
            Message: {
                Subject: { Data: subject}, 
                Body : {Text: {Data: text}}
            }
        }

        const command = new SendEmailCommand(params)
        const response = await sesClient.send(command)
        console.log("Email sent successfully! MesageId:", response.MessageId);
        
    } catch (error) {
        console.log("Amazon SES error:", error);
    }
}
module.exports = sendEmail()