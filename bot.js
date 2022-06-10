/* 
    comando para instalar las librerias de discord 

        npm install discord.js dotenv
    
    comando para instalar nodemon (para comodidad al usar node y mejorar el flujo de trabajo) 
*/


const config = require("./config/config.json");
const Discord = require("discord.js");
const Enmap = require("enmap");
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
  ],
});
//const server=client.guilds.id;

client.on("ready", () => {
  console.log(`Conectado como ${client.user.tag}`);
});

client.setups = new Enmap({
  name: "setups",
  dataDir: "./databases",
});

client.on("guildMemberAdd", async (member) => {
  client.setups.ensure(member.guild.id, {
    welcomeChannel: "",
    welcomeMessage: "",
  });

  try {
    const data = client.setups.get(member.guild.id);
    if (data) {
      if (member.guild.channels.cache.get(data.welcomeChannel)) {
        const channel = member.guild.channels.cache.get(data.welcomeChannel);
        //const embedDatos=new Discord.MessageEmbed().setTitle("")
        channel.send(data.welcomeMessage.replace(/{Usuario}/, member));
        //channel.send(data.welcomeMessage.replace(/{NombreBot}/,config.name));
      }
    }
  } catch (e) {
    console.log(e);
  }
  
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || !message.channel) return;
  client.setups.ensure(message.guild.id, {
    welcomeChannel: "",
    welcomeMessage: "",
  });

  const args = message.content.slice(config.prefix.length).trim().split(" ");
  const command = args.shift()?.toLowerCase();

  if (command === "ping") {
    return message.reply(`El ping del bot es de \`${client.ws.ping}ms\``);
  }
  if (command === "setup-welcome") {
    const channel =
      message.guild.channels.cache.get(args[0]) ||
      message.mentions.channels.first();
    if (!channel)
      return message.reply(
        `El canal que ha mencionado no existe!\n**Uso** \`${config.prefix}setup-welcome <#CANAL O ID> <MENSAJE DE BIENVENIDA>\``
      );
    /*if (!args.slice(1).join)
      return message.reply(
        `No has especificado un mensaje de bienvenida!\n**Uso** \`${config.prefix}setup-welcome <#CANAL O ID> <MENSAJE DE BIENVENIDA>\``
      );*/
    let obj = {
      welcomeChannel: channel.id,
      welcomeMessage: `Bienvenido a la llorería acompañado por su bot de confianza ${config.name}, {Usuario}`,
    };
    client.setups.set(message.guild.id, obj);
    return message.reply(
      `Se ha configurado correctamente el canal de bienvenida\n**Canal** ${channel}\n**Mensaje de bienvenida:** ${obj.welcomeMessage}`
    );
  }

  if (command === "apagar") {
    console.log("el bot se esta apagando");
  } else if (command === "usuario") {
    let user = message.member.user.username;
    message.reply(
      "Bienvenido a la llorería acompañado por su bot de confianza " +
        name +
        ", " +
        user
    );
    //let user = message.member.user.tag;
    //message.reply("El usuario " + user + " se ha conectado");
  } else if (command === "server") {
    //const aux=client.guilds.cache.map(g=>g.name).join(" ");
    //const server=client.guilds.cache.map(aux).join(" ");
    const server = message.guild.name;
    message.reply(
      "El nombre de los servers donde esta " + name + " son " + server
    );
  }
});

client.login(config.TOKEN);
