// require the discord.js module  
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client({ ws: { intents: ['GUILDS','GUILD_MESSAGES','GUILD_MEMBERS','GUILD_EMOJIS','GUILD_WEBHOOKS','GUILD_MESSAGE_REACTIONS'] } });

client.once('ready', () => {
	console.log('Ready to start testing');
});

client.on('message', message => {
    if (message.content === '!help') {
        console.log(message.author.tag + " used this command : !help")
        message.channel.send("!Training : affiche le planning de ce soir\n\n!clash : Affiche les réactions pour le clash\n\n!help / !Help : affiche l'aide").then(msg => {
            msg.react('🗑️')
        })
    }
});

client.on('message', message => {
    if (message.content === '!Help') {
        console.log(message.author.tag + " used this command : !Help")
        message.channel.send("!Training : affiche le planning de ce soir\n\n!help / !Help : affiche l'aide").then(msg => {
            msg.react('🗑️')
        })
    }
});

client.on('message', message => {
    if (message.content === '!clash') {
        console.log(message.author.tag + " used this command : !clash")
        message.channel.send('Qui pour le clash ce soir ? \n\n:ghost: Oui\n\n:clown: Non').then(async msg => {
            await msg.react('👻')
            await msg.react('🤡')
            await msg.react('🗑️')
        })
    }
});

client.on('message', message => {
    if (message.content === '!training') {
        console.log(message.author.tag + " used this command : !training")
        message.channel.send('Entrainement ce soir 19h00 - 20h30 / 21h15 - 23h : flex. Qui est là ?\n\n:thumbsup:  Si oui ( de  19h00 à 23h )\n\n:thumbsdown:  Si non\n\n:fingers_crossed:  Si là mais de 19h à 20h30\n\n:raised_hand: Si là mais de 21h15 à 23h ').then(async msg => {
            await msg.react('👍')
            await msg.react('👎')
            await msg.react('🤞')
            await msg.react('✋')
            await msg.react('🗑️')
        })
    }
});

client.on('message', async message => {
    if (message.content === '!clear') {
        console.log(message.author.tag + " used this command : !clear")
        message.channel.bulkDelete(99)
    }
})
//eno
client.on('message', async message => {
    let [cmd, channelID, messageID] = message.content.split(" "); // Splits the message content with space as a delimiter
    let prefix = "!";
    let command = cmd.replace(prefix, ""); // Gets the first element of msgArray and removes the prefix
    if(command === "list") {
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
        }
        else {
            const msg = await message.channel.send("Entre des arguments valide :\n*Syntaxe : !list ChannelID(1-999999999999999999) MessageID(1-999999999999999999)*");
            await msg.react('🗑️');
        };
    };
});

client.on('message', async message => {
    let [cmd, lundi, mardi, mercredi, jeudi, vendredi] = message.content.split(" "); // Splits the message content with space as a delimiter
    let prefix = "!";
    let command = cmd.replace(prefix, ""); // Gets the first element of msgArray and removes the prefix
    if (command === "planning")
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
                message.channel.send(todayDateResult)
                })
            }
    else {
        const msg = await message.channel.send("Entre des arguments valide :\n*Syntaxe : !planning flex flex flex scrim no*");
        await msg.react('🗑️');
    }
});

client.on('message', async message => {
    let [cmd, jour, mois, heure] = message.content.split(" "); // Splits the message content with space as a delimiter
    let prefix = "!";
    let command = cmd.replace(prefix, ""); // Gets the first element of msgArray and removes the prefix
    if (command === "scrim" || command === "Scrim") {
        if(jour && mois && heure){
            message.channel.send(`@here\nQui pour le scrim à ${heure} heure le ${jour}.${mois} ?\n\n👊 Pour oui\n\n👁️ Pour non`).then(async msg => {
                await msg.react('👊')
                await msg.react('👁️')
            })
        }
        else {
            message.channel.send("Entre des arguments valide :\n*Syntaxe : !scrim jour(1-31) mois(1-12) heure(00:00 24:00)*")
        }
    }
});

