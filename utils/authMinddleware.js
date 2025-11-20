module.exports.ensureAuth = (req, res, next) => {
if (!req.session.user) return res.redirect('/login');
next();
};n


module.exports.ensureRole = (role) => (req,res,next) => {
if (!req.session.user || req.session.user.role !== role) return res.status(403).send('Forbidden');
next();
};