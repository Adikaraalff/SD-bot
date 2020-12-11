const Menu = (prefix, name) => new Promise((resolve, reject) => {
	resolve(`Halo ${name}!

Join Us : https://chat.whatsapp.com/HOsKQ11h1E4Hr72K6DEDg7
Support : https://saweria.co/SDbot

Berikut ini menu yang disediakan *SD-bot*:

 🍻 -> Menu --| Info |-- 🍻
 🚀 *${prefix}about*
 🚀 *${prefix}donasi*

 🍻 -> Menu --| Anime |-- 🍻
 -☾ *${prefix}anime <query yang ingin kamu cari>*
 -☾ *${prefix}neko*
 -☾ *${prefix}kpop*
 -☾ *${prefix}whatanime <query yang ingin kamu cari>*

 🍻 -> Menu --| Kata |-- 🍻
 -> *${prefix}quotes*
 ->	*${prefix}quotemaker <|theme|author|teks|>* 
 -> *${prefix}katabijak*
 -> *${prefix}pantun*

 🍻 -> Menu --| Islami |-- 🍻
 -❥ *${prefix}infosurah <query yang ingin kamu cari>*
 -❥ *${prefix}surah <query yang ingin kamu cari>*
 -❥ *${prefix}tafsir <query yang ingin kamu cari>*
 -❥ *${prefix}ALaudio <query yang ingin kamu cari>*
 -❥ *${prefix}js <query yang ingin kamu cari>* (Jadwal Sholat)

 🍻 -> Menu --| Downloader |-- 🍻
 💌 *${prefix}ytmp4 <link youtube>*
 💌 *${prefix}ytmp3 <link youtube>*
 💌 *${prefix}ig <link fb>*
 💌 *${prefix}fb <link fb>*

 🍻 -> Menu --| Education |-- 🍻
 💡  *${prefix}fakta*
 💡  *${prefix}wiki <query yang ingin kamu cari>*
 💡  *${prefix}brainly <query yang ingin kamu cari>*
 💡  *${prefix}translate <kode bahasa> <tagPesan/masukanPesanManual>*
 💡  *${prefix}tts <kode bahasa> <tagPesan/masukanPesanManual>* (Text To Speech) 

 🍻 -> Menu --| Admin (owner) |-- 🍻
 ⚙ 	*${prefix}admin* (Check Admin)
 ⚙ 	*${prefix}add <62858xxxxx>* admin only
 ⚙ 	*${prefix}kick <@tagmember>* admin only
 ⚙ 	*${prefix}promote <@tagmember>* admin only
 ⚙ 	*${prefix}demote <@tagmember>* admin only
 ⚙ 	*${prefix}kickall* admin only
 ⚙ 	*${prefix}tagall* (Tag All Member)
 ⚙ 	*${prefix}glink* (Group Link)
 ⚙ 	*${prefix}del* (Unsend Bot Massage)
 ⚙ 	*${prefix}resend* (Resend Massage)
 ⚙ 	*${prefix}mute* (Mute Group)
 ⚙ 	*${prefix}setprofile* (Mengubah profile group)
 ⚙ 	*${prefix}kickme* (Kick Bot)

 🍻 -> Menu --| Other Menu |-- 🍻
 🧷 *${prefix}cuaca <kota>*
 🧷 *${prefix}qr <tagPesan/masukanPesanManual>* (QR Code Reader)
 🧷 *${prefix}lirik <judul lagu>*
 🧷 *${prefix}chord <judul lagu>*
 🧷 *${prefix}stalkig <@username>*
 🧷 *${prefix}stiker*
 🧷 *${prefix}stickergif*
 🧷 *${prefix}nulis <tulisan yang ingin kamu tulis>*
 🧷	*${prefix}artinama <nama seseorang>*
 🧷	*${prefix}cekjodoh <nama1 & nama2/tag 2 orang>*
 
note: semua command tidak menggunakan tanda *<*   dan   *>*

Semoga harimu menyenangkan.

*Regards: Adikara A.N*
		`)
})

module.exports = Menu