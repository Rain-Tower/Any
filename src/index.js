const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs')
require('dotenv').config();

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages], partials: [Partials.Channel, Partials.Message, Partials.GuildMember], allowedMentions: {parse: ['users'], repliedUser: false}});
//Slash Commands
client.commands = new Collection();
const slashCommandsFiles = fs.readdirSync('./src/commands/slash');
for(folder of slashCommandsFiles){
    const commandsFolder = fs.readdirSync(`./src/commands/slash/${folder}`).filter(file => file.endsWith('.js'));
    for(file of commandsFolder){
        const command = require(`./commands/slash/${folder}/${file}`);
        client.commands.set(command.data.name, command)
    }
}

//Prefix Commands
client.prefixCommands = new Collection();

const prefixCommandsFiles = fs.readdirSync('./src/commands/prefix');
for(folder of prefixCommandsFiles){
    const commandsFolder = fs.readdirSync(`./src/commands/prefix/${folder}`).filter(file => file.endsWith('.js'));
    for(file of commandsFolder){
        const command = require(`./commands/prefix/${folder}/${file}`);
        client.prefixCommands.set(command.name, command);
    }
}

//Events
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for(file of eventFiles){
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(client, ...args));
}

client.login();