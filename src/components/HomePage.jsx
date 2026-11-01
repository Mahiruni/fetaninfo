import { Component, lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, ChevronRight, Radio, ShieldCheck, Trophy, Newspaper, Star, Clock3 } from 'lucide-react';
import { apiFetch } from '../api';

const MatchCenter=lazy(()=>import('./MatchCenter'));
const CompetitionHub=lazy(()=>import('./CompetitionHub'));
const NewsHub=lazy(()=>import('./NewsHub'));

const LIVE=new Set(['LIVE','1H','HT','2H','ET','P','BT']);
const FINISHED=new Set(['FT','AET','PEN']);
const dateInAddis=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Addis_Ababa',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const statusOf=m=>String(m.status||'').toUpperCase();
const teamName=(m,side)=>String(m[side+'_en']||m[side+'Team']?.name||m[side+'_team']?.name||m[side+'_team_name']||m[side]||'TBD');
const score=(m,side)=>m[side+'_score']??m[side+'Score']??m.score?.[side]??'–';

class SafeSection extends Component{
 constructor(props){super(props);this.state={failed:false}}
 static getDerivedStateFromError(){return{failed:true}}
 componentDidCatch(error){console.error('FETAN section failed',error)}
 render(){return this.state.failed?<div className="fetan-section-error" role="status">This section is temporarily unavailable. <button onClick={()=>window.location.reload()}>Retry</button></div>:this.props.children}
}
function Spotlight(){
 const [data,setData]=useState({loading:true,matches:[],error:false});
 useEffect(()=>{let alive=true;apiFetch('/matches?date='+dateInAddis()+'&league=english-premier-league').then(res=>{if(alive)setData({loading:false,matches:Array.isArray(res)?res:[],error:false})}).catch(()=>{if(alive)setData({loading:false,matches:[],error:true})});return()=>{alive=false}},[]);
 const match=data.matches.find(m=>LIVE.has(statusOf(m)))||data.matches.find(m=>!FINISHED.has(statusOf(m)))||data.matches[0];
 const live=match&&LIVE.has(statusOf(match));
 return <section className="fetan-spotlight" aria-labelledby="fetan-hero-title">
   <div className="fetan-spotlight-copy">
     <div className="fetan-kicker"><span className="fetan-kicker-dot"/> THE GLOBAL FOOTBALL DESK <span className="fetan-kicker-line"/></div>
     <h1 id="fetan-hero-title">Every match.<br/><em>Every moment.</em></h1>
     <p>The game never stops. Follow verified scores, fixtures and the stories shaping world football—built for fans everywhere.</p>
     <div className="fetan-hero-actions"><a href="#scores" className="fetan-primary-cta"><Radio size={17}/> Explore match center <ArrowUpRight size={17}/></a><Link to="/news" className="fetan-secondary-cta">Explore stories <ChevronRight size={17}/></Link></div>
     <div className="fetan-hero-trust"><ShieldCheck size={15}/> Real match data · Africa/Addis_Ababa time · No invented scores</div>
   </div>
   <div className="fetan-spotlight-panel">
     <div className="fetan-panel-top"><span><span className="fetan-kicker-dot"/> MATCHDAY PULSE</span><span>{new Intl.DateTimeFormat('en',{timeZone:'Africa/Addis_Ababa',day:'numeric',month:'short'}).format(new Date())} · EAT</span></div>
     {data.loading?<div className="fetan-pulse-empty" aria-busy="true"><div className="fetan-skeleton"/><div className="fetan-skeleton short"/><p>Checking matchday fixtures…</p></div>:match?<div className="fetan-feature-match">
       <div className="fetan-match-status">{live?'● LIVE':FINISHED.has(statusOf(match))?'FULL TIME':'MATCHDAY FIXTURE'}</div>
       <div className="fetan-feature-teams"><div><span className="fetan-team-initial">{teamName(match,'home').slice(0,2).toUpperCase()}</span><strong>{teamName(match,'home')}</strong></div><div className="fetan-feature-score">{live||FINISHED.has(statusOf(match))?<>{score(match,'home')} <span>:</span> {score(match,'away')}</>:<span>VS</span>}</div><div><span className="fetan-team-initial">{teamName(match,'away').slice(0,2).toUpperCase()}</span><strong>{teamName(match,'away')}</strong></div></div>
       <Link to={match.id?'/match/'+encodeURIComponent(match.id):'/'} className="fetan-panel-link">{match.id?'Open match details':'View matchday fixtures'} <ArrowUpRight size={16}/></Link>
     </div>:<div className="fetan-pulse-empty"><CalendarDays size={34}/><strong>{data.error?'Match feed temporarily unavailable':'No Premier League fixtures listed today'}</strong><p>{data.error?'Check the match center for other available competitions.':'Explore other competitions and upcoming matchdays below.'}</p><a href="#scores">Open match center <ArrowUpRight size={14}/></a></div>}
     <div className="fetan-panel-bottom"><span>FETAN / FOOTBALL INTELLIGENCE</span><span>01 — 03</span></div>
   </div>
 </section>;
}
function FeaturedClubs(){
 const [clubs,setClubs]=useState([]);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;const leagues=['english-premier-league','la-liga','serie-a','bundesliga','ligue-1'];Promise.allSettled(leagues.map(league=>apiFetch('/club-crests?league='+league))).then(results=>{if(!active)return;const seen=new Set();const next=[];results.forEach((result,index)=>{if(result.status!=='fulfilled'||!Array.isArray(result.value))return;for(const club of result.value){if(!club?.name||seen.has(club.id||club.name.toLowerCase()))continue;seen.add(club.id||club.name.toLowerCase());next.push({id:club.id,name:club.name,logo:club.logo,league:leagues[index]})}});setClubs(next)}).catch(()=>{}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 const renderClub=(club,index,copy)=> <div className="fetan-featured-club" key={copy+'-'+(club.id||club.league+club.name)+'-'+index}>{club.logo?<img src={club.logo} alt={copy===0?club.name+' crest':''} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.display='none';e.currentTarget.nextElementSibling.hidden=false}}/>:null}<span className="fetan-featured-club-fallback" hidden={Boolean(club.logo)}>{club.name.slice(0,2).toUpperCase()}</span><small>{club.name}</small></div>;
 return <div className="fetan-featured-clubs" aria-label="Club crests across the five major European football leagues">{clubs.length?<div className="fetan-featured-clubs-viewport"><div className="fetan-featured-clubs-track" style={{'--fetan-crest-duration':Math.max(28,clubs.length*3.2)+'s'}}><div className="fetan-featured-clubs-set">{clubs.map((club,index)=>renderClub(club,index,0))}</div><div className="fetan-featured-clubs-set" aria-hidden="true">{clubs.map((club,index)=>renderClub(club,index,1))}</div></div></div>:<span className="fetan-featured-clubs-status">{loading?'Loading club crests…':'Club crests temporarily unavailable'}</span>}</div>;
}

