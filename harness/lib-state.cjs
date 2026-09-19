// Shared seed builder: board order, the clue each lead grants, and a state
// factory so every capture starts from a plausible point in a real run.
const A=['A1','A2','A3','A4','A6','A7','A8','A9','A11','A12','A13']
const B=['B1','B2','B4','B5','B7','B8','B11','B12']
const C=['C1','C2','C3','C4','C9','C5','C6','C7','C8']
const ALL=[...A,...B,...C]
// lead -> clue, in board order
const GRANTS=[['A1','corey_flickr'],['A2','insider'],['A3','deleted'],['A4','flickr_gps'],['A6','domain_tweet'],
['A7','shield'],['A8','arts_domain'],['A9','nightwatch'],['A11','postbox'],['A12','whois'],['A13','corey_alibi'],
['B1','burned_page'],['B2','no_source'],['B4','sealed'],['B5','priya_words'],['B7','wayback_index'],['B8','html_author'],
['B11','key_wifi'],['B12','draft'],['C1','map_three'],['C2','table_sign'],['C3','building_owner'],['C4','courier'],
['C9','same_room'],['C5','registry'],['C6','court'],['C7','chain_sheet'],['C8','rosa']]
const priorOf=(id)=>{const i=GRANTS.findIndex(g=>g[0]===id);return GRANTS.slice(0,Math.max(0,i))}

function base(over={}){
  return {phase:'investigation',prevPhase:'apartment',activePath:'A',currentNodeId:null,
    paths:{A:{started:true,completed:false,unlockedNodes:A,completedNodes:[]},
           B:{started:true,completed:false,unlockedNodes:B,completedNodes:[]},
           C:{started:true,completed:false,unlockedNodes:C,completedNodes:[]}},
    perfectPaths:{},hintsUsed:0,wrongGuesses:0,endingChoice:null,evidenceScore:0,journalistUnlocked:false,
    systemAlertShown:true,caseSummaries:{A:[],B:[],C:[]},clock:60,lastTimeDelta:null,raySuspicion:0,
    rayLog:[{id:'r1',choice:0},{id:'r2',choice:0},{id:'r3',choice:0},{id:'r4',choice:0}],rayBeatPending:null,
    clues:[],lastClue:null,theory:{},theoryTests:0,deductions:{},finalCase:{suspect:null,slots:{}},
    seenBoardTutorial:true,rayGoneSeen:true,nameRevealSeen:true,namePending:false,nodeProgress:{},
    saveSlots:[null,null,null],lastSaved:null,...over}
}
// a lead, seeded with everything a player would hold when they reach it
function atLead(id, over={}){
  const prior=priorOf(id), done=prior.map(g=>g[0])
  return base({activePath:id[0], currentNodeId:id, clues:prior.map(g=>g[1]),
    clock:40+8*prior.length,
    paths:{A:{started:true,completed:false,unlockedNodes:A,completedNodes:done.filter(x=>x[0]==='A')},
           B:{started:true,completed:false,unlockedNodes:B,completedNodes:done.filter(x=>x[0]==='B')},
           C:{started:true,completed:false,unlockedNodes:C,completedNodes:done.filter(x=>x[0]==='C')}},
    ...over})
}
const ALL_CLUES=GRANTS.map(g=>g[1])
module.exports={A,B,C,ALL,GRANTS,ALL_CLUES,base,atLead,priorOf}
