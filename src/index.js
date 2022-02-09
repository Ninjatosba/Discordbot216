const { Spotify } = require('./spotify.js')
const Discord = require('discord.js')
const { Client, Intents, } = require('discord.js');
const client = new Discord.Client({ intents: 42767 });
const { token } = require('./config.json')
require('dotenv').config()
const {
  SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN, SPOTIFY_PLAYLIST_ID, SPOTIFY_ACCESS_TOKEN ,
  GUILD_ID, SONG_VOTE_CHANNEL, EMOJI_ID_FOR, EMOJI_ID_AGAINST
} = process.env;


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'playlist') {
    await interaction.reply('https://open.spotify.com/playlist/2yyXuYU1hzy7hVmatr5cM0?si=22a071eca1974220');
  }
  else if (interaction.commandName === 'video') {
    await interaction.reply('https://www.youtube.com/playlist?list=UUIuFRHmDktSjlHex7Hahcug&playnext=1&index=1');
  }
});

client.on("messageCreate", async msg => {
  
  if (msg.author.bot) {
    return
  }

  // Check if the message starts with '!hello' and respond with 'world!' if it does.
  if (msg.content === "!hello") {
    msg.reply("world!")

  }

  if (msg.content.startsWith("!dm")) {
    let messageContent = msg.content.replace("!dm", "")
    msg.member.send(messageContent)
  }

  if (msg.content.startsWith("https")) {
    const spotify = new Spotify(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN, SPOTIFY_PLAYLIST_ID, SPOTIFY_ACCESS_TOKEN)

    try {
      trackData = await spotify.getTrackDataFromUrl(msg.content);
    } catch (e) {
      return
        ;
    }

    let { uri, name, artists } = trackData;
    
    spotify.addTrackToPlaylist(uri)


  }

})


client.login(token)

