import { MessageCircle, Newspaper, Radio, Trophy, UserRound } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BottomNav({ onProfile, onAuth }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const goCommunity = () => {
    if (location.pathname !== '/') navigate('/#community');
    else document.getElementById('community')?.scrollIntoView({ behavior:'smooth', block:'start' });
  };
  const active = path => location.pathname===path||(path!=='/'&&location.pathname.startsWith(path));
  return <nav className="bottom-nav" aria-label="Mobile navigation">
    <button type="button" aria-label="Match center" aria-current={active('/')?'page':undefined} onClick={()=>navigate('/')} className={active('/')?'active':''}><Radio size={24} strokeWidth={2.1}/><span className="bn-label">Matches</span></button>
    <button type="button" aria-label="International leagues" aria-current={active('/competition')||active('/competitions')?'page':undefined} onClick={()=>navigate('/competitions')} className={active('/competition')||active('/competitions')?'active':''}><Trophy size={24} strokeWidth={2.1}/><span className="bn-label">Leagues</span></button>
    <button type="button" aria-label="Football stories" aria-current={active('/news')?'page':undefined} onClick={()=>navigate('/news')} className={active('/news')?'active':''}><Newspaper size={24} strokeWidth={2.1}/><span className="bn-label">Stories</span></button>
    <button type="button" aria-label="Fan discussion" onClick={goCommunity}><MessageCircle size={24} strokeWidth={2.1}/><span className="bn-label">Fan zone</span></button>
    <button type="button" aria-label={user?'Open profile':'Sign in'} onClick={user?onProfile:onAuth}><UserRound size={24} strokeWidth={2.1}/><span className="bn-label">{user?'Profile':'Account'}</span></button>
  </nav>;
}
