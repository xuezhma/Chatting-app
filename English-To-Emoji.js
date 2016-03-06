'use strict'
const translate = (sentence) => {
	const newSentence = sentence.split(' ').map(word => {
		// check meme first 
		if (lib.keys.meme.indexOf(word) > -1){
			return `<img src='${lib.meme[word].url}'>`
		} else{
			// to do
			return word
		}
	})

	return newSentence.join(' ')
}

const listMemes = () => {
	let memelist = []
	for (let i = 0; i < lib.keys.meme.length; i++) {
		let meme = lib.keys.meme[i]
		memelist.push(`${meme}: <img src='${lib.meme[meme].url}'><br />`)
	}
	return memelist.join(' ')
}

const lib = {
	"meme" : {
		"awkwardSeal" : {
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/awkwardSeal.png"
		},
		"doge": {
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/doge.png"
		},

		"dickbutt" : {
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/dickButt.png"

		},

		"kappa" : {
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/kappa.png"

		},

		"bibleThump" :{
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/bibleThump.png"

		},
		"confessionBear" :{
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/confessionBear.png"

		},
		"dansGame" :{
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/dansGame.png"

		},
		"dickButt" :{
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/dickButt.png"

		},
		"fail" :{
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/fail.png"

		},
		"grumpyCat" :{
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/grumpyCat.png"

		},
		"heyGuys" :{
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/heyGuys.png"

		},
		"kappaPride" :{
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/kappaPride.png"

		},
		"keepo" :{
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/keepo.png"

		},
		"laina" :{
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/laina.png"

		},
		"orc" :{
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/orc.png"

		},
		"salt" :{
			"url" : "https://raw.githubusercontent.com/xuezhma/English-To-Emoji/master/lib/salt.png"
		}
	},

	"noun" : {
		"subject" : [],
		"object" : [],
	},

	"emotion" : {

	},

	"keys": {
		"meme": [ 
			'awkwardSeal',
			'doge',
			'dickbutt',
			'kappa',
			'bibleThump',
			'confessionBear',
			'dansGame',
			'dickButt',
			'fail',
			'grumpyCat',
			'heyGuys',
			'kappaPride',
			'keepo',
			'laina',
			'orc',
			'salt' 
		],

		"subject" : ["i", "he", "she", "you", "they", "mi", "yo"],
		"object" : ["me", "him", "her", "you", "them", "mi", "yo"],
		"emotion" : ["rekt", "omg", "fuck"]
	}
}

module.exports = {
	lib: lib,
	translate: translate,
	listMemes: listMemes
}