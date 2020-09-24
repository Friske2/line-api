import express from 'express';
import bodyParser from 'body-parser'
import request from 'request'
const app = express();
const PORT = process.env.PORT || 3000;
const access_token = `rCzdtQar2QHfxY0WihWLJFlrJIY+EH5r9ItdktsFQec0PHfCn/1xG7iHGeMTSR12gABvgSamQ/ajAaj2K1nMRNe+ryd4Bv2FvqtEMLa/byUITkoXDYv2yWxABq3uOHmZwwSIAkAej7Khv3PnxnZBMwdB04t89/1O/w1cDnyilFU=`
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/webhook', (req, res) => {
  let reply_token = req.body.events[0].replyToken
  reply(reply_token)
  res.sendStatus(200)
})
app.use("*", (req, res) => {
     let text = "Hello world";
     return res.send(text);
})
app.listen(PORT,() => {
  console.log(`server start port ${PORT}`);
})

function reply(reply_token) {
  let headers = {
      'Content-Type': 'application/json',
      'Authorization': access_token
  }
  let body = JSON.stringify({
      replyToken: reply_token,
      messages: [{
          type: 'text',
          text: 'Hello'
      },
      {
          type: 'text',
          text: 'How are you?'
      }]
  })
  request.post({
      url: 'https://api.line.me/v2/bot/message/reply',
      headers: headers,
      body: body
  }, (err, res, body) => {
      console.log('status = ' + res.statusCode);
  });
}