client.on('message', async (message, user) => {
    let [cmd, playerName] = message.content.split(" "); // Splits the message content with space as a delimiter
    let prefix = "!";
    let command = cmd.replace(prefix, ""); // Gets the first element of msgArray and removes the prefix
    if(command === "player") {
        if (playerName == 'miniflint' || playerName == 'Miniflint' || playerName == 'miniflint242' || playerName == 'Miniflint242') {
            message.channel.send(tesLeMeilleur("Miniflint242"));
        } else if (playerName == 'baron' || playerName == 'Baron' || playerName == 'baron141' || playerName == 'Baron141') {
            message.channel.send(tesLeMeilleur("Baron141"));
        } else if (playerName == 'thebulkh' || playerName == 'Thebulkh' || playerName == 'TheBulkh' || playerName == 'Bulkh' || playerName == 'bulkh') {
            message.channel.send(tesLeMeilleur("TLV Thebulkh"));
        } else if (playerName == 'tepo' || playerName == 'Tepo' || playerName == 'Tepozor' || playerName == 'tepozor') {
            message.channel.send(tesLeMeilleur("TLV Tepozor"));
        } else if (playerName == 'holzi' || playerName == 'Holzi' || playerName == 'Holzinafive' || playerName == 'HolzinaFive' || playerName == 'holzinafive') {
            message.channel.send(tesLeMeilleur("TLV  Holzinafive"));
        } else if (playerName == 'mattack37' || playerName == 'Mattack37' || playerName == 'Matt' || playerName == 'matt' || playerName == 'mattack' || playerName == 'Mattack'){
            message.channel.send(tesLeMeilleur("Mattack37"));
        } else {
            message.channel.send("Entre des arguments ou un joueur valide :\n*Syntaxe : !player player(TLV CREW)*");
        }
    }
});
function tesLeMeilleur(user){
        let randomNess = (Math.floor(Math.random() * 2) + 1)
            console.log(randomNess)
            if (randomNess){
                if(randomNess == 1){
                    if(user =="Miniflint242") {
                    return `Meilleur Mid/Codeur EVER : *${user}*`
                } else if(user =="Baron141"){
                return `Meilleur Adc EVER : *${user}*`
                } else if(user =="TLV Thebulkh"){
                    return `Meilleur Supp/Coach EVER : *${user}*`
                } else if(user =="TLV Tepozor"){
                    return `Meilleur Supp/Coach EVER : *${user}*`
                } else if(user =="TLV  Holzinafive"){
                    return `Meilleur Jngl EVER : *${user}*`
                } else if(user =="Mattack37"){
                    return `Meilleur Mid *(aprés miniflint évidement, c'est pas moi qui le dit c'est le bot discord)* EVER : *${user}*`
                }
            } else if (randomNess == 2){
               return (`T'es beaucoup trop fort : *${user}*`);
            } else if (randomNess == 3){
               return (`Impressionant ce joueur ptn : *${user}*`);
            } else if (randomNess == 4){
               return (`woaaaaaaa :heart: : *${user}*`);
            } else if (randomNess == 5){
               return (":heart: :heart: :heart: :heart: : "+ `*${user}*`);
            } else if (randomNess == 6){
                return (`Tqt c'est easy LoL : *${user}*`);
            } else if (randomNess == 7){
               return (`ça arrive de lose bg : *${user}*`);
            } else if (randomNess == 8){
               return (`J'ai plus d'idées sur quoi mettre dans le code la ...`);
            } else if (randomNess == 9){
               return (`L'algorythme random est de : ${randomNess} - *${user}*`);
            } else if (randomNess == 10){
               return (`${user} : JOUE TON MAIN PROCHAINE GAME ET TROLL PAS`);
            }        
    };
};
function getEmojiText(emoji) {
    switch (emoji) {
        case '👍' :
            return "19h00 - 23h00 :";
        case '👎' :
            return "Ne vient pas :";
        case '🤞' :
            return "19h00 - 20h30";
        case '✋' :
            return "21h30 - 23h00";
        case '👻' :
            return "Pour clash";
        case '🤡' :
            return "Ne vient pas pour le clash";
        case '🗑️' :
            return "Poubelle";
        case '👊' :
            return "Dispo pour le scrim";
        case '👁️' :
            return "indispo pour le scrim";
        default :
            return "Autre";
    }
;}

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    else {
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
        switch(reaction.emoji.name) {
            case '👍' :
                user.send(`Noté : tu devras venir toute la soirée du : ${d.toLocaleDateString()} de 19h00 à 23h00`);
                break;
            case '👎' :
                user.send('Tant pis, tu viendra pas');
                break;
            case '🤞' :
                user.send(`Noté : tu devras venir toute la soirée du : ${d.toLocaleDateString()} de 19h à 20h30`);
                break;
            case '✋' :
                user.send(`Noté : tu devras venir toute la soirée du : ${d.toLocaleDateString()} de 21h15 à 23h`);
                break;
            case '👻' :
                user.send("Soit prêt pour le clash :heart:\ndemande à Bulkh (@TheBulkh#9140) ou Holzi (Holzinafive#2168) pour l'horaire");
                break;
            case '🤡' :
                user.send('Tu pu').then(msg => {
                    msg.react('🤢');
                })
                break;
            case '🤢' :
                user.send('berk');
                break;
            case '👊' :
                user.send('Soit prêt pour le scrim');
                break;
            case '👁️' :
                user.send('tant pis, prochain :)');
                break;
        }
    }
});
// login to Discord with your app's token
client.login('YOUR TOKEN HERE');
