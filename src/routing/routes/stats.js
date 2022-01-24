const express = require('express');
const { Guild, GuildUser, WhitelabelBot } = require('@prosperitybot/database');

const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.get('/', async (request, response, next) => {
	const guildCount = await Guild.count({ where: { active: true } });
	const userCount = await GuildUser.count({ where: { '$guild.active$': true }, include: [{ model: Guild, required: false }] });
	const whitelabelBotCount = await WhitelabelBot.count();

	return response.status(200).json({
		guilds: guildCount,
		users: userCount,
		whitelabelBots: whitelabelBotCount,
	});
});

module.exports = router;