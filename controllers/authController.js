const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.showLogin = (req, res) => res.render('login');
exports.showRegister = (req, res) => res.render('register');

exports.register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  if (!email || !password) return res.status(400).send('Missing fields');
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, phone, password_hash: hash, role: role || 'customer' });
  req.session.user = { id: user.id, email: user.email, role: user.role, name: user.name };
  res.redirect('/');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).render('login', { error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).render('login', { error: 'Invalid credentials' });
  req.session.user = { id: user.id, email: user.email, role: user.role, name: user.name };
  res.redirect('/');
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
