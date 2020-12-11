require('dotenv').config()
const { create, Client } = require('@open-wa/wa-automate')
const { options } = require('./lib/utils/options')
const MessageHandler = require('./handler')

const start = (client = new Client()) => {
    console.log('[SERVER] Server Started!')
    // Mempertahankan sesi agar tetap nyala
    client.onStateChanged((state) => {
        console.log(color('[~>>]', 'red'), state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
    })
    
    // ketika seseorang mengirim pesan
    client.onMessage((message) => {
        client.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 3000) {
                    client.cutMsgCache()
                }
            })
        MessageHandler(client, message)
    })

    // ketika bot diinvite ke dalam group
    client.onAddedToGroup(async (chat) => {
	const groups = await client.getAllGroups()
	// kondisi ketika batas group bot telah tercapai,ubah di file settings/setting.json
	if (groups.length > groupLimit) {
	await client.sendText(chat.id, `Sorry, the group on this bot is full\nMax Group is: ${groupLimit}`).then(() => {
	      client.leaveGroup(chat.id)
	      client.deleteChat(chat.id)
	  }) 
	} else {
	// kondisi ketika batas member group belum tercapai, ubah di file settings/setting.json
	    if (chat.groupMetadata.participants.length < memberLimit) {
	    await client.sendText(chat.id, `Sorry, BOT comes out if the group members do not exceed ${memberLimit} people`).then(() => {
        client.leaveGroup(chat.id)
        client.deleteChat(chat.id)
	    })
	    } else {
        await client.simulateTyping(chat.id, true).then(async () => {
          await client.sendText(chat.id, `Hai minna~, Im SD BOT. To find out the commands on this bot type ${prefix}menu`)
        })
	    }
	}
    })

    // ketika seseorang masuk/keluar dari group
    client.onGlobalParicipantsChanged(async (event) => {
        const host = await aruga.getHostNumber() + '@c.us'
		let profile = await aruga.getProfilePicFromServer(event.who)
		if (profile == '' || profile == undefined) profile = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQcODjk7AcA4wb_9OLzoeAdpGwmkJqOYxEBA&usqp=CAU'
        // kondisi ketika seseorang diinvite/join group lewat link
        if (event.action === 'add' && event.who !== host) {
			await client.sendFileFromUrl(event.chat, profile, 'profile.jpg', '')
            await client.sendTextWithMentions(event.chat, `Hello, Welcome to the group @${event.who.replace('@c.us', '')} \n\nHave fun with us✨`)
        }
        // kondisi ketika seseorang dikick/keluar dari group
        if (event.action === 'remove' && event.who !== host) {
			await client.sendFileFromUrl(event.chat, profile, 'profile.jpg', '')
            await client.sendTextWithMentions(event.chat, `Good bye @${event.who.replace('@c.us', '')}, We'll miss you✨`)
        }
    })

    client.onIncomingCall(async (callData) => {
        // ketika seseorang menelpon nomor bot akan mengirim pesan
        await client.sendText(callData.peerJid, 'Maaf sedang tidak bisa menerima panggilan.\n\n-bot')
        .then(async () => {
            // bot akan memblock nomor itu
            await client.contactBlock(callData.peerJid)
        })
    })
	
    // Message log for analytic
    client.onAnyMessage((anal) => { 
        messageLog(anal.fromMe, anal.type)
    })
}

//create session
create('SD-bot', options(false, start))
    .then((client) => start(client))
    .catch((err) => new Error(err))
