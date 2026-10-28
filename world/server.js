const http=require('http'),fs=require('fs'),path=require('path');
const {WebSocketServer,WebSocket}=require('ws');
const {createClient}=require('@supabase/supabase-js');
const root=path.join(__dirname,'public');
const SUPABASE_URL=process.env.SUPABASE_URL||'https://zklsggugbqasamvpumgw.supabase.co';
const SUPABASE_KEY=process.env.SUPABASE_ANON_KEY||process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_rt6xbelrp6IJ5zvJfkoC5w_eeMqzG4G';
const supabaseServer=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{autoRefreshToken:false,persistSession:false}});
const MAX_PLAYERS=50;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.json':'application/json; charset=utf-8'};
const srv=http.createServer((q,r)=>{
  const u=decodeURIComponent((q.url||'/').split('?')[0]);
  const p=path.resolve(root,'.'+(u==='/'?'/index.html':u));
  if(!p.startsWith(root+path.sep)&&p!==path.join(root,'index.html')){r.writeHead(403);return r.end('403')}
  fs.readFile(p,(e,d)=>{if(e){r.writeHead(404);return r.end('404')}
    r.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});r.end(d)})
});
const wss=new WebSocketServer({noServer:true,maxPayload:2048});let nextId=0;
const players=new Map();
function send(ws,obj){if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(obj))}
function broadcast(obj,except=null){const s=JSON.stringify(obj);for(const c of wss.clients)if(c!==except&&c.readyState===WebSocket.OPEN) c.send(s)}
srv.on('upgrade',async(req,socket,head)=>{
  try{
    const url=new URL(req.url,'http://localhost');const token=url.searchParams.get('token');
    if(!token){socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');socket.destroy();return}
    const {data,error}=await supabaseServer.auth.getUser(token);
    if(error||!data?.user){socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');socket.destroy();return}
    if(wss.clients.size>=MAX_PLAYERS){socket.write('HTTP/1.1 503 Service Unavailable\r\nRetry-After: 10\r\n\r\n');socket.destroy();return}
    wss.handleUpgrade(req,socket,head,ws=>{ws.user=data.user;wss.emit('connection',ws,req)});
  }catch(e){socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');socket.destroy()}
});
wss.on('connection',ws=>{
  ws.id=String(++nextId);ws.lastState=null;ws.lastMessageAt=0;
  // Send already-present players to the newly connected player.
  for(const [id,state] of players)send(ws,{...state,id});
  ws.on('message',raw=>{
    const now=Date.now();if(now-ws.lastMessageAt<45)return;ws.lastMessageAt=now;
    let m;try{m=JSON.parse(raw)}catch{return}if(m.t!=='s')return;
    const n=String(m.n||ws.user.user_metadata?.username||ws.user.email?.split('@')[0]||'لاعب').replace(/[<>\u0000-\u001f]/g,'').slice(0,16);
    const color=v=>/^#[0-9a-fA-F]{3,8}$/.test(String(v||''))?String(v):'#f1c27d';
    const o={t:'s',id:ws.id,uid:ws.user.id,x:Math.max(4,Math.min(796,Number(m.x)||380)),y:Math.max(60,Math.min(505,Number(m.y)||200)),n,skin:color(m.skin),hair:color(m.hair),sh:color(m.sh),hat:String(m.hat||'').slice(0,4),ch:Math.max(0,Math.min(3,Number(m.ch)|0)),sit:(Number(m.sit)>=0&&Number(m.sit)<9)?Number(m.sit)|0:-1,say:String(m.say||'').replace(/[<>\u0000-\u001f]/g,'').slice(0,60),age:Math.max(0,Math.min(10000,Number(m.age)||0))};
    ws.lastState=o;players.set(ws.id,o);broadcast(o,ws);
  });
  ws.on('close',()=>{players.delete(ws.id);broadcast({t:'l',id:ws.id})});
  ws.on('error',()=>{});
});
const port=Number(process.env.PORT)||3000;
srv.listen(port,()=>console.log(`World server listening on port ${port}; authenticated multiplayer max=${MAX_PLAYERS}`));
