const homeService = require('./home.service');
const { sendSuccess, sendError } = require('../../utils/response.util');

exports.getHomeData = async (req, res) => {
    try {
        const homeData = await homeService.getHomeData(req.user.id);
        sendSuccess(res, homeData, 'Home data fetched successfully');
    } catch (error) {
        sendError(res, error);
    }
};
