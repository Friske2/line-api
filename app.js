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
  let msg = req.body.events[0].message.text
  reply(reply_token,msg)
  res.sendStatus(200)
})
app.use("*", (req, res) => {
     let text = "Hello world";
     return res.send(text);
})
app.listen(PORT,() => {
  console.log(`server start port ${PORT}`);
})

function reply(reply_token,msg) {
  if(msg === '#checkout' || msg === '#checkin') {
    let status = msg === '#checkout' ? 'checkout' : 'checkin'
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer {${access_token}}`
    }
    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [{
          type: 'text',
          text: msg
        }
        ]
    })
    request.post({
      url:'https://hr-terrabit-uat.demo1.webcontrol.com/app/branch1/api.php',
      headers: {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'
      },
      formData: {
        actionstate:status,
        employee:'29',
        in_time:'',
        latitude:'13.7456517',
        longitude:'100.5408732'
      }
    }, (err,res,body)=> {
      try {
        request.post({
            url: 'https://api.line.me/v2/bot/message/reply',
            headers: headers,
            body: JSON.stringify({
              replyToken: reply_token,
              messages: [{
                type: 'text',
                text: status === 'checkin' ? JSON.parse(res.body).logtime : res.body
              }
              ]
          })
        }, (err, res, body) => {
          try {
            console.log(res,body,err)
          } catch (err) {
            console.err
          }
            console.log('status = ' + res.statusCode);
        });
      } catch (error) {
        request.post({
          url: 'https://api.line.me/v2/bot/message/reply',
          headers: headers,
          body: JSON.stringify(err)
        }, (err, res, body) => {
          try {
            console.log(res,body,err)
          } catch (err) {
            console.err
          }
            console.log('status = ' + res.statusCode);
        });
      }
    })
  }
}