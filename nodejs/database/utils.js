module.exports = {
    /**
     * @author reinhed
     * @desc Loads database connection from configuration.
     * If secret name is DEFAULT_TO_LOCAL 
     *    This function will return the database object defined in the property
     *    This is to be used for local test only
     * Otherwise 
     *    This function will retreve db info from AWS secret manager
     * @returns database connection object
     */
    getDatabaseConnection: async function(client, database) {
        let secretName = database.connection.secret;
        if(secretName === "DEFAULT_TO_LOCAL") {
            return database.connection;
        } else {
            let secret = await client.getSecretValue({'SecretId': secretName}).promise();
            return JSON.parse(secret.SecretString);
        }
    }
}