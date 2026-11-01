'use strict';
const express=require('express'),{Pool}=require('pg');
const router=express.Router();let pool;
function db(){if(!process.env.DATABASE_URL)return null;return pool||(pool=new Pool({connectionString:process.env.DATABASE_URL,max:3,connectionTimeoutMillis:4000}))}
const run=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.get('/status',(req,res)=>res.json({engine:'FETAN',databaseConfigured:!!process.env.DATABASE_URL,ingestionConfigured:!!process.env.FETAN_INGEST_SECRET}));
router.get('/articles',run(async(req,res)=>{if(!db())return res.status(503).json({error:'Database not configured'});const {rows}=await db().query("SELECT slug,title,summary,author_name,published_at FROM fetan_articles WHERE status='published' ORDER BY published_at DESC LIMIT 30");res.json({articles:rows})}));
router.get('/fixtures',run(async(req,res)=>{if(!db())return res.status(503).json({error:'FETAN database connection not configured'});const {rows}=await db().query("SELECT m.id,m.kickoff_at,m.status,m.home_score,m.away_score,c.name AS competition,h.name AS home_team,a.name AS away_team,m.verified_at FROM fetan_matches m JOIN fetan_competitions c ON c.id=m.competition_id JOIN fetan_teams h ON h.id=m.home_team_id JOIN fetan_teams a ON a.id=m.away_team_id WHERE m.verified_at IS NOT NULL AND m.kickoff_at BETWEEN NOW()-INTERVAL '7 days' AND NOW()+INTERVAL '14 days' ORDER BY m.kickoff_at LIMIT 150");res.json({fixtures:rows,source:'FETAN verified database'})}));
// Provider ingestion remains disabled until licensed-source validation and a matching schema are deployed.
router.post('/ingest/fixture',(_req,res)=>res.status(501).json({error:'Verified ingestion pipeline not configured'}));
router.use((err,req,res,next)=>{console.error('FETAN engine',err.message);res.status(500).json({error:'Data service unavailable'})});
module.exports=router;
