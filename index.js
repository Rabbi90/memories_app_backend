const app = require('./app')
const config = require('./config/config')
const PORT = config.app.PORT


app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
})