function EditorialLead({lang}){
 const [story,setStory]=useState(null);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;apiFetch('/news').then(items=>{if(active&&Array.isArray(items))setStory(items.find(item=>item&&item.slug&&!item.demo)||null)}).catch(()=>{}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 const title=story?(lang==='am'?(story.titleAm||story.titleEn):(story.titleEn||story.titleAm)):'The world’s game. One destination.';
 const summary=story?(lang==='am'?(story.summaryAm||story.summaryEn):(story.summaryEn||story.summaryAm)):'Breaking football stories, live match intelligence and every moment that matters. All in one place.';
 return <section className="fetan-editorial-hero" aria-labelledby="fetan-editorial-title">
  <div className="fetan-editorial-visual fetan-fire-stage" aria-hidden="true"><div className="fetan-editorial-halo"/><div className="fetan-fire-glow"/><div className="fetan-fire-plume plume-one"/><div className="fetan-fire-plume plume-two"/><div className="fetan-fire-plume plume-three"/><div className="fetan-fire-embers"/><div className="fetan-editorial-glyph">F<span>.</span></div><div className="fetan-editorial-grid"/></div>
  <div className="fetan-editorial-content">
   {story&&<span className="fetan-editorial-label"><span className="fetan-kicker-dot"/> THE LATEST / VERIFIED NEWS</span>}
   <h1 id="fetan-editorial-title">{title}</h1>
   <p>{summary}</p>
   <div className="fetan-editorial-actions">{story?<Link className="fetan-primary-cta" to={'/news/'+story.slug}>Read the story <ArrowUpRight size={17}/></Link>:<Link className="fetan-primary-cta" to="/news">Explore the newsroom <ArrowUpRight size={17}/></Link>}<a href="#scores" className="fetan-secondary-cta">Live match center <Radio size={17}/></a></div>
   <FeaturedClubs/>
   <div className="fetan-editorial-meta"><ShieldCheck size={14}/>{story?(story.source||'FETAN NEWSROOM'):'Football, without the noise.'}{loading?' · Updating desk…':''}</div>
  </div>
 </section>;
}
function FavoriteEntry(){
 const [club,setClub]=useState(()=>{try{return localStorage.getItem('fetan_favorite_club')||''}catch{return ''}});
 const [editing,setEditing]=useState(false);
 const [draft,setDraft]=useState(club);
 function save(e){e.preventDefault();const clean=draft.trim().slice(0,60);try{if(clean)localStorage.setItem('fetan_favorite_club',clean);else localStorage.removeItem('fetan_favorite_club')}catch{}setClub(clean);setEditing(false)}
 return <section className="fetan-favorites-entry"><div className="fetan-favorites-icon"><Star size={21}/></div><div><span>03 / YOUR FOOTBALL</span><h2>{club?'Following '+club:'Make FETAN yours.'}</h2><p>{club?'Your favorite club is saved on this device. Personalized fixtures and alerts are coming next.':'Start with your favorite club. A personal football experience begins here.'}</p></div>{editing?<form onSubmit={save} className="fetan-favorite-form"><input aria-label="Favorite club" maxLength={60} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Your favorite club"/><button type="submit">Save</button></form>:<button className="fetan-favorite-button" onClick={()=>{setDraft(club);setEditing(true)}}>{club?'Edit favorite':'Choose a club'} <ArrowUpRight size={15}/></button>}</section>;
}
export default function HomePage({lang='en',onNeedAuth}){
 return <main className="fetan-home">
   <EditorialLead lang={lang}/>
   <div className="fetan-section-index"><span>01 / THE MATCH CENTER</span><span>LIVE · FIXTURES · RESULTS</span></div>
   <SafeSection><Suspense fallback={<div className="fetan-section-loading" aria-busy="true">Loading verified fixtures…</div>}><MatchCenter onNeedAuth={onNeedAuth}/></Suspense></SafeSection>
   <div className="fetan-section-index"><span>02 / THE COMPETITIONS</span><Link to="/competitions">EXPLORE ALL <ArrowUpRight size={13}/></Link></div>
   <SafeSection><Suspense fallback={null}><div className="page home-extras"><CompetitionHub lang={lang} compact/></div></Suspense></SafeSection>
   <div className="fetan-section-index"><span>03 / THE NEWSROOM</span><Link to="/news">READ STORIES <ArrowUpRight size={13}/></Link></div>
   <SafeSection><Suspense fallback={null}><div className="page home-extras"><NewsHub lang={lang} compact/></div></Suspense></SafeSection>
   <FavoriteEntry/>
   <section className="fetan-final-cta"><div><span>THE NEXT GENERATION OF FOOTBALL</span><h2>Football belongs to everyone.</h2><p>One destination for the matches, competitions and stories that matter.</p></div><Link to="/competitions">Explore football <Trophy size={18}/></Link></section>
 </main>;
}
