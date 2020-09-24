import express from 'express';
import http from 'http';
const app = express();
const PORT = process.env.PORT || 3000;
http.createServer(app).listen(PORT, () => {
     console.log("server status : running");
     console.log(`run on port : ${PORT}`);
});
app.post('/webhook', (req, res) => res.sendStatus(200))
app.use("*", (req, res) => {
     let text = "Hello world";
     return res.send(text);
})