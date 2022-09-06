const { EmbedBuilder, Formatters, Colors } = require('discord.js');
const { inspect } = require('util');
const guilds = require('../util/models/guild');

module.exports = {
    name: 'interactionCreate', 
    async execute (client, interaction) {
        if(interaction.isChatInputCommand()){
            const command = client.commands.get(interaction.commandName);
            if(!command) return;

            try{
                await command.run({client, interaction});
            } catch (error) {
                console.log(error);

                const log = new EmbedBuilder()
                    .setTitle('An error occurred with the slash command')
                    .setFields([
                        { name: 'Command name', value: interaction.commandName },
                        { name: 'Error', value: Formatters.codeBlock(inspect(error).substring(0, 1017)) }
                    ])
                    .setColor(Colors.Red);
                
                const development = await guilds.findOne({development: true});
                if(!development?.log.id) return;

                await (client.channels.resolve(development.log.id)).send({content: '<@920325546200694905>', embeds: [log]});
                await interaction.editReply({content: 'There was a problem when executing this command', ephemeral: true})
            }
        }
    }
}