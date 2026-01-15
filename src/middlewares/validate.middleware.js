const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.body
            ? schema.body.validate(req.body)
            : { error: null };

        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details[0].message,
            });
        }

        next();
    };
};

module.exports = validate;
