const Menu = (prefix, name) => new Promise((resolve, reject) => {
	resolve(`Halo ${name}!

Join Us: https://chat.whatsapp.com/HOsKQ11h1E4Hr72K6DEDg7

Berikut ini menu yang disediakan *SD-bot*:

 🍻 -> Menu --| Info |-- 🍻
 🚀 *${prefix}about*
 🚀 *${prefix}donasi*

 🍻 -> Menu --| Admin (owner) |-- 🍻
 ⚙ 	*${prefix}admin* (Check Admin)
 ⚙ 	*${prefix}promote <@tagmember>* admin only
 ⚙ 	*${prefix}demote <@tagmember>* admin only
 ⚙ 	*${prefix}add <62858xxxxx>* admin only
 ⚙ 	*${prefix}kick <@tagmember>* admin only
 ⚙ 	*${prefix}kickall* admin only
 ⚙ 	*${prefix}getall* (Tag All Member)
 ⚙ 	*${prefix}glink* (Group Link)
 ⚙ 	*${prefix}del* (Unsend Bot Massage)
 ⚙ 	*${prefix}resend* (Resend Massage)
 ⚙ 	*${prefix}kickme* (Kick Bot)

 🍻 -> Menu --| Downloader |-- 🍻
 💌 *${prefix}pindl <link pinterest>*
 💌 *${prefix}ytmp4 <link youtube>*
 💌 *${prefix}ytmp3 <link youtube>*
 💌 *~${prefix}ig <link instagram>~*
 💌 *${prefix}fbdl <link fb>*

 🍻 -> Menu --| Education |-- 🍻
 💡  *${prefix}wiki <query yang ingin kamu cari>*
 💡  *${prefix}brainly <query yang ingin kamu cari>*
 💡  *${prefix}translate <kode bahasa> <tagPesan/masukanPesanManual>*

 🍻 -> Menu --| Other Menu |-- 🍻
 🧷	*${prefix}quotes*
 🧷	*~${prefix}quotemaker <tema author quotes kamu>~*
 🧷 *${prefix}js <kota>* (Jadwal Sholat) 
 🧷 *${prefix}cuaca <kota>*
 🧷 *${prefix}qr <tagPesan/masukanPesanManual>* (QR Code Reader)
 🧷 *${prefix}lirik <judul lagu>*
 🧷 *${prefix}chord <judul lagu>*
 🧷 *${prefix}stiker*
 🧷 *${prefix}igStalk <@username>*
 🧷 *${prefix}gifstiker*
 🧷 *${prefix}nulis <tulisan yang ingin kamu tulis>*
 🗣  *${prefix}tts <kode bahasa> <tagPesan/masukanPesanManual>* (Text To Speech) 
 
note: semua command tidak menggunakan tanda *<*   dan   *>*

Semoga harimu menyenangkan.

*Regards: Adikara A.N*
		`)
})

module.exports = Menu