const { SlashCommandBuilder, Colors, EmbedBuilder, Formatters } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription("Send bot's information status"),
    run: async({client, interaction}) => {
        const onlineSice = Math.floor(client.readyTimestamp / 1000);
        const firstTimestamp = Date.now();
        await interaction.deferReply();
        const ping = Date.now() - firstTimestamp
        let color;

        if (ping >= 0 && ping < 250) color = Colors.Green;
        else if (ping < 500) color = Colors.Yellow;
        else color = Colors.Red;

        const embed = new EmbedBuilder()
            .setTitle('My status')
            .setFields(
                { name: 'My ping', value: `${ping} ms` }, 
                { name: 'Websocket ping', value: `${client.ws.ping} ms` },
                { name: 'Online since', value: `${Formatters.time(onlineSice)} (${Formatters.time(onlineSice, 'R')})`}
            )
            .setColor(color);

        interaction.editReply({embeds: [embed]});
    }
}