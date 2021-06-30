// require the discord.js module  
const Discord = require('discord.js');
const fs = require('fs');

// create a new Discord client
const client = new Discord.Client({ ws: { intents: ['GUILDS','GUILD_MESSAGES','GUILD_MEMBERS','GUILD_EMOJIS','GUILD_WEBHOOKS','GUILD_MESSAGE_REACTIONS'] } });
client.once("ready", () =>{
    console.log(`Ready !`);
});
client.on('ready', () => {
    client.setMaxListeners(0);
    client.user.setPresence({
        activity: {
            name: '!help to get help',
            type: "PLAYING",
            url: "https://github.com/Miniflint?tab=repositories"
        }
    });
});
//Mise à Jour
client.on('message', async message =>{
    if(['!Maj', '!MAJ', '!maj', '!MiseAJour', '!miseajour', '!miseaJour', '!Miseajour'].includes(message.content)) {
        var maj = 'maj';
        message.channel.send({embed:helpCommand(maj)});
    }
});
//!Clear
client.on('message', async message => {
    if (message.content === '!clear' || message.content === '!Clear') {
        console.log(message.author.tag + " used this command : !clear");
        message.channel.bulkDelete(100);
    }
})
//!Help
client.on('message', message => {
    if (['!help', '!Help'].includes(message.content)) {
        console.log(message.author.tag + " used this command : !help || !Help");
        const Embed = new Discord.MessageEmbed()
            .setTitle("Commande d'aide")
            .addField('any command + help', "affiche le message d'aide pour la commande")
            .addField('!Maj', 'Dernières informations sur le Bot :)')
            .addField('!clear', 'Clear un channel (max 100 messages)')
            .addField('!help', "Affiche l'aide")
            .addField('!training', `Affiche le planning pour ce soir`)
            .addField('!list', 'Affiche les réactions au message')
            .addField('!planning', 'Affiche le planning de la semaine, à utiliser Lundi')
            .addField('!scrim', 'Demande qui est prêt à faire un scrim pour la date ')
            .addField('!clash', 'Demande qui est prêt à faire un clash pour la date X')
            .addField('!player', 'Affiche un résultat aléatoire pour motiver le joueur')
            .addField('!roleClear', 'Enlève le rôle temporaire pour le @')
            .addField('!op.gg', 'Display user(s) op.gg')
            .setColor('#6600cc');
        message.channel.send({
            embed: Embed
        });
    };
});
//Traning-flex
client.on('message', message => {
    [cmd, heureDebutA, heureFinA, heureDebutB, heureFinB] = message.content.split(" "); // Splits the message content with space as a delimiter
    let prefix = "!";
    let command = cmd.replace(prefix, ""); // Gets the first element of msgArray and removes the prefix
    if(command === "training" || command === "Training" || command === "flex" || command === "Flex") {
        let allowedRole = message.guild.roles.cache.get("823522967618584627"); //role id
        if (heureDebutA && heureFinA && heureDebutB && heureFinB) {
            calculHeureDebutA = String(heureDebutA)
            calculHeureFinA = String(heureFinA)
            calculHeureDebutB = String(heureDebutB)
            calculHeureFinB = String(heureFinB)
            if (calculHeureDebutA < calculHeureFinA)  { //|| calculHeureFinA < calculHeureDebutB || calculHeureDebutB < calculHeureFinB)
                if (message.member.roles.cache.has(allowedRole.id)) {
                        console.log(message.author.tag + " " + "used this command : !training");
                        message.channel.send(`@here\nEntrainement ce soir ${calculHeureDebutA}h - ${calculHeureFinA}h / ${calculHeureDebutB}h - ${calculHeureFinB}h : flex. Qui est là ?\n\n:thumbsup:  Si oui ( de  ${calculHeureDebutA}h à ${calculHeureFinB}h )\n\n:thumbsdown:  Si non\n\n:fingers_crossed:  Si là mais de ${calculHeureDebutA}h à ${calculHeureFinA}h \n\n:raised_hand: Si là mais de ${calculHeureDebutB}h à ${calculHeureFinB}h`).then(async msg => {
                            await msg.react('👍');
                            await msg.react('👎');
                            await msg.react('🤞');
                            await msg.react('✋');
                        })
                } else {
                    message.channel.send(errorMessage(0))
                }
            } else if (calculHeureFinA < calculHeureDebutB) {
                message.channel.send(errorMessage(1))
            } else if (calculHeureDebutB < calculHeureFinB) {
                message.channel.send(errorMessage(1))
            } else {
                message.channel.send(errorMessage(10))
            }
        } else if (['help', 'Help', '!help', '!Help'].includes(heureDebutA)) {
            console.log(message.author.tag + "used this command : !flex help")
            message.channel.send({embed: helpCommand(0)});
        } else {
            message.channel.send(errorMessage(2))
        }
    }
});
//list -- eno
client.on('message', async message => {
    let [cmd, channelID, messageID] = message.content.split(" "); // Splits the message content with space as a delimiter
    let prefix = "!";
    let command = cmd.replace(prefix, ""); // Gets the first element of msgArray and removes the prefix
    if(command === "list" || command === "List") {
        if(channelID && messageID){
            const channel = message.guild.channels.cache.get(channelID);
            const msg = await channel.messages.fetch(messageID);
            if (msg){
                const result = [];
                const reactions = msg.reactions.cache.array();
                for (const reaction of reactions) {
                    const users = (await reaction.users.fetch()).array().filter(user => user.bot === false)
                    const name = getEmojiText(reaction.emoji.name)
                    if (name && users.length > 0) {
                        result.push({
                            name,
                            value: users.map(u => u.toString()).join(' ')
                        });
                    }
                }
                console.log(result);
                message.channel.send({
                    embed: {
                        color: '#b4d455',
                        title: 'Réactions des utilisateurs',
                        fields: result,
                        timestamp: new Date(),
                    }
                })
            }
        } else if (['help', 'Help', '!help', '!Help'].includes(channelID)) {
            console.log(message.author.tag + " " + "used this command : !list help")
            message.channel.send({embed:helpCommand(1)});
        } else {
            message.channel.send(errorMessage(2));
        };
    };
});
//Planning
client.on('message', async message => {
    let [cmd, lundi, mardi, mercredi, jeudi, vendredi] = message.content.split(" "); // Splits the message content with space as a delimiter
    let prefix = "!";
    let command = cmd.replace(prefix, ""); // Gets the first element of msgArray and removes the prefix
    if (command === "planning" || command === "Planning")
        if (lundi && mardi && mercredi && jeudi && vendredi) {
            //array
            var arrayflexScrimNo = [lundi, mardi, mercredi, jeudi, vendredi];
            var dateArray = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
            var incremArray = 0;
            //lire toute les valeurs
            var d = new Date();
            let t = new Date();
            t.setDate(d.getDate() + 1);
            message.channel.send("@here\n\n");
            arrayflexScrimNo.forEach(async function(item) {
                if (item) {
                    if (item == 'flex' || item == 'Flex') {
                        item = ' : Entrainement flex';
                    } else if (item == 'scrim' || item == 'Scrim') {
                        item = ' : Scrim :)';
                    } else {
                        item = " : pas d'entrainement";
                    }
                }
                var todayDateResult = (dateArray[incremArray]+ " - " + t.toLocaleDateString() + item);
                t.setDate(t.getDate() + 1);
                incremArray++;
                message.channel.send(todayDateResult);
                })
            } else if (['help', 'Help', '!help', '!Help'].includes(lundi)) {
                console.log(message.author.tag + " " + "used this command : !planning help")
                message.channel.send({embed:helpCommand(2)});
            } else {
        message.channel.send(errorMessage(2));
    }
});
//Scrim
client.on('message', async message => {
    let [cmd, jour, mois, heure] = message.content.split(" "); // Splits the message content with space as a delimiter
    let prefix = "!";
    let command = cmd.replace(prefix, ""); // Gets the first element of msgArray and removes the prefix
    if (command === "scrim" || command === "Scrim") {
        if(jour && mois && heure){
            message.channel.send(`@here\nQui pour le scrim à ${heure} heure le ${jour}.${mois} ?\n\n👊 Pour oui\n\n👎 Pour non`).then(async msg => {
                await msg.react('👊')
                await msg.react('👎')
            })
        } else if (['help', 'Help', '!help', '!Help'].includes(jour)) {
            console.log(message.author.tag + " " + "used this command : !scrim help")
            message.channel.send({embed:helpCommand(3),});
        } else {
            message.channel.send(errorMessage(2));
        }
    }
});
//Clash
client.on('message', async message => {
    let [cmd, jour, mois, heure] = message.content.split(" "); // Splits the message content with space as a delimiter
    let prefix = "!";
    let command = cmd.replace(prefix, ""); // Gets the first element of msgArray and removes the prefix
    if (command === "clash" || command === "Clash") {
        if(jour && mois && heure){
            message.channel.send(`@here\nQui pour le clash à ${heure} heure le ${jour}.${mois} ?\n\n👊 Pour oui\n\n👎 Pour non`).then(async msg => {
                await msg.react('👊')
                await msg.react('👎')
            })
        } else if (['help', 'Help', '!help', '!Help'].includes(jour)) {
            console.log(message.author.tag + " " + "used this command : !clash help")
            message.channel.send({embed:helpCommand(4),});
        } else {
            message.channel.send(errorMessage(2));
        }
    }
});
//Player
client.on('message', async (message) => {
    let [cmd, playerName] = message.content.split(" "); // Splits the message content with space as a delimiter
    let prefix = "!";
    let command = cmd.replace(prefix, ""); // Gets the first element of msgArray and removes the prefix
    if(command === "player" || command === "Player") {
        if (['miniflint','Miniflint','miniflint242','Miniflint242'].includes(playerName)) {
            message.channel.send(leMeilleur("Miniflint242"));
        } else if (['baron','Baron','baron141','Baron141'].includes(playerName)) {
            message.channel.send(leMeilleur("Baron141"));
        } else if (['thebulkh','Thebulkh','TheBulkh','Bulkh','bulkh'].includes(playerName)) {
            message.channel.send(leMeilleur("TLV Thebulkh"));
        } else if (['tepo','Tepo','Tepozor','tepozor'].includes(playerName)) {
            message.channel.send(leMeilleur("TLV Tepozor"));
        } else if (['holzi','Holzi','Holzinafive','HolzinaFive','holzinafive'].includes(playerName)) {
            message.channel.send(leMeilleur("TLV  Holzinafive"));
        } else if (['mattack37', 'Mattack37', 'Matt', 'matt', 'mattack', 'Mattack'].includes(playerName)){
            message.channel.send(leMeilleur("Mattack37"));
        } else if (['help', 'Help', '!help', '!Help'].includes(playerName)) {
            console.log(message.author.tag + " " + "used this command : !scrim help")
            message.channel.send({embed:helpCommand(5),});
        } else {
            message.channel.send(errorMessage(2) + "\n" + errorMessage(3) + "\n")
        }
    }
});
//f
client.on('message', async message => {
    if (message.content === '!fdp' || message.content === '!Fdp') {
        let randomNess = fdp((Math.floor(Math.random() * 6) + 1))
        message.channel.send(randomNess)
    }
});
//Role clearing
client.on('message', async message => {
    let [cmd, roleClearing] = message.content.split (" ");
    let prefix = "!";
    let command = cmd.replace(prefix, "");
    if (["roleClear", "RoleClear", "Roleclear", "roleclear"].includes(command)) {
        if (roleClearing) {
            if (['flex', 'Flex','training', 'Training'].includes(roleClearing)) {
                const flexCeSoirRole = message.guild.roles.cache.find(r => r.name === "FlexCeSoir");
                const NnVientPasRole = message.guild.roles.cache.find(r => r.name === "NeVientPas");
                roleRemoving(flexCeSoirRole);
                roleRemoving(NnVientPasRole);
                message.channel.send(`${flexCeSoirRole} et ${NnVientPasRole} ont bien été retiré de tout les membres et sont prêt à une nouvelle utilisation`);
            } else if (['clash', 'Clash', 'Scrim', 'scrim'].includes(roleClearing)) {
                const clashScrimRole = message.guild.roles.cache.find(r => r.name === "Clash/Scrim");
                roleRemoving(clashScrimRole);
                message.channel.send(`${clashScrimRole} à bien été retiré de tout les membres et est prêt à une nouvelle utilisation`);
            } else if (['help', 'Help', '!help', '!Help'].includes(roleClearing)) {
                console.log(message.author.tag + " " + "used this command : !scrim help")
                message.channel.send({embed:helpCommand(6),});
            } else {
                message.channel.send(errorMessage(2));
            };
        } else {
            message.channel.send(errorMessage(2));
        };
    };
});
//réponse auto
client.on('message', async message => {
    if (['tg', 'TG', 'Tg', 'Ftg', 'FTG', 'ftg'].includes(message.content)) {
        message.channel.send("<@" + message.author.id + ">" + " " + "non toi" + " " + `${message.content}`)
    }
});
//op.gg
client.on('message', async message => {
    let [cmd, player1, player2, player3, player4, player5] = message.content.split(",");
    let prefix = "!";
    let command = cmd.replace(prefix, "");
    if (["OPGG", "OpGG", "opGG", "OPgg", "OPG", "Op.gg", "op.gg"].includes(command)) {
        if ([undefined].includes(player2 || player3 || player4 || player5))
        {
            player2 = ''
            player3 = ''
            player4 = ''
            player5 = ''
        }
        if (player1) {
            if ([' tlv',' TLV',' TLV Crew',' Tlv Crew',' TLV CREW',' Tlv',].includes(player1)) {
                message.channel.send('https://euw.op.gg/multi/query=TLV%20baron%2CTLV%20thebulkh%2CTLV%20miniflint%2CTLV%20tepozor%2C%20TLV%20Mawso');
            } else if ([' Help',' help',' !help',' !Help',' HELP',' !HELP',].includes(player1)) {
                message.channel.send({embed:helpCommand(7)});
            } else if (player1) {
                const playerTraitement = (`${player1},${player2},${player3},${player4},${player5}`)
                console.log(player1)
                message.channel.send(urlEncoder(playerTraitement))
            } else {
                message.channel.send(errorMessage(2))
            }
        }
    }
});
//-----------------------------------------------------------------fonctions---------------------------------------------------------
function leMeilleur(user){
        let randomNess = (Math.floor(Math.random() * 11) + 1)
            if (randomNess){
                if(randomNess == 1){
                    if(user =="Miniflint242") {
                    return `Meilleur Mid/Codeur EVER : *${user}*`
                } else if(user =="TLV Baron") {
                    return `Meilleur Adc EVER : *${user}*`
                } else if(user =="TLV Thebulkh") {
                    return `Meilleur Supp/Coach EVER : *${user}*`
                } else if(user =="TLV Tepozor") {
                    return `Meilleur Supp/Coach EVER : *${user}*`
                } else if(user =="TLV  Holzinafive") {
                    return `Meilleur Jngl EVER : *${user}*`
                } else if(user =="Mattack37") {
                    return `Meilleur Mid *(aprés miniflint évidement, c'est pas moi qui le dit c'est le bot discord)* EVER : *${user}*`
                } else if(user == "DoFlaMinGo") {
                    return `Meilleur joueur Among Us ever : ${user}`
                }
            } else if (randomNess == 2) {
                return (`T'es beaucoup trop fort : *${user}*`);
            } else if (randomNess == 3) {
                return (`Impressionant ce joueur ptn : *${user}*`);
            } else if (randomNess == 4) {
                return (`woaaaaaaa :heart: : *${user}*`);
            } else if (randomNess == 5) {
                return (":heart: :heart: :heart: :heart: : "+ `*${user}*`);
            } else if (randomNess == 6) {
                return (`Tqt c'est easy LoL : *${user}*`);
            } else if (randomNess == 7) {
                return (`ça arrive de lose bg : *${user}*`);
            } else if (randomNess == 8) {
                return (`J'ai plus d'idées sur quoi mettre dans le code la ...`);
            } else if (randomNess == 9) {
                return (`L'algorythme random est de : ${randomNess} - *${user}*`);
            } else if (randomNess == 10) {
                return (`${user} : JOUE TON MAIN PROCHAINE GAME ET TROLL PAS`);
            } else if (randomNess == 11) {
                return (`OUI`)
            }   
    };
};
function fdp(RandomFDP) {
    if(RandomFDP == "1") {
        return "Holzi le fdp"
    } else if(RandomFDP == "2") {
        return "Baron le fdp"
    } else if(RandomFDP == "3") {
        return "Bulkh le fdp"
    } else if(RandomFDP == "4") {
        return "Pas miniflint le fdp"
    } else if(RandomFDP == "5") {
        return "Mattack le fdp"
    } else if(RandomFDP == "6") {
        return "Tepo le fdp"
    }
};
function getEmojiText(emoji) {
    switch (emoji) {
        case '👍' :
            return `${heureDebutA} - ${heureFinB} :`;
        case '👎' :
            return "Ne vient pas :";
        case '🤞' :
            return `${heureDebutA} - ${heureFinA}`;
        case '✋' :
            return `${heureDebutB} - ${heureFinB}`;
        case '👊' :
            return "Dispo pour le Scrim/Clash";
        case '🗑️' :
            return "Poubelle";
        default :
            return "Autre";
    }
};
function roleRemoving(roleName) {
    const message = new Discord.Message
    if(roleName) {
        roleName.members.forEach((member, i) => { 
            setTimeout(() => {
                member.roles.remove(roleName); 
            }, i * 1000);
        });
    } else {
        message.channel.send(errorMessage(2))
    }
};
function errorMessage(errorNumber) {
    if (errorNumber == 0){
        return "Il te faut le rôle *TLV CREW* pour faire cette commande"
    } else if (errorNumber == 1) {
        return "Une erreur au niveau des nombres à été faite. Je n'ai pas pu les afficher pour cause de mon algorythme incroyablement performant"
    } else if (errorNumber == 2) {
        return "Entre des arguments valide :\n*!help pour plus d'informations sur la commande recherchée*"
    } else if (errorNumber == 3) {
        return "Les joueurs valides sont ceux qui ont le rôle *TLV CREW*"
    } else if (errorNumber == 4) {
        return "Trop de joueur, maximum 5"
    }else if (errorNumber == 10) {
        return "Erreur inconnue"
    }
};
function helpCommand(helpnumber){
    const exampleEmbed = new Discord.MessageEmbed()
    if (helpnumber == 0) { //FLEX
        const exampleEmbed = {
            color: '#b366ff',
            title: "__**Message d'aide pour : [F]flex**__",
            description: '**Syntaxe :**\n![F]flex / ![T]training + *heure Debut Avant manger*, *heure Fin Avant manger*, *heure Debut Après manger*, *heure Fin Après manger*\n**Exemple** :\n!Flex 12:00 14:00 14:30 22:00',
        };
        return exampleEmbed;
    } else if (helpnumber == 1) { //LIST
        const exampleEmbed = {
            color: '#b366ff',
            title: "__**Message d'aide pour : [L]list**__",
            description: '**Syntaxe :**\n![L]list + *Id du channel*, *Id du message*\n**Exemple** :\n!List 823524235409883137 829016227807494176',
        };
        return exampleEmbed;
    } else if (helpnumber == 2) { //PLANNING
        const exampleEmbed = {
            color: '#b366ff',
            title: "__**Message d'aide pour : [P]planning**__",
            description: '**Syntaxe :**\n![P]planning + *premier jour*, deuxième jour*, *troisième jour*, *quatrième jour*, *cinquième jour*\n**Exemple** :\n!Planning flex flex flex scrim no',
        };
        return exampleEmbed;
    } else if (helpnumber == 3) { //SCRIM
        const exampleEmbed = {
            color: '#b366ff',
            title: "__**Message d'aide pour : [S]scrim**__",
            description: '**Syntaxe :**\n![S]scrim + *Jour du scrim*, *Mois du scrim*, *Heure du scrim*\n**Exemple** :\n!Scrim 24 12 21:15',
        };
        return exampleEmbed;
    } else if (helpnumber == 4) { // CLASH
        const exampleEmbed = {
            color: '#b366ff',
            title: "__**Message d'aide pour : [C]clash**__",
            description: '**Syntaxe :**\n![C]clash + *Jour du clash*, *Mois du clash*, *Heure du clash*\n**Exemple** :\n!Clash 24 12 21:15',
        };
        return exampleEmbed;
    } else if (helpnumber == 5) { //PLAYER
        const exampleEmbed = {
            color: '#b366ff',
            title: "__**Message d'aide pour : [P]player**__",
            description: '**Syntaxe :**\n![P]player + *Nom du joueur*\n**Exemple** : !Player miniflint',
        };
        return exampleEmbed;
    } else if (helpnumber == 6) { //ROLECLEAR
        const exampleEmbed = {
            color: '#b366ff',
            title: "__**Message d'aide pour :[R]roleclear**__",
            description: '**Syntaxe :**\n![R]roleclear + *Role à clear* *(clash, scrim ou flex)*\n**Exemple** :\n!RoleClear scrim',
        };
        return exampleEmbed
    } else if (helpnumber == 7) { //OP.GG
        const exampleEmbed = {
            color: '#b366ff',
            title: "__**Message d'aide pour : [O]p.gg,**__",
            description: '**Syntaxe :**\n![O]p.gg* **,**:* + *Joueur 1* **,** *Joueur 2* **,** *Joueur 3* **,** *Joueur 4* **,** *Joueur 5* (Noms in game)\n**Exemple** :\n!Op.gg, TLV Miniflint, TLV Baron, etc, etc',
            footer: {
                text: 'Remarque : la virgule est importante après le "!op.gg, et après tout les noms de joueurs :)',
                icon_url: 'https://cdn.discordapp.com/icons/779000154703134740/b040d2f984feab957c52b5f710701171.webp',
            },
        };
        return exampleEmbed;
    } 
    else if (helpnumber == 'maj') { //Mise à jour
        const exampleEmbed = {
            color: '#b366ff',
            title: "__**Mise à jour**__",
            description: '**Ajouts et changements**',
            //CHANGEMENTS TEXTE
            fields: [
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: 'Ajout de !op.gg (!op.gg help)',
                    value: '__Ajout de la commande !op.gg__',
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: "Les message d'aide",
                    value: "__Changement de texte + ajout d'embed pour les message d'aide__",
                    inline: true,
                },
            ],
            footer: {
                text: "Merci d'avoir utilisé cette commande :)",
                icon_url: 'https://cdn.discordapp.com/icons/779000154703134740/b040d2f984feab957c52b5f710701171.webp',
            },
        };
        return exampleEmbed;
    };
};
function urlEncoder(spaceRemover) {
    var urlReturnWithoutHttps = ("https://euw.op.gg/multi/query="+encodeURIComponent(spaceRemover));
    return urlReturnWithoutHttps
};
//----------------------------------------------------------Bot Reactions + DM messages ----------------------------------------------------------------
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    else {
        const flexCeSoirRole = reaction.message.guild.roles.cache.find(r => r.name === "FlexCeSoir");
        const clashScrimRole = reaction.message.guild.roles.cache.find(r => r.name === "Clash/Scrim");
        const NeVientPasRole = reaction.message.guild.roles.cache.find(r => r.name === "NeVientPas");
        var d = new Date();
        let t = new Date();
        t.setDate(d.getDate() + 1);
        if (reaction.message.author.bot) { //.id .id
            if (reaction.emoji.name === '🗑️') {
                setTimeout(function(){ 
                    reaction.message.delete();
                 }, 1000);
            }
        }
        if (reaction.message.author.bot) {
            switch(reaction.emoji.name) {
                case '👍' :
                    user.send(`Noté : tu devras venir toute la soirée du : ${d.toLocaleDateString()} de ${calculHeureDebutA}h à ${calculHeureFinB}h`);
                    await reaction.message.guild.members.cache.get(user.id).roles.add(flexCeSoirRole);
                    break;
                case '👎' :
                    user.send('Tant pis, tu viendra pas');
                    await reaction.message.guild.members.cache.get(user.id).roles.add(NeVientPasRole);
                    break;
                case '🤞' :
                    user.send(`Noté : tu devras venir toute la soirée du : ${d.toLocaleDateString()} de ${calculHeureDebutA}h à ${calculHeureFinA}h`);
                    await reaction.message.guild.members.cache.get(user.id).roles.add(flexCeSoirRole);
                    break;
                case '✋' :
                    user.send(`Noté : tu devras venir toute la soirée du : ${d.toLocaleDateString()} de ${calculHeureDebutB}h à ${calculHeureFinB}h`);
                    await reaction.message.guild.members.cache.get(user.id).roles.add(flexCeSoirRole);
                    break;
                case '👊' :
                    user.send('Soit prêt pour le scrim/clash');
                    await reaction.message.guild.members.cache.get(user.id).roles.add(clashScrimRole);
                    break;
            }
        }
    }
});
client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return;
    else {
        const flexCeSoirRole = reaction.message.guild.roles.cache.find(r => r.name === "FlexCeSoir");
        const clashScrimRole = reaction.message.guild.roles.cache.find(r => r.name === "Clash/Scrim");
        const NeVientPasRole = reaction.message.guild.roles.cache.find(r => r.name === "NeVientPas");
        if (reaction.message.author.bot) {
            if (['👍', '✋', '🤞'].includes(reaction.emoji.name)) {
                await reaction.message.guild.members.cache.get(user.id).roles.remove(flexCeSoirRole)
            } else if (['👊'].includes(reaction.emoji.name)) {
                await reaction.message.guild.members.cache.get(user.id).roles.remove(clashScrimRole)
            } else if (['👎']){
                await reaction.message.guild.members.cache.get(user.id).roles.remove(NeVientPasRole)
            }
        }
    }
});
// login to Discord with your app's token
client.login('YOU AINT GONNA SEE MY TOKEN');
