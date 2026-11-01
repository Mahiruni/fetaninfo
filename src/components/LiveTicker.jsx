import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';

const LIVE=new Set(['LIVE','1H','HT','2H','ET','P','BT']);
const DONE=new Set(['FT','AET','PEN']);
const day=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Addis_Ababa'}).format(new Date());
const clock=d=>d?new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Africa/Addis_Ababa'}).format(new Date(d)):'TBD';

export default function LiveTicker({fallback}){
  const [rows,setRows]=useState([]);
  useEffect(()=>{
    let on=true;
    const load=()=>apiFetch('/matches?date='+day()+'&league=english-premier-league').then(r=>{if(on&&Array.isArray(r))setRows(r.filter(m=>m&&m.home_en&&m.away_en).slice(0,12))}).catch(()=>{});
    load();const t=setInterval(load,30000);
    return()=>{on=false;clearInterval(t)};
  },[]);
  if(!rows.length)return fallback||null;
  const anyLive=rows.some(m=>LIVE.has(String(m.status).toUpperCase()));
  const item=(m,k)=>{
    const s=String(m.status).toUpperCase();const live=LIVE.has(s);const done=DONE.has(s);const scored=live||done;
    return <Link key={k} to={'/match/'+encodeURIComponent(m.id)} className={'fa-tick'+(live?' live':'')}>
      <span className="fa-tick-state">{live?(s==='HT'?'HT':(m.current_minute||0)+'′'):done?'FT':clock(m.match_date)}</span>
      <span className="fa-tick-team">{m.home_en}</span>
      <b className="fa-tick-score">{scored?`${m.home_score??0} – ${m.away_score??0}`:'vs'}</b>
      <span className="fa-tick-team">{m.away_en}</span>
    </Link>;
  };
  return <div className="fa-ticker" role="region" aria-label="Live scores">
    <span className={'fa-ticker-tag'+(anyLive?' live':'')}><i/>{anyLive?'LIVE':'TODAY'}</span>
    <div className="fa-ticker-viewport"><div className="fa-ticker-track">{rows.map((m,i)=>item(m,'a'+i))}{rows.map((m,i)=>item(m,'b'+i))}</div></div>
  </div>;
}
