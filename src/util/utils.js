const { ButtonStyle } = require('discord.js');

class utils {
    static async getUser(client, message, id){
        let user;
        if(message.content.startsWith(client.user)) user = message.mentions.users.at(1)
        else if(id) user = await client.users.fetch(id).catch(() => null)
        else user = message.mentions.users.first();

        return user;
    };
}

module.exports = utils