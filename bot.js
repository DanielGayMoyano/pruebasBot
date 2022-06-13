/*
    comando para instalar las librerias de discord

        npm install discord.js dotenv
    
    comando para instalar nodemon (para comodidad al usar node y mejorar el flujo de trabajo)
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
//
//por cada pusheo a github reiniciar el token para que funcione el bot
//
var config = require("./config/config.json");
var Discord = require("discord.js");
var Enmap = require("enmap");
var client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        //Discord.Intents.FLAGS.MANAGE_ROLES
    ]
});
//const server=client.guilds.id;
//comprobacion que el bot esta iniciado correctamente
client.on("ready", function () {
    console.log("Conectado como ".concat(client.user.tag));
});
client.setups = new Enmap({
    name: "setups",
    dataDir: "./databases"
});
/*
evento para configurar cada nuevo usuario de una forma predeterminada
*/
client.on("guildMemberAdd", function (member) { return __awaiter(_this, void 0, void 0, function () {
    var data, channel;
    return __generator(this, function (_a) {
        console.log("prueba");
        data = ensureDb(member.guild.id);
        try {
            //añadir mensaje, canal y role a un nuevo usuario
            if (data) {
                if (member.guild.channels.cache.get(data.welcomeChannel)) {
                    channel = member.guild.channels.cache.get(data.welcomeChannel);
                    //console.log("hola mundo");
                    //let role = client.guild.roles.cache.get(data.roleDefault);
                    //console.log(role);
                    //member.roles.add(role);
                    //const embedDatos=new Discord.MessageEmbed().setTitle("")
                    channel.send(data.welcomeMessage.replace(/{Usuario}/, member));
                    //channel.send(data.welcomeMessage.replace(/{NombreBot}/,config.name));
                    console.log(member);
                }
            }
        }
        catch (e) {
            console.log(e);
        }
        console.log(data);
        return [2 /*return*/];
    });
}); });
client.on("messageCreate", function (message) { return __awaiter(_this, void 0, void 0, function () {
    var data, args, command, channel, obj, role, obj, server;
    var _a;
    return __generator(this, function (_b) {
        //comprueba que el que escribe el mensaje no sea un bot, que el server no sea nulo, y que el canal no sea nulo
        //se hace para que no haya un error con esto
        if (message.author.bot || !message.guild || !message.channel)
            return [2 /*return*/];
        data = ensureDb(message.guild.id);
        args = message.content.slice(config.prefix.length).trim().split(" ");
        command = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (command === "ping") {
            return [2 /*return*/, message.reply("El ping del bot es de `".concat(client.ws.ping, "ms`"))];
        }
        /*
          comando para configurar el canal y el mensaje de bienvenida
        */
        if (command === "setup-welcome") {
            channel = message.guild.channels.cache.get(args[0]) ||
                message.mentions.channels.first();
            if (!channel)
                //comprobacion que el canal exista o no
                return [2 /*return*/, message.reply("El canal que ha mencionado no existe!\n**Uso** `".concat(config.prefix, "setup-welcome <#CANAL O ID> <MENSAJE DE BIENVENIDA>`"))];
            obj = void 0;
            //comprobacion que se pase mensaje de bienvenida o no y lo setea a default o personalizado
            if (args.slice(1).join(" ")) {
                obj = {
                    welcomeChannel: channel.id,
                    welcomeMessage: args.slice(1).join(" ")
                };
            }
            else {
                obj = {
                    welcomeChannel: channel.id,
                    welcomeMessage: "Bienvenido {Usuario} aqu\u00ED podr\u00E1s llorar acompa\u00F1ado por su bot de confianza ".concat(config.name, " ")
                };
            }
            //mensaje de comprobacion que ha ido todo correcto
            client.setups.set(message.guild.id, obj);
            console.log("canal de bienvenida: " + obj.welcomeChannel);
            console.log("mensaje de bienvenida: " + obj.welcomeMessage);
            return [2 /*return*/, message.reply("Se ha configurado correctamente el canal de bienvenida\n**Canal:** ".concat(channel, "\n**Mensaje de bienvenida:** ").concat(obj.welcomeMessage))];
        }
        //asigna el rol por defecto para cada usuario nuevo que entre en el servidor
        if (command === "setup-role-default") {
            role = message.guild.roles.cache.get(args[0]) || message.mentions.roles.first();
            if (!role) {
                return [2 /*return*/, message.reply("El rol que se ha mencionado no existe!\n**Uso** `".concat(config.prefix, "setup-role-default <role>`"))];
            }
            obj = {
                roleDefault: role
            };
            client.setups.set(message.guild.id, obj);
            //console.log(client.setups.get(message.guild.id));
            return [2 /*return*/, message.reply("El rol se ha asignado correctamente")];
        }
        if (command === "server") {
            server = message.guild.name;
            message.reply("El nombre de los servers donde esta " + " son " + server);
        }
        return [2 /*return*/];
    });
}); });
/*
  loguea el bot usando el token del fichero de configuracion y permite usar el resto de metodos
*/
client.login(config.TOKEN);
function ensureDb(keySet) {
    var data = client.setups.ensure(keySet, {
        welcomeChannel: "",
        welcomeMessage: "",
        roleDefault: ""
    });
    return data;
}
