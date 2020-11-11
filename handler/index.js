const { decryptMedia, Client } = require('@open-wa/wa-automate')
const moment = require('moment-timezone')
const _ = require('lodash')

const {
    Ytdl,
    Wiki,
    About,
    Menu,
    Donasi,
    Nulis,
    Lirik,
    Cuaca,
    Quotes,
    QrMaker,
    Quotesmaker,
    Brainly,
    Jsholat,
    Translate,
    Downloader,
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
    
const config = {
        stickerGIF: {
        fps: 30, // Lumayan
        quality: 1, // Buriq?
        target: '1M',
        duration: 20 // Detik (Durasi Maksimal)
                },
        sizeLimit: '50', // Megabytes
    API: {
        mhankbarbar: {
            url: 'https://mhankbarbar-api--nurutomo.repl.co',
            ig: '/api/ig',
        }
    }
}

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
                args = args.join(' ').split(',').map(number => number.trim())
                failed = permission([
                    [!isGroupMsg, config.msg.notGroup],
                    // [!isGroupAdmins, config.msg.notAdmin],
                    [!isBotGroupAdmins, config.msg.notBotAdmin],
                    [args.length === 0, config.msg.noArgs],
                    [args.includes(botNumber), config.msg.self],
                    ])
                if (failed[0]) return client.reply(from, failed[1], id)
                await client.sendTextWithMentions(from, config.msg.add + args.map(config.msg.listUser).join('\n'))
                for (let i = 0; i < args.length; i++) {
                    client.addParticipant(groupId, args[i] + '@c.us')
                    }
                break
            case 'kick':
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan Perintah ini, kirim perintah *!kick* @tagmember', id)
                await client.sendText(from, `Perintah diterima, mengeluarkan:\n${mentionedJidList.join('\n')}`)
                for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Ki, id)
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
                break
            case 'promote':
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
                if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *!promote* @tagmember', id)
                if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 user.', id)
                if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
                await client.promoteParticipant(groupId, mentionedJidList[0])
                await client.sendTextWithMentions(from, `Perintah diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`)
                break
            case 'demote':
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
                if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *!demote* @tagadmin', id)
                if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 orang.', id)
                if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id)
                await client.demoteParticipant(groupId, mentionedJidList[0])
                await client.sendTextWithMentions(from, `Perintah diterima, menghapus jabatan @${mentionedJidList[0]}.`)
                break
            case 'glink':
                var link = await client.getGroupInviteLink(groupId)
                var msg  = `Link group: *${formattedTitle}*\n\n• ${link}`
                client.reply(from, msg, id)
                insert(author, type, content, pushname, from, argv)
                break
            case 'getall':
                if (isGroupMsg && isGroupAdmins) {
                    let msg = `List member of group: *${formattedTitle}*\n\nTotal: ${groupMembers.length}\n\n`
                    let index = 1;
                    groupMembers.map(user => {
                        msg += `*${index++}*. @${user.replace(/@c.us/g, '')}\n`
                    })
                    await client.sendTextWithMentions(from, msg)
                }
                insert(author, type, content, pushname, from, argv)
                break
            case 'kickall':
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            const allMem = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) {
                    console.log('Upss this is Admin group')
                } else {
                    await client.removeParticipant(groupId, allMem[i].id)
                }
            }
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
                var msg = `Halo ${pushname} 👋. Berikut hasil pencarian dari: *${nonOption}* \n\n`
                Brainly(nonOption)
                     .then(data => {
                        let i = 1
                        data.map(({ title, url }) => {
                            msg += `${i++}. ${title}\nKlik Disini: ${url}\n\n`
                        })
                        client.reply(from, msg, id)
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
            case 'ytmp3':
                    var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
                    Ytdl(nonOption)
                        .then(data => {
                            const { title, url_audio, Seconds } = data
                            if (Seconds >= 1) {
                                client.reply(from, `minimal durasi 1 detik.`, id)
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
                            const { title, url_video, Seconds } = data
                            if (Seconds >= 1) {
                                client.reply(from, `minimal durasi 1 detik.`, id)
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
            case 'quotesmaker':
                    var withOption = quotedMsg ? quotedMsgObj.body : args.splice(1).join(' ')
                    var split = args[0].split(/\W/g)
                    Quotesmaker(split[0], split[1], withOption)
                        .then(data => {
                            client.sendImage(from, data, 'quotes.jpg', '')
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    insert(author, type, content, pushname, from, argv)
                break
            case 'ig':
                    failed = permission([
                        [!url, config.msg.notURL]
                    ])
                    if (failed[0]) return client.repl(from, failed[1], id)
                    mhankbarbar('ig', '?url=' + encodeURIComponent(url))
                        .then(res => res.json())
                        .then(res => {
                            client.sendFile(from, res.result, 'ig', '', id)
                        })
                break
            case 'fbdl':
                var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
                Downloader('fbdl', nonOption)
                    .then(data => {
                        console.log(data)
                        const { title, link } = data
                        client.sendFileFromUrl(from, link, 'fbdl.mp4', `Title: *${title}*`, null, null, true)
                    })
                    .catch(err => {
                        client.reply(from, err, id)
                        console.log(err)
                    })
                insert(author, type, content, pushname, from, argv)
                break
            case 'pindl':
                var nonOption = quotedMsg ? quotedMsgObj.body : args.join(' ')
                Downloader('pindl', nonOption)
                    .then(data => {
                        const { link } = data
                        link.map(({ url }) => {
                            client.sendFileFromUrl(from, url, 'pindl.jpg', ``, null, null, true)
                        })
                    })
                    .catch(err => {
                        client.reply(from, err, id)
                        console.log(err)
                    })
                insert(author, type, content, pushname, from, argv)
                break
            case 'igstalk':
                if (args.length === 1)  return client.reply(from, 'Kirim perintah *!igStalk @username*\nConntoh *!igStalk @anak_haram*', id)
                    const stalk = await get.get(`https://mhankbarbar.herokuapp.com/api/stalk?username=${args[1]}&apiKey=${apiKey}`).json()
                    if (stalk.error) return client.reply(from, stalk.error, id)
                    const { Biodata, Jumlah_Followers, Jumlah_Following, Jumlah_Post, Name, Username, Profile_pic } = stalk
                    const caps = `➸ *Nama* : ${Name}\n➸ *Username* : ${Username}\n➸ *Jumlah Followers* : ${Jumlah_Followers}\n➸ *Jumlah Following* : ${Jumlah_Following}\n➸ *Jumlah Postingan* : ${Jumlah_Post}\n➸ *Biodata* : ${Biodata}`
                    await client.sendFileFromUrl(from, Profile_pic, 'Profile.jpg', caps, id)
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
                if (args.length === 1) return client.reply(from, 'Kirim perintah *!chord [query]*, contoh *!chord aku bukan boneka*', id)
                const query_ = body.slice(7)
                const chord = await get.get(`https://mhankbarbar.herokuapp.com/api/chord?q=${query_}&apiKey=${apiKey}`).json()
                if (chord.error) return client.reply(from, chord.error, id)
                client.reply(from, chord.result, id)
                break
            case (/sti(c|)kergif|gifsti(c|)ker|sgif/i, 'sgif'):
                    // TODO: Sticker GIF
                    if ((isMedia || isQuotedVideo || isQuotedFile) && args.length === 0) {
                        const encryptMedia = isQuotedVideo || isQuotedFile ? quotedMsg : message
                        const _mimetype = isQuotedVideo || isQuotedFile ? quotedMsg.mimetype : mimetype
                        client.reply(from, config.msg.waitConvert(_mimetype.replace(/.+\//, ''), 'webp', 'Stiker itu pakai format *webp*'), id)
                        if (/image/.test(_mimetype)) client.reply(from, config.msg.recommend(usedPrefix, 'stiker'), id)
                        console.log(color('[WAPI]'), 'Downloading and decrypting media...')
                        const mediaData = await decryptMedia(encryptMedia)
                        if (_mimetype === 'image/webp') client.sendRawWebpAsSticker(from, mediaData.toString('base64'), true)
                        let temp = './temp'
                        let name = new Date() * 1
                        let fileInputPath = path.join(temp, /(.+)\//.exec(_mimetype)[1], `${name}.${_mimetype.replace(/.+\//, '')}`)
                        let fileOutputPath = path.join(temp, 'webp', `${name}.webp`)
                        console.log(color('[fs'), `Writing media file into '${fileInputPath}'`)
                        fs.writeFile(fileInputPath, mediaData, err => {
                            if (err) return client.sendText(from, config.msg.error('Ada yang error saat menulis file\n\n' + err)) && console.log(color('[ERROR]', 'red'), err)
                            // ffmpeg -y -t 5 -i <input_file> -vf "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease" -qscale 100 <output_file>.webp
                            ffmpeg(fileInputPath)
                                .inputOptions([
                                    '-y',
                                    '-t', config.stickerGIF.duration
                                ])
                                .complexFilter([
                                    (config.stickerGIF.fps >= 1 ? 'fps=' + config.stickerGIF.fps + ',' : '') + 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
                                ])
                                .outputOptions([
                                    '-qscale', config.stickerGIF.quality,
                                    '-fs', config.stickerGIF.target || '1M',
                                    '-vcodec', 'libwebp',
                                    // '-lossless', '1',
                                    '-preset', 'default',
                                    '-loop', '0',
                                    '-an',
                                    '-vsync', '0'
                                ])
                                .format('webp')
                                .on('start', function (commandLine) {
                                    console.log(color('[FFmpeg]'), commandLine)
                                })
                                .on('progress', function (progress) {
                                    console.log(color('[FFmpeg]'), progress, '')
                                })
                                .on('end', function () {
                                    console.log(color('[FFmpeg]'), 'Processing finished!')
                                    fs.readFile(fileOutputPath, { encoding: 'base64' }, async (err, base64) => {
                                        if (err) return client.sendText(from, config.msg.error('Ada yang error saat membaca file .webp\n\n' + err)) && console.log(color('[ERROR]', 'red'), err)
                                        try {
                                            await client.sendRawWebpAsSticker(from, base64, true)
                                        } catch (e) {
                                            console.log(color('[ERROR]', 'red'), e)
                                            client.sendText(from, config.msg.error('Ada yang error saat mengirim stiker\n\n' + e))
                                        }
                                        setTimeout(() => {
                                            try {
                                                fs.unlinkSync(fileInputPath)
                                                fs.unlinkSync(fileOutputPath)
                                            } catch (e) {
                                                console.log(color('[ERROR]', 'red'), e)
                                            }
                                        }, 5000)
                                    })
                                })
                                .save(fileOutputPath)
                        })
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
                            client.sendFileFromUrl(from, link, 'nulis.png', `nih`, null, null, true)
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
