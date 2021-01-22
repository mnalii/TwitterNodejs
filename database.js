const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(process.env.MONGODB_DATABASE)
      .then(() => {
        console.log('Database connected');
      })
      .catch((err) => console.log(`Database error: ${err}`));
  }
}

module.exports = new Database();
