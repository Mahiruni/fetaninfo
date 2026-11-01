import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const leagues=[['english-premier-league','Premier League'],['la-liga','La Liga'],['serie-a','Serie A'],['bundesliga','Bundesliga'],['ligue-1','Ligue 1']];
export default function SiteFooter(){
  return <footer className="fa-footer">
    <div className="fa-footer-top">
      <div className="fa-footer-brand">
        <span className="fa-footer-logo"><svg viewBox="0 0 24 32" width="16" height="22" fill="none"><path d="M14.5 1 3 17h8l-1.4 14L22 12h-8.1L14.5 1Z" fill="#fff"/></svg></span>
        <b>Fetan</b>
        <p>Live scores, fixtures and stories from the world’s biggest leagues — fast, clear and honest.</p>
        <Link to="/competitions" className="fa-footer-cta">Explore leagues <ArrowUpRight size={16}/></Link>
      </div>
      <nav aria-label="Product"><h4>Product</h4><Link to="/">Match center</Link><Link to="/competitions">Competitions</Link><Link to="/news">Newsroom</Link><Link to="/#community">Fan zone</Link></nav>
      <nav aria-label="Leagues"><h4>Leagues</h4>{leagues.map(([s,n])=><Link key={s} to={'/competition/'+s}>{n}</Link>)}</nav>
    </div>
    <div className="fa-footer-bottom"><span>© {new Date().getFullYear()} Fetan. Football, faster.</span><span>Times shown in Africa/Addis_Ababa · Scores are never invented</span></div>
  </footer>;
}
