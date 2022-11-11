const Discord = require('discord.js')
const client = new Discord.Client()
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Please enter your Token: ', function (token) {
  rl.question('Please enter your Application ID: ', function (appid) {

    client.login(token)
    const json = require('./options/commands.json')
    rl.close();
  });
});

client.on('ready', () => 
{
  const json = require('./options/commands.json')

  client.api.applications(client.user.id)
      .guilds('1040570981435064370')
      .commands.post({data: json['BADGE']})
})


client.ws.on('INTERACTION_CREATE', async inter => {

  async function send(content, flag) {
    const apiMessage = await Discord.APIMessage.create(client.channels.resolve(inter.channel_id), content)
      .resolveData()
      .resolveFiles();

    client.api.interactions(inter.id,inter.token).callback.post({
      data: {
        type: 4,
        data: {
          ...apiMessage.data,
          files: apiMessage.files,
          flags: flag ? 1 << 6:undefined
        }
      }
    })
  }

  const guild = client.guilds.cache.find(gu => gu.id == inter.guild_id)
  const command = inter.data.name.toLowerCase()
  const args = inter.data.options;

  try {
    let commandFile = require(`./commands/${command}.js`).run(client, inter, args, guild, send)
  }catch(err){
    console.log(err)
  }
})