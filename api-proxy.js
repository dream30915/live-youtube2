/*
 Simple API proxy + parsers
*/
const express2 = require('express');
const fetch = require('node-fetch');
const NodeCache2 = require('node-cache');
const cors2 = require('cors');
const fs2 = require('fs');
const path2 = require('path');
const app2 = express2();
const cache2 = new NodeCache2({ stdTTL: 5 });
app2.use(cors2());
const LOG_DIR2 = path2.join(__dirname,'logs'); if(!fs2.existsSync(LOG_DIR2)) fs2.mkdirSync(LOG_DIR2);
function log2(n,msg){ fs2.appendFileSync(path2.join(LOG_DIR2,n),`[${new Date().toISOString()}] ${msg}\n`); }

const API_MAP = {
  laos: 'https://www.laolottery.gov.la/',
  nikkei: 'https://indexes.nikkei.co.jp/nkave',
  xsmb: 'https://xsmb.me/',
  sse: 'https://www.sse.com.cn/marketdata/',
  hsi: 'https://www.hsi.com.hk/eng/market-data/indices/hsi',
  twse: 'https://www.twse.com.tw/rwd/zh/TAIEX/index'
};

app2.get('/_health',(req,res)=>res.json({ok:true}));
app2.get('/fetch', async (req,res)=>{
  const key = req.query.key; if(!key) return res.status(400).send('key required');
  const url = API_MAP[key]; if(!url) return res.status(404).send('unknown key');
  try{
    const cached = cache2.get(key); if(cached) return res.json(cached);
    const r = await fetch(url, { timeout:10000 });
    const ct = r.headers.get('content-type')||'';
    if(ct.includes('application/json')){ const j = await r.json(); cache2.set(key,j); return res.json(j); }
    const text = await r.text(); cache2.set(key,{html:text}); return res.json({html:text});
  }catch(e){ log2('api.log', `fetch error ${key} ${e.message}`); console.error(e); res.status(500).send('fetch error'); }
});

const PORT2 = process.env.PORT || 4100;
app2.listen(PORT2, ()=>console.log('api proxy running on', PORT2));
