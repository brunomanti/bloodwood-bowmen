const fs = require('fs');
const path = require('path');
const Fastify = require('fastify');
const staticPlugin = require('@fastify/static');
const app = Fastify({logger:true});
const LOG_DIR = process.env.BLOODWOOD_LOG_DIR || path.join(__dirname,'..','logs');
fs.mkdirSync(LOG_DIR,{recursive:true});
function write(evt){
  const day = new Date().toISOString().slice(0,10);
  fs.appendFileSync(path.join(LOG_DIR, `${day}.ndjson`), JSON.stringify({...evt, serverAt:new Date().toISOString(), ip:evt.ip})+'\n');
}
app.addHook('onRequest', async (req)=>write({type:'http.request', method:req.method, url:req.url, headers:req.headers, ip:req.ip}));
app.post('/api/log', async (req, reply)=>{ const rows = String(req.body||'').split('\n').filter(Boolean); for(const row of rows){ try{write({type:'client.event', event:JSON.parse(row), ip:req.ip})}catch{write({type:'client.raw', raw:row, ip:req.ip})} } reply.code(204).send(); });
app.register(staticPlugin,{root:path.join(__dirname,'..'), prefix:'/'});
app.listen({port:Number(process.env.PORT||8080), host:'0.0.0.0'});
