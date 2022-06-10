/* 
    comando para instalar las librerias de discord 

        npm install discord.js dotenv
    
    comando para instalar nodemon (para comodidad al usar node y mejorar el flujo de trabajo)     
*/

//
//por cada pusheo a github reiniciar el token para que funcione el bot
//

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

/*
evento para configurar cada nuevo usuario de una forma predeterminada
*/
client.on("guildMemberAdd", async (member) => {
  console.log("prueba");
  client.setups.ensure(member.guild.id, {
    welcomeChannel: "",
    welcomeMessage: "",
    roleDefault: "",
  });

  try {
    const data = client.setups.get(member.guild.id);
    if (data) {
      if (member.guild.channels.cache.get(data.welcomeChannel)) {
        const channel = member.guild.channels.cache.get(data.welcomeChannel);
        if (member.guild.roles.cache.get(data.roleDefault)) {
          member.roles.add(data.roleDefault).catch(console.error);
        }

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
    roleDefault: "",
  });

  const args = message.content.slice(config.prefix.length).trim().split(" ");
  const command = args.shift()?.toLowerCase();

  if (command === "ping") {
    return message.reply(`El ping del bot es de \`${client.ws.ping}ms\``);
  }
  /*
    comando para configurar el canal y el mensaje de bienvenida
  */
  if (command === "setup-welcome") {
    //recuperar el canal como argumento
    const channel =
      message.guild.channels.cache.get(args[0]) ||
      message.mentions.channels.first();
    if (!channel)
      //comprobacion que el canal exista o no
      return message.reply(
        `El canal que ha mencionado no existe!\n**Uso** \`${config.prefix}setup-welcome <#CANAL O ID> <MENSAJE DE BIENVENIDA>\``
      );
    let obj;
    //comprobacion que se pase mensaje de bienvenida o no
    if (args.slice(1).join(" ")) {
      obj = {
        welcomeChannel: channel.id,
        welcomeMessage: args.slice(1).join(" "),
      };
    } else {
      obj = {
        welcomeChannel: channel.id,
        welcomeMessage: `Bienvenido {Usuario} aquí podrás llorar acompañado por su bot de confianza ${config.name} `,
      };
    }

    client.setups.set(message.guild.id, obj);
    return message.reply(
      `Se ha configurado correctamente el canal de bienvenida\n**Canal:** ${channel}\n**Mensaje de bienvenida:** ${obj.welcomeMessage}`
    );
  }
  //asigna el rol por defecto para cada usuario nuevo que entre en el servidor
  if (command === "setup-role-default") {
    const role =
      message.guild.roles.cache.get(args[0]) || message.mentions.roles.first();
    if (!role) {
      return message.reply(
        `El rol que se ha mencionado no existe!\n**Uso** \`${config.prefix}setup-role-default <role>\``
      );
    }
    let obj = {
      roleDefault: role,
    };
    client.setups.set(message.guild.id, obj);
    console.log(obj.roleDefault.name);
    return message.reply(`El rol se ha asignado correctamente`);
  }
  if (command === "server") {
    //const aux=client.guilds.cache.map(g=>g.name).join(" ");
    //const server=client.guilds.cache.map(aux).join(" ");
    const server = message.guild.name;
    message.reply("El nombre de los servers donde esta " + " son " + server);
  }
});

/*
  loguea el bot usando el token del fichero de configuracion y permite usar el resto de metodos
*/
client.login(config.TOKEN);
