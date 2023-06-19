const utils = require('/opt/nodejs/common/utils');

module.exports = {
    /**
     * @author reinhed
     * @desc Prepare email options
     * @returns Returns email options
     */
    getMailOptions: async function(template, csvContent, report, csvFileName) {

        let ses = report.ses;
        let subject = await utils.replaceKeywords(ses.subject, report);
        let mailOptions = {
            from: ses.from,
            subject: subject,
            html: template,
            to: ses.to
        };
        //If include report as attachment
        if (JSON.stringify(ses.delivery).includes('attachment')){
            var attachments = [
                        {
                            filename: csvFileName,
                            contentType: 'text/csv',
                            content: Buffer.from(csvContent, "utf-8")
                        }
                    ]
            mailOptions["attachments"] = attachments;
        }
        return mailOptions;
    },
    /**
     * @author reinhed
     * @desc Uploads slack notification
     * @returns Returns upload result
     */
    notifySlack: async function(report, csvContent, csvFileName, client, WebClient, LogLevel) {
        let result;
        if(!utils.isNullOrEmptyValue(csvContent)){
            let slack = report.slack;
            let secretName = slack.secret;
            let secret = await client.getSecretValue({'SecretId': secretName}).promise();
            let webClient = new WebClient(JSON.parse(secret.SecretString).TOKEN, {
                logLevel: LogLevel.DEBUG
            });
            let text = await utils.replaceKeywords(slack.subject, report);
            result = await webClient.files.upload({
                channels: slack.channelId,
                initial_comment: text,
                name: csvFileName,
                title: csvFileName,
                minetype: "text/csv",
                file: Buffer.from(csvContent, "utf-8")
            });
        } else {
            console.log("<< WARNING >> Report file is undefine, will skip posting to slack " + error);
        }
        return result;
    }, 
   /**
    * @author reinhed
    * @desc Loads and initialize handlebar template
    * @returns Returns template
    */
   getTemplate: async function(handlebars, fs, report) {
        let data = {};
        let html = await fs.readFile("/opt/nodejs/" + report.ses.template, { encoding: 'utf-8' });
        const template = handlebars.compile(html);
        if(JSON.stringify(report.ses.delivery).includes('html'))
        {
            data.records = report.result.records;
        }
        data.headers = report.result.headers;
        data.body = report.ses.body;
        return template({report: data});
    }, 
    /**
    * @author reinhed
    * @desc If has records, generate CSV content
    * @returns Returns csv
    */
    generateCSV: async (reportData) => {
        let result;
        var arr = reportData.result.records;
        if( arr.length > 0) {
            result = reportData.result.headers + "\r\n";
            for(var i = 0; i < reportData.result.records.length; i++)
            {
                result += reportData.result.records[i] + "\r\n";
            }
        }
        return result;
     }
}