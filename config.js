/*
 CONFIG: snapshotBase and apiBase (proxy endpoints you will run locally)
 tiles: snapshotKey + apiKey mapping
*/
window.CONFIG = {
  snapshotBase: 'http://localhost:4000/snapshot',
  apiBase: 'http://localhost:4100/fetch',
  snapshotIntervalMs: 5 * 60 * 1000, // 5 minutes
  apiIntervalMs: 10 * 1000, // 10 seconds
  tiles: [
    {code:'laos', title:'ลาวExtar', flag:'🇱🇦', time:'เวลาออกผล 08.30 น.', snapshotKey:'laos', apiKey:'laos'},
    {code:'jp_vip', title:'นิเคอิเช้า VIP', flag:'🇯🇵', time:'เวลาออกผล 09.05 น.', snapshotKey:'nikkei_vip', apiKey:'nikkei'},
    {code:'jp', title:'นิเคอิเช้า', flag:'🇯🇵', time:'เวลาออกผล 09.30 น.', snapshotKey:'nikkei_std', apiKey:'nikkei'},
    {code:'vn_asia', title:'ฮานอยอาเซียน', flag:'🇻🇳', time:'เวลาออกผล 09.30 น.', snapshotKey:'hanoi_asia', apiKey:'xsmb'},
    {code:'cn_vip', title:'จีนเช้า VIP', flag:'🇨🇳', time:'เวลาออกผล 10.05 น.', snapshotKey:'sse_vip', apiKey:'sse'},
    {code:'cn', title:'จีนเช้า', flag:'🇨🇳', time:'เวลาออกผล 10.30 น.', snapshotKey:'sse_std', apiKey:'sse'},
    {code:'hk_vip', title:'ฮั่งเส็ง VIP', flag:'🇭🇰', time:'เวลาออกผล 10.35 น.', snapshotKey:'hsi_vip', apiKey:'hsi'},
    {code:'hk', title:'ฮั่งเส็งเช้า', flag:'🇭🇰', time:'เวลาออกผล 11.06 น.', snapshotKey:'hsi_std', apiKey:'hsi'},
    {code:'vn_hd', title:'ฮานอยHD', flag:'🇻🇳', time:'เวลาออกผล 11.30 น.', snapshotKey:'hanoi_hd', apiKey:'xsmb'},
    {code:'tw_vip', title:'ไต้หวันVIP', flag:'🇹🇼', time:'เวลาออกผล 11.35 น.', snapshotKey:'twse_vip', apiKey:'twse'}
  ]
};

window.PARSERS = {
  nikkei: function(j){ if(j && j.NK225) return {main:String(j.NK225), sub:j.change||'--'}; const s=JSON.stringify(j);const m=s.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?/g); return {main:m?m[0]:'--', sub:'--'}; },
  sse: function(j){ if(j && j.index) return {main:String(j.index), sub:j.change||'--'}; const s=JSON.stringify(j);const m=s.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?/g); return {main:m?m[0]:'--', sub:'--'}; },
  hsi: function(j){ if(j && j.latestIndex) return {main:String(j.latestIndex), sub:j.change||'--'}; const s=JSON.stringify(j);const m=s.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?/g); return {main:m?m[0]:'--', sub:'--'}; },
  twse: function(j){ if(j && j.Indices && j.Indices.TAIEX) return {main:String(j.Indices.TAIEX), sub:'--'}; const s=JSON.stringify(j);const m=s.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?/g); return {main:m?m[0]:'--', sub:'--'}; },
  xsmb: function(j){ const s=JSON.stringify(j); const m=s.match(/\b(\d{5})\b/); return {main:m?m[1]:'--', sub:'--'}; },
  laos: function(j){ const s=JSON.stringify(j); const m=s.match(/\b(\d{4,6})\b/); return {main:m?m[0]:'--', sub:'--'}; }
};
