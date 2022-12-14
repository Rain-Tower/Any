const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const guildsDB = require('../util/models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: 'ready', 
    async execute (client) {
        client.user.setPresence({status: 'idle'});
        console.log(`Logged in as ${client.user.tag}!`);

        if(process.env.MONGO_URL){
            mongoose.connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(() => console.log('Bot connected to database'));
        };
        
        const guilds = await guildsDB.find({slashCommands: true});
        if(!guilds) return;
        for(guild of guilds){
            commands = [];
            const slashCommandsFiles = fs.readdirSync('./src/commands/slash');
            for(folder of slashCommandsFiles){
                const commandsFolder = fs.readdirSync(`./src/commands/slash/${folder}`).filter(file => file.endsWith('.js'));
                for(file of commandsFolder){
                    const command = require(`../commands/slash/${folder}/${file}`);
                    if(!guild.development && command.development) break;
                    commands.push(command.data.toJSON());
                }
            }
            const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
            rest.put(Routes.applicationGuildCommands('992846881375916082', guild.id), {body: commands});
        }
    }
}