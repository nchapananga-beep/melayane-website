const COLUNAS = ['ID','Data','Nome','Email','Telefone','Servico','Mensagem','Estado'];
const SERVICOS = ['Software de gestão MELAYANE','Soluções digitais à medida','Organização de processos'];
function configurarMelayane_() {
  const p = PropertiesService.getScriptProperties();
  const email = Session.getEffectiveUser().getEmail();
  if (!email) throw new Error('Execute a configuração no editor, com a sua conta Google.');
  let id = p.getProperty('PEDIDOS_SHEET_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create('MELAYANE — Pedidos do website');
  let sh = ss.getSheetByName('Pedidos');
  if (!sh) { sh = ss.insertSheet('Pedidos'); sh.appendRow(COLUNAS); sh.setFrozenRows(1); sh.getRange('A1:H1').setFontWeight('bold').setBackground('#102a3b').setFontColor('#ffffff'); }
  p.setProperties({PEDIDOS_SHEET_ID:ss.getId(),ADMIN_EMAIL:email});
  console.log('Planilha privada: '+ss.getUrl());
}
function folha_() {
  const id=PropertiesService.getScriptProperties().getProperty('PEDIDOS_SHEET_ID');
  if (!id) throw new Error('MELAYANE — Configuração pendente.');
  return SpreadsheetApp.openById(id).getSheetByName('Pedidos');
}
function admin_() {
  const permitido=PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL');
  const actual=Session.getActiveUser().getEmail();
  if (!actual || !permitido || actual.toLowerCase()!==permitido.toLowerCase()) throw new Error('MELAYANE — Acesso reservado à administração.');
}
function doGet(e) {
  if(e && e.parameter && e.parameter.admin==='1') {
    try { admin_(); return HtmlService.createHtmlOutputFromFile('Admin').setTitle('MELAYANE — Administração'); }
    catch(err) { return HtmlService.createHtmlOutput('Acesso reservado. Abra a implantação privada com a conta administradora.'); }
  }
  return HtmlService.createHtmlOutputFromFile('Form').setTitle('MELAYANE — Pedido de contacto');
}
function texto_(v,max) { const s=String(v||'').trim(); if(s.length>max) throw new Error('MELAYANE — Texto demasiado longo.'); return s; }
function seguro_(v) { return /^[=+@-]/.test(v) ? "'"+v : v; }
function enviarPedido(d) {
  if(!d || d.website) throw new Error('MELAYANE — Pedido inválido.');
  const nome=texto_(d.nome,120), email=texto_(d.email,180), tel=texto_(d.telefone,40), servico=texto_(d.servico,100), msg=texto_(d.mensagem,2500);
  if(!nome || !msg || (!email && !tel) || !SERVICOS.includes(servico) || d.consentimento!==true) throw new Error('MELAYANE — Preencha os campos obrigatórios e autorize o contacto.');
  if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('MELAYANE — Email inválido.');
  const lock=LockService.getScriptLock(); lock.waitLock(15000);
  try {
    const cache=CacheService.getScriptCache();
    const key=Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,[nome,email,tel,servico,msg].join('|')));
    const anterior=cache.get(key);
    if(anterior) return {id:anterior};
    const sh=folha_(), rows=sh.getLastRow();
    if(rows>1) {
      const recentes=sh.getRange(Math.max(2,rows-99),2,Math.min(rows-1,100),1).getValues();
      if(recentes.filter(r=>Date.now()-new Date(r[0]).getTime()<3600000).length>=100) throw new Error('MELAYANE — Serviço temporariamente ocupado. Contacte-nos por WhatsApp.');
    }
    const id=Utilities.getUuid();
    sh.appendRow([id,new Date(),nome,email,tel,servico,msg,'Novo'].map(v=>typeof v==='string'?seguro_(v):v));
    cache.put(key,id,600);
    return {id:id};
  } finally { lock.releaseLock(); }
}
function listarPedidos() {
  admin_();
  const values=folha_().getDataRange().getValues().slice(1);
  return values.reverse().map(r=>({id:r[0],data:r[1] instanceof Date?r[1].toISOString():String(r[1]),nome:r[2],email:r[3],telefone:r[4],servico:r[5],mensagem:r[6],estado:r[7]}));
}
function actualizarEstado(id,estado) {
  admin_();
  if(!['Novo','Em atendimento','Concluído'].includes(estado)) throw new Error('Estado inválido.');
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try {
    const sh=folha_(), ids=sh.getRange(2,1,Math.max(1,sh.getLastRow()-1),1).getValues();
    const i=ids.findIndex(r=>r[0]===id);
    if(i<0) throw new Error('Pedido não encontrado.');
    sh.getRange(i+2,8).setValue(estado);return true;
  } finally {lock.releaseLock();}
}
