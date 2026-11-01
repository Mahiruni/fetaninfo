import { useState } from 'react';
import { Bell, Languages, UserRound, ArrowUpRight, Menu, X, Search, Radio, Trophy, Newspaper, Users } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Avatar from './Avatar';
import LiveTicker from './LiveTicker';
import { useAuth } from '../context/AuthContext';
export default function Header({lang,onToggleLang,onAuth,onProfile}){
 const {user}=useAuth();const [menuOpen,setMenuOpen]=useState(false);const location=useLocation();
 const nav=[{to:'/',label:'Match center',icon:Radio},{to:'/competitions',label:'Competitions',icon:Trophy},{to:'/news',label:'Newsroom',icon:Newspaper},{to:'/#community',label:'Fan zone',icon:Users}];
 const close=()=>setMenuOpen(false);
 return <>
 <header className="topbar fetan-global-header"><div className="topbar-inner">
  <Link className="brand" to="/" onClick={close} aria-label="FETAN football home"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 32" width="19" height="26" fill="none"><path d="M14.5 1 3 17h8l-1.4 14L22 12h-8.1L14.5 1Z" fill="#F31F55"/></svg></span><span className="brand-wordmark"><span className="brand-name">Fetan</span><span className="brand-tagline">Global football live</span></span></Link>
  <nav className="fetan-header-links" aria-label="Primary navigation">{nav.map(n=><NavLink key={n.label} end={n.to==='/'} to={n.to} className={({isActive})=>'fetan-header-link '+(isActive?'active':'')}>{n.label}</NavLink>)}</nav>
  <div className="header-actions"><Link className="fetan-header-search" to="/competitions" aria-label="Explore football"><Search size={18}/></Link><button type="button" className="icon-btn" onClick={onToggleLang} aria-label="Switch language"><Languages size={17}/><span className="action-label">{lang==='en'?'አማ':'EN'}</span></button>{user?<button type="button" className="profile-chip" onClick={onProfile} aria-label="Open profile"><Avatar seed={user.avatar_seed||user.username} size={30}/><span>{user.display_name||user.username}</span><Bell size={14}/></button>:<button type="button" className="signin-btn" onClick={onAuth}><UserRound size={16}/> Sign in</button>}<button type="button" className="fetan-menu-toggle" aria-label={menuOpen?'Close navigation':'Open navigation'} aria-expanded={menuOpen} aria-controls="fetan-navigation-drawer" onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?<X size={24}/>:<Menu size={24}/>}</button></div>
 </div></header>
 <LiveTicker fallback={<div className="fetan-broadcast-bar"><span><i/> FETAN / MATCHDAY</span><span>THE WORLD'S GAME. YOUR FRONT ROW.</span><Link to="/#scores">MATCH CENTER <ArrowUpRight size={13}/></Link></div>}/>
 {menuOpen&&<div className="fetan-drawer-backdrop" onClick={close}><nav id="fetan-navigation-drawer" className="fetan-drawer" aria-label="Mobile navigation" onClick={e=>e.stopPropagation()}><div className="fetan-drawer-head"><b>EXPLORE FETAN</b><button onClick={close} aria-label="Close menu"><X size={21}/></button></div>{nav.map(n=><Link to={n.to} key={n.label} onClick={close} className={location.pathname===n.to?'selected':''}><n.icon size={20}/><span>{n.label}</span><ArrowUpRight size={16}/></Link>)}<div className="fetan-drawer-foot">GLOBAL FOOTBALL. REIMAGINED.</div></nav></div>}
 </>;
}