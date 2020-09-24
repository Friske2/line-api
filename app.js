import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.post('/webhook', (req, res) => res.sendStatus(200))
app.use("*", (req, res) => {
     let text = "Hello world";
     return res.send(text);
})
app.listen(PORT,() => {
  console.log(`server start port ${PORT}`);
})