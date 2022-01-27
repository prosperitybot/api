const express = require('express');
const { Guild, GuildUser, User } = require('@prosperitybot/database');
const { Op } = require('sequelize');

const router = express.Router();

router.get('/:id', async (request, response, next) => {
	const guildId = request.params.id;
	const { page, limit, q } = request.query;

	const queryLimit = limit == null ? 50 : parseInt(limit) > 50 ? 50 : parseInt(limit);
	const queryPage = page ?? 1;

	const guild = await Guild.findByPk(guildId);
	let users;

	if (q != null && q != '') {
		users = await GuildUser.findAll({
			where: {
				'$user.username$': { [Op.substring]: q },
				guildId: guildId,
			},
			offset: queryLimit * (queryPage - 1),
			limit: parseInt(queryLimit),
			order: [ ['xp', 'DESC'] ],
			include: User,
		});
	}
	else {
		users = await GuildUser.findAll({
			where: {
				guildId: guildId,
			},
			offset: queryLimit * (queryPage - 1),
			limit: parseInt(queryLimit),
			order: [ ['xp', 'DESC'] ],
			include: User,
		});
	}
	if (!users || !guild) return next(new Error('Guild not found'));

	return response.status(200).json({
		guild: ({
			id: guild.id.toString(),
			name: guild.name,
			multiplier: guild.xpRate,
		}),
		users: users.map(user => ({
			xp: user.xp,
			level: user.level,
			messageCount: user.messageCount,
			user: {
				id: user.user.id.toString(),
				username: user.user.username,
				discriminator: user.user.discriminator,
			},
		})),
	});
});

module.exports = router;