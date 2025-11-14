/* Puppeteer Snapshot Proxy - PRO
 - Reuse browser instance
 - Auto-switch executable (Chrome/Edge) if headless blocked
 - Cache snapshots
 - Health endpoint
 - Basic logging to logs/
*/
const express = require('express');
const NodeCache = require('node-cache');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const app = express();
app.use(cors());
const cache = new NodeCache({ stdTTL: 300 });
const LOG_DIR = path.join(__dirname, 'logs'); if(!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);
function log(name,msg){ fs.appendFileSync(path.join(LOG_DIR,name),`[${new Date().toISOString()}] ${msg}\n`); }

const MAP = {
  laos: 'https://www.laolottery.gov.la/',
  nikkei_vip: 'https://indexes.nikkei.co.jp/nkave',
  nikkei_std: 'https://indexes.nikkei.co.jp/nkave',
  hanoi_asia: 'https://xsmb.me/',
  sse_vip: 'https://www.sse.com.cn/',
  sse_std: 'https://www.sse.com.cn/',
  hsi_vip: 'https://www.hsi.com.hk/eng/index',
  hsi_std: 'https://www.hsi.com.hk/eng/index',
  hanoi_hd: 'https://xsmb.me/',
  twse_vip: 'https://www.twse.com.tw/en/'
};

const DEFAULT_EXECUTABLES = [
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

let _browser = null;
let opts = { headless: true, args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'] };

async function launchBrowser(){
  for(const exe of DEFAULT_EXECUTABLES){
    try{
      const probeOpts = Object.assign({}, opts, { executablePath: exe });
      log('browser.log', `Trying launch with ${exe}`);
      const b = await puppeteer.launch(probeOpts);
      const p = await b.newPage();
      await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
      await p.goto('https://www.google.com', { waitUntil:'domcontentloaded', timeout:10000 }).catch(e=>{});
      const ua = await p.evaluate(()=>navigator.userAgent || '');
      await p.close();
      log('browser.log', `Launched using ${exe} (ua:${ua})`);
      return b;
    }catch(e){ log('browser.log', `launch failed ${exe} - ${e.message}`); }
  }
  log('browser.log', 'Falling back to bundled Chromium');
  _browser = await puppeteer.launch(opts);
  return _browser;
}

app.get('/_health', (req,res)=>{
  res.json({ok:true});
});

app.get('/snapshot', async (req,res)=>{
  const key = req.query.key; if(!key) return res.status(400).send('key required');
  if(!MAP[key]) return res.status(404).send('unknown key');
  try{
    const cached = cache.get(key); if(cached){ res.set('Content-Type','image/png'); return res.send(Buffer.from(cached,'base64')); }
    if(!_browser) _browser = await launchBrowser();
    const page = await _browser.newPage();
    await page.setViewport({width:800,height:450});
    await page.setUserAgent(process.env.SNAPSHOT_UA || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    const url = MAP[key];
    log('snapshot.log', `navigating ${url}`);
    await page.goto(url, { waitUntil:'networkidle2', timeout:25000 }).catch(e=>{ log('snapshot.log','goto error:'+e.message); });
    await page.waitForTimeout(process.env.SNAPSHOT_WAIT_MS?parseInt(process.env.SNAPSHOT_WAIT_MS):900);
    const buffer = await page.screenshot({ type:'png', fullPage:false });
    cache.set(key, buffer.toString('base64'));
    res.set('Content-Type','image/png'); res.send(buffer);
    await page.close();
    log('snapshot.log', `snapshot ${key} done`);
  }catch(e){ log('snapshot.log', 'snapshot error '+e.message); console.error(e); res.status(500).send('snapshot error'); }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('puppeteer-proxy running on', PORT));

process.on('SIGINT', async ()=>{ try{ if(_browser){ await _browser.close(); } }catch(e){} process.exit(0); });
