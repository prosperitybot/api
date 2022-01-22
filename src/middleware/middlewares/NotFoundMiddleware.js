module.exports = (request, response, next) => {
	response.status(404);
	const error = new Error(`🔍 - Not Found - ${request.originalUrl}`);
	next(error);
};