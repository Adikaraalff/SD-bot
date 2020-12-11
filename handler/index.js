const { decryptMedia, Client } = require('@open-wa/wa-automate')
const moment = require('moment-timezone')
const _ = require('lodash')
const axios = require('axios')

const {
    Wiki,
    About,
    Menu,
    Donasi,
    Nulis,
    Lirik,
    Cuaca,
    Quotes,
    QrMaker,
    Brainly,
    Jsholat,
    Translate,
    Primbon
} = require('./../lib')

const {
    insert,
    countHit,
    countUsers,
    statCommand
} = require('./../database')

moment.tz.setDefault('Asia/Jakarta').locale('id')

const processTime = (timestamp, now) => {
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

const MessageHandler = async (client = new Client(), message) => {
    console.log(message)
    try {
        const { type, id, content, from, t, author, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName
        const botNumber = await client.getHostNumber() + '@c.us'

        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const groupMembers = isGroupMsg ? await client.getGroupMembersId(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const ownerNumber = ["628xxxxxxxxxx@c.us"] // replace with your whatsapp number
        const isOwnerBot = ownerNumber.includes(sender.id)

        const prefix = '!' || '#' || ''
        const krisar = '6282180788179@c.us'  // pliese don't delete this variable.

        const date = (time) => moment(time * 1000).format('DD/MM/YY HH:mm:ss')

        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption) && caption.startsWith(prefix)) ? caption : ''
        
        const argv = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)

        const uaOverride =  "WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
        
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'

        var tanggal  = moment.tz('Asia/Jakarta').format('YYYY-MM-DD')

        insert(author, type, content, pushname, from, 'unknown')

        switch (argv) {
            case 'ping':
                await client.sendText(from, `Pong!. timing: ${processTime(t, moment())} second`)
                insert(author, type, content, pushname, from, argv)
                break
            case 'menu':
                await Menu(prefix, pushname).then(data => {
                    client.sendText(from, data)
                })
                insert(author, type, content, pushname, from, argv)
                break
            case 'about':
                await About(name).then(data => {
                    client.sendText(from, data)
                })
                insert(author, type, content, pushname, from, argv)
                break
            case 'donasi':
                await Donasi(pushname).then(data => {
                    client.sendText(from, data)
                })
                insert(author, type, content, pushname, from, argv)
                break
            case 'krisar':
                await client.sendText(krisar, `[krisar] dari ${pushname} (${from})\n\n${args.join(' ')}`)
                insert(author, type, content, pushname, from, argv)
                break
            case 'add':
                if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
                if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
                if (args.length !== 1) return client.reply(from, `Untuk menggunakan ${prefix}add\nPenggunaan: ${prefix}add <nomor>\ncontoh: ${prefix}add 628xxx`, id)
                    try {
                        await client.addParticipant(from,`${args[0]}@c.us`)
                } catch {
                        client.reply(from, 'Tidak dapat menambahkan target', id)
                }
                break
            case 'kick':
                if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup', id)
                if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
                if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan Perintah ini, kirim perintah *!kick* @tagmember', id)
                await client.sendText(from, `Perintah diterima, mengeluarkan:\n${mentionedJidList.join('\n')}`)
                for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Ki, id)
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
                break
            case 'promote':
                if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
                if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
                if (mentionedJidList.length !== 1) return client.reply(from, 'Maaf, hanya bisa mempromote 1 user', id)
                if (groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
                if (mentionedJidList[0] === botNumber) return await client.reply(from, 'Maaf, format pesan salah.\nTidak dapat mempromote akun bot sendiri', id)
                await client.promoteParticipant(groupId, mentionedJidList[0])
                await client.sendTextWithMentions(from, `Request diterima, menambahkan @${mentionedJidList[0].replace('@c.us', '')} sebagai admin.`)
                break
            case 'demote':
                if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
                if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
                if (mentionedJidList.length !== 1) return client.reply(from, 'Maaf, hanya bisa mendemote 1 user', id)
                if (!groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'Maaf, user tersebut belum menjadi admin.', id)
                if (mentionedJidList[0] === botNumber) return await client.reply(from, 'Maaf, format pesan salah.\nTidak dapat mendemote akun bot sendiri', id)
                await client.demoteParticipant(groupId, mentionedJidList[0])
                await client.sendTextWithMentions(from, `Request diterima, menghapus jabatan @${mentionedJidList[0].replace('@c.us', '')}.`)
                break
            case 'glink':
                if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `\nLink group *${name}*`)
                } else {
                client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                }
                break
            case 'tagall':
                if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
                if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
                const groupMem = await client.getGroupMembers(groupId)
                let hehex = '╔══✪〘 Mention All 〙✪══\n'
                for (let i = 0; i < groupMem.length; i++) {
                hehex += '╠➥'
                hehex += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
                }
                hehex += '╚═〘 *S D  B O T* 〙'
                await client.sendTextWithMentions(from, hehex)
                break
            case 'kickall': //mengeluarkan semua member
                if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
                let isOwner = chat.groupMetadata.owner == pengirim
                if (!isOwner) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai oleh owner grup!', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
                    const allMem = await client.getGroupMembers(groupId)
                    for (let i = 0; i < allMem.length; i++) {
                        if (groupAdmins.includes(allMem[i].id)) {
        
                        } else {
                            await client.removeParticipant(groupId, allMem[i].id)
                        }
                    }
                    client.reply(from, 'Success kick all member', id)
                break
            case 'admin':
                if (isGroupMsg && isGroupAdmins) {
                    let msg = `List admin of group: *${formattedTitle}*\n\n`
                    let index = 1
                    for (admin of groupAdmins) {
                        msg += `*${index++}*. @${admin.replace(/@c.us/g, '')}\n`
                    }
                    await client.sendTextWithMentions(from, msg)
                }
                insert(author, type, content, pushname, from, argv)
                break
            case 'kickme':
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                await client.sendText(from,'Sayonara, Invite kembali SD-bot jika dirasa dibutuhkan yah~').then(() => client.leaveGroup(groupId))
                break 
            case 'del':
                if (isGroupMsg && isGroupAdmins) {
                    if (quotedMsgObj.fromMe) {
                        client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id)
                    }
                }
                insert(author, type, content, pushname, from, argv)
                break
            case 'resend':
                    // TODO: Repost Media
                    if (quotedMsgObj) {
                        let encryptMedia
                        let replyOnReply = await client.getMessageById(quotedMsgObj.id)
                        let obj = replyOnReply.quotedMsgObj
                        if (/ptt|audio|video|image|document|sticker/.test(quotedMsgObj.type)) {
                            encryptMedia = quotedMsgObj
                            if (encryptMedia.animated) encryptMedia.mimetype = ''
                        } else if (obj && /ptt|audio|video|image/.test(obj.type)) {
                            encryptMedia = obj
                        } else return
                        const _mimetype = encryptMedia.mimetype
                        const mediaData = await decryptMedia(encryptMedia)
                        await client.sendFile(from, `data:${_mimetype};base64,${mediaData.toString('base64')}`, 'file', ':)', encryptMedia.id)
                    } else client.reply(from, config.msg.noMedia, id)
                    break
                case 'mute':
                    if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
                    if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
                    if (!isBotGroupAdmins) return client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
                    if (args.length !== 1) return client.reply(from, `Untuk mengubah settingan group chat agar hanya admin saja yang bisa chat\n\nPenggunaan:\n${prefix}mutegrup on --aktifkan\n${prefix}mutegrup off --nonaktifkan`, id)
                    if (args[0] == 'on') {
                        client.setGroupToAdminsOnly(groupId, true).then(() => client.sendText(from, 'Berhasil mengubah agar hanya admin yang dapat chat!'))
                    } else if (args[0] == 'off') {
                        client.setGroupToAdminsOnly(groupId, false).then(() => client.sendText(from, 'Berhasil mengubah agar semua anggota dapat chat!'))
                    } else {
                        client.reply(from, `Untuk mengubah settingan group chat agar hanya admin saja yang bisa chat\n\nPenggunaan:\n${prefix}mutegrup on --aktifkan\n${prefix}mutegrup off --nonaktifkan`, id)
                    }
                    break
                case 'setprofile':
                    if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
                    if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
                    if (!isBotGroupAdmins) return client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
                    if (isMedia && type == 'image' || isQuotedImage) {
                        const dataMedia = isQuotedImage ? quotedMsg : message
                        const _mimetype = dataMedia.mimetype
                        const mediaData = await decryptMedia(dataMedia, uaOverride)
                        const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                        await client.setGroupIcon(groupId, imageBase64)
                    } else if (args.length === 1) {
                        if (!isUrl(url)) { await client.reply(from, 'Maaf, link yang kamu kirim tidak valid.', id) }
                        client.setGroupIconByUrl(groupId, url).then((r) => (!r && r !== undefined)
                        ? client.reply(from, 'Maaf, link yang kamu kirim tidak memuat gambar.', id)
                        : client.reply(from, 'Berhasil mengubah profile group', id))
                    } else {
                        client.reply(from, `Commands ini digunakan untuk mengganti icon/profile group chat\n\n\nPenggunaan:\n1. Silahkan kirim/reply sebuah gambar dengan caption ${prefix}setprofile\n\n2. Silahkan ketik ${prefix}setprofile linkImage`)
                    }
                    break        
                case 'bc': //untuk broadcast atau promosi
                if (!isOwnerBot) return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
                if (args.length == 0) return client.reply(from, `Untuk broadcast ke semua chat ketik:\n${prefix}bc [isi chat]`)
                let msg = body.slice(4)
                const chatz = await client.getAllChatIds()
                for (let idk of chatz) {
                    var cvk = await client.getChatById(idk)
                    if (!cvk.isReadOnly) client.sendText(idk, `[📡]--- SD BROADCAST ---[📡]\n\n${msg}`)
                    if (cvk.isReadOnly) client.sendText(idk, `[📡]--- SD BROADCAST ---[📡]\n\n${msg}`)
                }
                client.reply(from, 'Broadcast Success!', id)
                break
            //Education
            case 'wiki':
                var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
                Wiki(nonOption)
                    .then(data => {
                        let msg = `Query: *${nonOption}*\n\n${data}`
                        client.reply(from, msg, id)
                    })
                    .catch(err => {
                        client.reply(from, err, id)
                        console.log(err)
                    })
                insert(author, type, content, pushname, from, argv)
                break
            case 'brainly':
                var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
                var pesan = `Halo ${pushname} 👋. Berikut hasil pencarian dari: *${nonOption}* \n\n`
                Brainly(nonOption)
                .then(data => {
                let i = 1
                data.map(({ title, url }) => {
                pesan += `${i++}. ${title}\nKlik Disini: ${url}\n\n`
                })
                client.reply(from, pesan, id)
                })
                .catch(err => {
                client.reply(from, err, id)
                console.log(err)
                })
                insert(author, type, content, pushname, from, argv)
                break
            case 'quotes':
                Quotes().then(quotes => {
                    client.sendTextWithMentions(from, `Quotes request by @${author.replace(/@c.us/g, '')},\n\nQuotes :\n\n " *${quotes}* " `)
                })
                insert(author, type, content, pushname, from, argv)
                break
            case 'translate':
                var withOption = quotedMsg ? quotedMsgObj.body : args.splice(1).join(' ')
                Translate(withOption, args[0])
                    .then(data => {
                        client.reply(from, data, id)
                    })
                insert(author, type, content, pushname, from, argv)
                break
                //Islam Command
            case 'listsurah':
                try {
                axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
                .then((response) => {
                    let hehex = '╔══✪〘 List Surah 〙✪══\n'
                    for (let i = 0; i < response.data.data.length; i++) {
                        hehex += '╠➥ '
                        hehex += response.data.data[i].name.transliteration.id.toLowerCase() + '\n'
                            }
                        hehex += '╚═〘 * S D  B O T* 〙'
                    ClientRect.reply(from, hehex, id)
                })
                } catch(err) {
                client.reply(from, err, id)
                }
                break
            case 'infosurah':
                if (args.length == 0) return client.reply(from, `*_${prefix}infosurah <nama surah>_*\nMenampilkan informasi lengkap mengenai surah tertentu. Contoh penggunan: ${prefix}infosurah al-baqarah`, message.id)
                var responseh = await axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
                var { data } = responseh.data
                var idx = data.findIndex(function(post, index) {
                  if((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
                    return true;
                });
                var pesan = ""
                pesan = pesan + "Nama : "+ data[idx].name.transliteration.id + "\n" + "Asma : " +data[idx].name.short+"\n"+"Arti : "+data[idx].name.translation.id+"\n"+"Jumlah ayat : "+data[idx].numberOfVerses+"\n"+"Nomor surah : "+data[idx].number+"\n"+"Jenis : "+data[idx].revelation.id+"\n"+"Keterangan : "+data[idx].tafsir.id
                client.reply(from, pesan, message.id)
              break
            case 'surah':
                if (args.length == 0) return client.reply(from, `*_${prefix}surah <nama surah> <ayat>_*\nMenampilkan ayat Al-Quran tertentu beserta terjemahannya dalam bahasa Indonesia. Contoh penggunaan : ${prefix}surah al-baqarah 1\n\n*_${prefix}surah <nama surah> <ayat> en/id_*\nMenampilkan ayat Al-Quran tertentu beserta terjemahannya dalam bahasa Inggris / Indonesia. Contoh penggunaan : ${prefix}surah al-baqarah 1 id`, message.id)
                var responseh = await axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
                var { data } = responseh.data
                var idx = data.findIndex(function(post, index) {
                  if((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
                    return true;
                });
                nmr = data[idx].number
                if(!isNaN(nmr)) {
                  var responseh2 = await axios.get('https://api.quran.sutanlab.id/surah/'+nmr+"/"+args[1])
                  var {data} = responseh2.data
                  var last = function last(array, n) {
                    if (array == null) return void 0;
                    if (n == null) return array[array.length - 1];
                    return array.slice(Math.max(array.length - n, 0));
                  };
                  bhs = last(args)
                  pesan = ""
                  pesan = pesan + data.text.arab + "\n\n"
                  if(bhs == "en") {
                    pesan = pesan + data.translation.en
                  } else {
                    pesan = pesan + data.translation.id
                  }
                  pesan = pesan + "\n\n(Q.S. "+data.surah.name.transliteration.id+":"+args[1]+")"
                  client.reply(from, pesan, message.id)
                }
                break
            case 'tafsir':
                if (args.length == 0) return client.reply(from, `*_${prefix}tafsir <nama surah> <ayat>_*\nMenampilkan ayat Al-Quran tertentu beserta terjemahan dan tafsirnya dalam bahasa Indonesia. Contoh penggunaan : ${prefix}tafsir al-baqarah 1`, message.id)
                var responsh = await axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
                var {data} = responsh.data
                var idx = data.findIndex(function(post, index) {
                  if((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
                    return true;
                });
                nmr = data[idx].number
                if(!isNaN(nmr)) {
                  var responsih = await axios.get('https://api.quran.sutanlab.id/surah/'+nmr+"/"+args[1])
                  var {data} = responsih.data
                  pesan = ""
                  pesan = pesan + "Tafsir Q.S. "+data.surah.name.transliteration.id+":"+args[1]+"\n\n"
                  pesan = pesan + data.text.arab + "\n\n"
                  pesan = pesan + "_" + data.translation.id + "_" + "\n\n" +data.tafsir.id.long
                  client.reply(from, pesan, message.id)
              }
                break
            case 'alaudio':
                if (args.length == 0) return client.reply(from, `*_${prefix}ALaudio <nama surah>_*\nMenampilkan tautan dari audio surah tertentu. Contoh penggunaan : ${prefix}ALaudio al-fatihah\n\n*_${prefix}ALaudio <nama surah> <ayat>_*\nMengirim audio surah dan ayat tertentu beserta terjemahannya dalam bahasa Indonesia. Contoh penggunaan : ${prefix}ALaudio al-fatihah 1\n\n*_${prefix}ALaudio <nama surah> <ayat> en_*\nMengirim audio surah dan ayat tertentu beserta terjemahannya dalam bahasa Inggris. Contoh penggunaan : ${prefix}ALaudio al-fatihah 1 en`, message.id)
                ayat = "ayat"
                bhs = ""
                var responseh = await axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
                var surah = responseh.data
                var idx = surah.data.findIndex(function(post, index) {
                  if((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
                    return true;
                });
                nmr = surah.data[idx].number
                if(!isNaN(nmr)) {
                  if(args.length > 2) {
                    ayat = args[1]
                  }
                  if (args.length == 2) {
                    var last = function last(array, n) {
                      if (array == null) return void 0;
                      if (n == null) return array[array.length - 1];
                      return array.slice(Math.max(array.length - n, 0));
                    };
                    ayat = last(args)
                  } 
                  pesan = ""
                  if(isNaN(ayat)) {
                    var responsih2 = await axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah/'+nmr+'.json')
                    var {name_translations, number_of_ayah, number_of_surah,  recitations} = responsih2.data
                    pesan = pesan + "Audio Quran Surah ke-"+number_of_surah+" "+name+" ("+name_translations.ar+") "+ "dengan jumlah "+ number_of_ayah+" ayat\n"
                    pesan = pesan + "Dilantunkan oleh "+recitations[0].name+" : "+recitations[0].audio_url+"\n"
                    pesan = pesan + "Dilantunkan oleh "+recitations[1].name+" : "+recitations[1].audio_url+"\n"
                    pesan = pesan + "Dilantunkan oleh "+recitations[2].name+" : "+recitations[2].audio_url+"\n"
                    client.reply(from, pesan, message.id)
                  } else {
                    var responsih2 = await axios.get('https://api.quran.sutanlab.id/surah/'+nmr+"/"+ayat)
                    var {data} = responsih2.data
                    var last = function last(array, n) {
                      if (array == null) return void 0;
                      if (n == null) return array[array.length - 1];
                      return array.slice(Math.max(array.length - n, 0));
                    };
                    bhs = last(args)
                    pesan = ""
                    pesan = pesan + data.text.arab + "\n\n"
                    if(bhs == "en") {
                      pesan = pesan + data.translation.en
                    } else {
                      pesan = pesan + data.translation.id
                    }
                    pesan = pesan + "\n\n(Q.S. "+data.surah.name.transliteration.id+":"+args[1]+")"
                    await client.sendFileFromUrl(from, data.audio.secondary[0])
                    await client.reply(from, pesan, message.id)
                  }
              }
              break
        case 'js':
            var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
            Jsholat(nonOption)
            .then(data => {
                data.map(({isya, subuh, dzuhur, ashar, maghrib, terbit}) => {
                    var x  = subuh.split(':'); y = terbit.split(':')
                    var xy = x[0] - y[0]; yx = x[1] - y[1]
                    let perbandingan = `${xy < 0 ? Math.abs(xy) : xy}jam ${yx< 0 ? Math.abs(yx) : yx}menit`
                    let msg = `Jadwal Sholat untuk ${nonOption} dan Sekitarnya ( *${tanggal}* )\n\nDzuhur : ${dzuhur}\nAshar  : ${ashar}\nMaghrib: ${maghrib}\nIsya       : ${isya}\nSubuh   : ${subuh}\n\nDiperkirakan matahari akan terbit pada pukul ${terbit} dengan jeda dari subuh sekitar ${perbandingan}`
                    client.reply(from, msg, id)
                })
            })
                .catch(err => {
                    client.reply(from, err, id)
                    console.log(err)
                })
            insert(author, type, content, pushname, from, argv)
            break
            //Media
            case 'ytmp3':
                var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
                Ytdl(nonOption)
                    .then(data => {
                        const { title, url_audio, minute } = data
                        if (minute >= 1) {
                            client.reply(from, `minimal durasi 1 menit.`, id)
                        } else {
                            client.reply(from, 'Tunggu sebentar, file sedang kami proses', id)
                            client.sendFileFromUrl(from, url_audio, `${title.toLowerCase().replace(/ +/g, '_')}.mp3`, '', null, null, true)
                        }
                    })
                    .catch(err => {
                        client.reply(from, err, id)
                        console.log(err)
                    })
                insert(author, type, content, pushname, from, argv)
                break
            case 'ytmp4':
                var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
                Ytdl(nonOption)
                    .then(data => {
                        const { title, url_video, minute } = data
                        if (minute >= 1) {
                            client.reply(from, `minimal durasi 1 menit.`, id)
                        } else {
                            client.reply(from, 'Tunggu sebentar, file sedang kami proses', id)
                            client.sendFileFromUrl(from, url_video, `${title.toLowerCase().replace(/ +/g, '_')}.mp4`, '', null, null, true)
                        }
                    })
                    .catch(err => {
                        client.reply(from, errr, id)
                        console.log(err)
                    })
                insert(author, type, content, pushname, from, argv)
                break
            case 'ig':
                if (args.length === 1) return client.reply(from, 'Kirim perintah *!ig [linkIg]* untuk contoh silahkan kirim perintah *!menu*')
                if (!args[1].match(isUrl) && !args[1].includes('instagram.com')) return client.reply(from, mess.error.Iv, id)
                try {
                client.reply(from, mess.wait, id)
                const resp = await get.get(`https://mhankbarbar.herokuapp.com/api/dl/ig?link=${args[1]}&apiKey=${apiKey}`).json()
                if (resp.result.includes('.mp4')) {
                    var ext = '.mp4'
                } else {
                    var ext = '.jpg'
                }
                await client.sendFileFromUrl(from, resp.result, `igeh${ext}`, '', id)
                } catch {
                client.reply(from, mess.error.Ig, id)
                }
                break
            case 'fb':
                if (args.length === 1) return client.reply(from, 'Kirim perintah *!fb [linkFb]* untuk contoh silahkan kirim perintah *!menu*', id)
                if (!args[1].includes('facebook.com')) return client.reply(from, mess.error.Iv, id)
                client.reply(from, mess.wait, id)
                const epbe = await get.get(`https://arugaz.herokuapp.com/api/fb?url=${args[1]}`)
                if (epbe.error) return client.reply(from, epbe.error, id)
                client.sendFileFromUrl(from, epbe.result, 'epbe.mp4', epbe.title, id)
                break
            case 'stalkig':
                if (args.length === 1)  return client.reply(from, 'Kirim perintah *!stalkig @username*\nConntoh *!stalkig @kutil_kuda*', id)
                const stalk = await get.get(`https://mhankbarbar.herokuapp.com/api/stalk?username=${args[1]}&apiKey=${apiKey}`).json()
                if (stalk.error) return client.reply(from, stalk.error, id)
                const { Biodata, Jumlah_Followers, Jumlah_Following, Jumlah_Post, Name, Username, Profile_pic } = stalk
                const caps = `➸ *Nama* : ${Name}\n➸ *Username* : ${Username}\n➸ *Jumlah Followers* : ${Jumlah_Followers}\n➸ *Jumlah Following* : ${Jumlah_Following}\n➸ *Jumlah Postingan* : ${Jumlah_Post}\n➸ *Biodata* : ${Biodata}`
                await client.sendFileFromUrl(from, Profile_pic, 'Profile.jpg', caps, id)
                break
        //Random Images
            case 'anime':
                if (args.length == 0) return client.reply(from, `Untuk menggunakan ${prefix}anime\nSilahkan ketik: ${prefix}anime [query]\nContoh: ${prefix}anime random\n\nquery yang tersedia:\nrandom, waifu, husbu, neko`, id)
                if (args[0] == 'random' || args[0] == 'waifu' || args[0] == 'husbu' || args[0] == 'neko') {
                fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/anime/' + args[0] + '.txt')
                .then(res => res.text())
                .then(body => {
                    let randomnime = body.split('\n')
                    let randomnimex = randomnime[Math.floor(Math.random() * randomnime.length)]
                    client.sendFileFromUrl(from, randomnimex, '', 'Nee..', id)
                })
                .catch(() => {
                    client.reply(from, 'Ada yang Error!', id)
                })
            } else {
                client.reply(from, `Maaf query tidak tersedia. Silahkan ketik ${prefix}anime untuk melihat list query`)
            }
                break
            case 'kpop':
                if (args.length == 0) return client.reply(from, `Untuk menggunakan ${prefix}kpop\nSilahkan ketik: ${prefix}kpop [query]\nContoh: ${prefix}kpop bts\n\nquery yang tersedia:\nblackpink, exo, bts`, id)
                if (args[0] == 'blackpink' || args[0] == 'exo' || args[0] == 'bts') {
                fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/' + args[0] + '.txt')
                .then(res => res.text())
                .then(body => {
                    let randomkpop = body.split('\n')
                    let randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]
                    client.sendFileFromUrl(from, randomkpopx, '', 'Nee..', id)
                })
                .catch(() => {
                    client.reply(from, 'Ada yang Error!', id)
                })
                } else {
                client.reply(from, `Maaf query tidak tersedia. Silahkan ketik ${prefix}kpop untuk melihat list query`)
                }
                break
            case 'neko':
                q2 = Math.floor(Math.random() * 900) + 300;
                q3 = Math.floor(Math.random() * 900) + 300;
                client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko ')
                break
            case 'whatanime':
                if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                    if (isMedia) {
                        var mediaData = await decryptMedia(message, uaOverride)
                    } else {
                        var mediaData = await decryptMedia(quotedMsg, uaOverride)
                    }
                    const fetch = require('node-fetch')
                    const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    client.reply(from, 'Searching....', id)
                    fetch('https://trace.moe/api/search', {
                        method: 'POST',
                        body: JSON.stringify({ image: imgBS4 }),
                        headers: { "Content-Type": "application/json" }
                    })
                    .then(respon => respon.json())
                    .then(resolt => {
                        if (resolt.docs && resolt.docs.length <= 0) {
                            client.reply(from, 'Maaf, saya tidak tau ini anime apa, pastikan gambar yang akan di Search tidak Buram/Kepotong', id)
                        }
                        const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                        teks = ''
                        if (similarity < 0.92) {
                            teks = '*Saya memiliki keyakinan rendah dalam hal ini* :\n\n'
                        }
                        teks += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`
                        teks += `➸ *R-18?* : ${is_adult}\n`
                        teks += `➸ *Eps* : ${episode.toString()}\n`
                        teks += `➸ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                        var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                        client.sendFileFromUrl(from, video, 'anime.mp4', teks, id).catch(() => {
                            client.reply(from, teks, id)
                        })
                    })
                    .catch(() => {
                        client.reply(from, 'Ada yang Error!', id)
                    })
                } else {
                    client.reply(from, `Maaf format salah\n\nSilahkan kirim foto dengan caption ${prefix}whatanime\n\nAtau reply foto dengan caption ${prefix}whatanime`, id)
                }
            break
        // Random Kata
        case 'fakta':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/faktaunix.txt')
            .then(res => res.text())
            .then(body => {
                let splitnix = body.split('\n')
                let randomnix = splitnix[Math.floor(Math.random() * splitnix.length)]
                client.reply(from, randomnix, id)
            })
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'katabijak':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/katabijax.txt')
            .then(res => res.text())
            .then(body => {
                let splitbijak = body.split('\n')
                let randombijak = splitbijak[Math.floor(Math.random() * splitbijak.length)]
                client.reply(from, randombijak, id)
            })
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'pantun':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/pantun.txt')
            .then(res => res.text())
            .then(body => {
                let splitpantun = body.split('\n')
                let randompantun = splitpantun[Math.floor(Math.random() * splitpantun.length)]
                client.reply(from, randompantun.replace(/aruga-line/g,"\n"), id)
            })
            .catch(() => {
                client.reply(from, 'Ada yang Error!', id)
            })
            break
        //Other Menu
        case 'cekjodoh':
            var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
            if (_.isEmpty(mentionedJidList) != true && mentionedJidList.length >= 2) {
                const couple1 = await client.getContact(mentionedJidList[0])
                const couple2 = await client.getContact(mentionedJidList[1])
                const c1 = couple1.isBusiness ? couple1.verifiedName : couple1.pushname
                const c2 = couple2.isBusiness ? couple2.verifiedName : couple2.pushname
                Primbon('cekjodoh', `${c1}&${c2}`)
                    .then(data => {
                        client.reply(from, data, id)
                    })
            } else if (nonOption.split('').some(dt => /\W/g.test(dt))) {
                Primbon('cekjodoh', nonOption)
                    .then(data => {
                        client.reply(from, data, id)
                    })
            }
            insert(author, type, content, pushname, from, argv)
            break
        case 'artinama':
            var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
            Primbon('artinama', nonOption)
                .then(data => {
                    client.reply(from, `arti nama: *${nonOption}*\n\n${data}`, id)
                })
                .catch(err => {
                    console.log(err)
                })
            insert(author, type, content, pushname, from, argv)
            break
        case 'tts':
            var withOption = quotedMsg ? quotedMsgObj.body : args.splice(1).join(' ')
            var tts = require('node-gtts')(args[0])
            tts.save(process.cwd() + '/tts.ogg', withOption, async () => {
                client.sendPtt(from, './tts.ogg', null)
            })
            insert(author, type, content, pushname, from, argv)
            break
        case 'qr':
                var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
                QrMaker(nonOption)
                    .then(data => {
                        client.sendImage(from, data, 'qr.jpg', '')
                    })
                    .catch(err => {
                        console.log(err)
                    })
                insert(author, type, content, pushname, from, argv)
            break
        case 'togif':
                if (isMedia || isQuotedVideo) {
                    const media = isQuotedVideo ? quotedMsg : message
                    const _mimetype = isQuotedVideo ? quotedMsg.mimetype : mimetype
                    const _data = await decryptMedia(media, uaOverride)
                    const videoaData = `data:${_mimetype};base64,${_data.toString('base64')}`
                    await client.sendVideoAsGif(from, videoaData, 'toGif.gif', '')
                }
                insert(author, type, content, pushname, from, argv)
            break
        case 'cuaca':
                var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
                Cuaca(nonOption)
                    .then(data => {
                        const { deskripsi, suhu, kelembapan } = data
                        const msg = `Perkiaraan cuaca: *${nonOption}*\n\nSuhu: *${suhu}*\nKelembapan: *${kelembapan}*\nDeskripsi: *${deskripsi}*`
                        client.reply(from, msg, id)
                    }).catch(err => {
                        client.reply(from, err, id)
                        console.log(err)
                    })
                insert(author, type, content, pushname, from, argv)
                break
        case 'quotemaker':
                var withOption = quotedMsg ? quotedMsgObj.body : args.splice(1).join(' ')
                var split = args[0].split(/\W/g)
                Gquotes(split[0], split[1], withOption)
                    .then(data => {
                        client.sendImage(from, data, 'quotes.jpg', '')
                    })
                    .catch(err => {
                        console.log(err)
                    })
                insert(author, type, content, pushname, from, argv)
                break
        case 'lirik':
            var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
                Lirik(nonOption)
                    .then(data => {
                        client.reply(from, `Lirik lagu *${nonOption}*:\n\n${data}`, id)
                    })
                    .catch(err => {
                        client.reply(from, err, id)
                        console.log(err)
                    })
             insert(author, type, content, pushname, from, argv)
            break
        case 'chord':
                if (args.length === 1) return client.reply(from, 'Kirim perintah *!chord [query]*, contoh *!chord Imagination*', id)
                const query__ = body.slice(7)
                const chord = await get.get(`https://mhankbarbar.herokuapp.com/api/chord?q=${query__}&apiKey=${apiKey}`).json()
                if (chord.error) return client.reply(from, chord.error, id)
                client.reply(from, chord.result, id)
            break
        case 'stickergif':
        case 'stikergif':
                if (isMedia || isQuotedVideo) {
                        if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                            var mediaData = await decryptMedia(message, uaOverride)
                            client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
                            var filename = `./media/stickergif.${mimetype.split('/')[1]}`
                            await fs.writeFileSync(filename, mediaData)
                            await exec(`gify ${filename} ./media/stickergf.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                                var gif = await fs.readFileSync('./media/stickergf.gif', { encoding: "base64" })
                                await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                                .catch(() => {
                                    client.reply(from, 'Maaf filenya terlalu besar!', id)
                                })
                            })
                        } else {
                            client.reply(from, `[❗] Kirim gif dengan caption *${prefix}stickergif* max 10 sec!`, id)
                            }
                        } else {
                    client.reply(from, `[❗] Kirim gif dengan caption *${prefix}stickergif*`, id)
                    }
                break
            case 'stiker':
                if (isMedia || isQuotedImage) {
                    const media = isQuotedImage ? quotedMsg : message
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const _data = await decryptMedia(media, uaOverride)
                    const imageData = `data:${_mimetype};base64,${_data.toString('base64')}`
                    await client.sendImageAsSticker(from, imageData)
                }
                insert(author, type, content, pushname, from, argv)
                break
            case 'nulis':
                var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
                Nulis(nonOption)
                    .then(res => {
                        res.map(link => {
                            client.sendFileFromUrl(from, link, 'nulis.png', `nih bang`, null, null, true)
                        })
                    })
                    .catch(err => {
                        console.log('[NULIS] Error:', err)
                        client.reply(from, err, id)
                    })
                insert(author, type, content, pushname, from, argv)
                break;
            default:
                break

        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = MessageHandler
