const path = require('path');
app.set('views', path.join(__dirname, 'views')); // <-- ensures Express finds views
app.set('view engine', 'ejs');


