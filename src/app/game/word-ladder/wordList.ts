/**
 * Word Ladder Game — Word List & Game Logic
 *
 * Contains:
 *  - Curated dictionaries for 3, 4 and 5-letter words
 *  - Puzzle pairs grouped by difficulty
 *  - BFS pathfinder for optimal hint generation
 *  - Helper validation functions
 */

// ---------------------------------------------------------------------------
// Dictionaries
// ---------------------------------------------------------------------------

export const WORDS_3: ReadonlySet<string> = new Set([
  'ace','act','add','age','ago','aid','aim','air','ale','ant','ape','arc','are','ark','arm',
  'art','ash','ask','ate','awe','axe','aye',
  'bad','bag','ban','bar','bat','bay','bed','bee','beg','bet','bid','big','bin','bit','bog',
  'bow','box','boy','bud','bug','bum','bun','bus','but','buy','bye',
  'cab','can','cap','car','cat','cod','cog','cop','cot','cow','cry','cub','cup','cut',
  'dad','dam','dew','did','dig','dim','dip','dog','dot','dry','dug','dun',
  'ear','eat','egg','ego','elf','elk','elm','end','era','eve','ewe',
  'fad','fan','far','fat','fee','few','fig','fin','fit','fly','fog','foe','for','fox','fry','fun',
  'gap','gas','gel','gem','get','god','got','gun','guy','gym','gum',
  'had','ham','has','hat','hay','hen','hew','hid','him','hip','his','hit','hoe','hop','hot',
  'hub','hug','hum','hut',
  'ice','inn','ion','ivy',
  'jab','jam','jar','jaw','jet','job','jot','joy','jug','jut',
  'keg','key','kid','kin','kit',
  'lab','lag','lap','law','lay','led','leg','let','lid','lip','lit','log','lot','low','lug',
  'mad','man','map','mat','may','mob','mop','mud','mug','mum',
  'nag','nap','net','nod','nor','not','now','nun',
  'oak','oar','odd','oil','old','one','ore','our','out','own',
  'pad','pan','paw','pay','peg','pen','pet','pin','pit','pod','pop','pot','pub','pun','pup','put',
  'rag','ram','ran','rap','rat','raw','ray','red','rid','rim','rip','rob','rod','rot','row',
  'rub','rug','rum','run','rut',
  'sad','sap','sat','saw','say','sea','set','sew','shy','sip','sit','sky','sly','sob','sod',
  'son','sow','spa','spy','sub','sue','sum','sun',
  'tab','tan','tap','tar','tea','ten','tin','tip','toe','ton','top','tow','toy','tub','tug',
  'urn','use',
  'van','vat','via','vie','vim','vow',
  'wag','war','was','way','web','wed','wet','who','why','wig','win','wit','won','wow','wry',
  'yam','yew','yet','you',
  'zap','zip',
])

export const WORDS_4: ReadonlySet<string> = new Set([
  'able','ache','acre','aged','aide','also','alto','army','arts','asks','atom','aunt','away',
  'back','bade','bail','bait','bake','bald','bale','ball','band','bane','bang','bank','bare',
  'bark','barn','base','bash','bath','bead','beak','beam','bean','bear','beat','been','beer',
  'beet','bell','belt','bend','best','bile','bill','bind','bird','bite','blow','blue',
  'boar','boat','bold','bolt','bond','bone','book','boom','boot','bore','born','both','bout',
  'bowl','bulk','bull','bump','burn','bush','busy','buzz',
  'cafe','cage','cake','calf','call','calm','came','camp','cane','card','care','cart','case',
  'cash','cast','cave','cent','char','chat','chip','chop','cite','clad','clam','clap',
  'claw','clay','clip','clog','clot','club','clue','coat','code','coil','coin','coke',
  'come','cone','cook','cool','cope','copy','cord','core','cork','corn','cost','curl',
  'cute',
  'damp','dare','dark','dart','dash','data','date','dawn','dead','deaf','deal','dear',
  'debt','deck','deed','deep','deer','dent','deny','desk','dial','dice','diet','dill',
  'dime','dine','dire','dirt','disc','dish','disk','dome','done','doom','door','dose',
  'dote','dove','down','drag','draw','drip','drop','drum','dual','duel','dumb','dump',
  'dune','dunk','dusk','dust',
  'each','earl','earn','ease','east','edge','emit','even','ever','evil','exam',
  'face','fact','fade','fail','fair','fake','fall','fame','fang','farm','fast','fate','fawn',
  'fear','feat','feed','feel','feet','fell','felt','fend','fern','file','fill','film',
  'find','fine','fire','firm','fish','fist','flag','flap','flat','flaw','flea','flew',
  'flex','flip','flog','flop','flow','foam','fold','folk','fond','font','food','fool',
  'foot','ford','fore','fork','form','fort','foul','four','fowl','free','frog','fuel',
  'full','fume','fund','fuse',
  'gale','gall','game','gang','gape','garb','gate','gave','gaze','gear','gent','germ','gild',
  'gill','gist','give','glad','glen','glow','glue','goal','goat','gold','golf',
  'gone','good','gore','gory','gown','grab','grey','grid','grim','grip','grit','grew','gulf',
  'gull','gulp','gust','guts',
  'hack','hail','hair','half','hall','halt','hand','hang','hard','hare','harm','hash','hate',
  'have','hawk','haze','hazy','head','heal','heap','hear','heat','heed','heel','held','helm',
  'help','hemp','herb','herd','hero','hide','high','hill','hilt','hint','hire','hive',
  'hold','hole','home','hood','hook','hoop','hope','horn','hose','hour','howl','hull','hump',
  'hunk','hunt','hurl',
  'iced','icon','idea','idle','inch','into','iris','iron',
  'jack','jade','jail','jest','join','joke','jolt','jump','jury','just',
  'keel','keen','keep','kelp','kept','kick','kill','kind','king','kite','knee','knob','knot','know',
  'lace','lack','laid','lake','lame','lamp','land','lane','lard','lark','lash','last','late',
  'lawn','lead','leaf','leak','lean','leap','leer','lend','lens','lift','like','lily',
  'lime','limp','line','link','lion','list','live','load','loam','loan','lobe','lock','loft',
  'lone','long','loom','loop','lore','lose','loss','lost','loud','lout','love','lure',
  'lurk','lust','lute',
  'made','mail','main','make','male','mall','mane','many','mark','mast','mate','maze',
  'meal','mean','meat','meld','melt','memo','mere','mesh','mild','mile','milk','mill',
  'mime','mind','mine','mint','mire','miss','mist','mode','mold','mole','molt','mood',
  'moon','moor','more','most','moth','move','mule','mull','muse','musk','mute',
  'nail','name','navy','need','nest','news','next','nice','nine','node','none','noon','nope',
  'norm','nose','note','noun','nude','null',
  'once','only','open','oral','oven','over','owed',
  'pace','pack','page','paid','pail','pain','pair','pale','palm','pang','park','part','pass',
  'past','path','pave','peak','pear','peel','peer','pelt','pest','pile','pill','pine','pink',
  'pipe','plan','play','plod','plop','plot','plow','plug','plum','plus','poem','poet',
  'pole','poll','pond','pore','port','pose','post','pour','prey','prim','prod',
  'prop','pull','pump','pure','push',
  'rack','rage','raid','rail','rain','rake','ramp','rank','rant','rash','rate','read','real',
  'reap','reed','reel','rein','rent','rest','rice','rich','ride','rife','rift','ring','riot',
  'rise','risk','road','roam','roar','robe','rock','rode','role','roll','roof','room',
  'rope','rose','ruin','rule','rump','rung','rush',
  'sack','safe','sage','sail','sake','sale','salt','same','sand','sane','sang','sank','sash',
  'save','scan','scar','seal','seam','seat','seed','seek','seem','seep','self','sell','send',
  'sent','shed','shin','ship','shoe','shop','shot','show','shut','sick','sill','silo','silt',
  'sing','sink','site','size','skin','skip','slab','slam','slap','slat','sled','slim',
  'slip','slit','slow','slug','snap','snob','snug','soak','soap','soar',
  'sock','soft','soil','sold','sole','some','song','soon','soot','sort','soul','soup','sour',
  'span','spar','spin','spot','spur','star','stay','stem','step','stir','stop',
  'stub','such','suit','sulk','surf',
  'tack','tail','tale','talk','tall','tame','tank','tape','tare','task','taut','teal','team',
  'tear','teem','tell','tend','tent','term','test','tick','tide','tile','till','tilt','time',
  'tire','toad','told','toll','tomb','tome','tone','took','tool','torn','toss','tour','town',
  'trek','trim','trio','trip','tube','tuna','tune','turf','twin','type',
  'ugly','undo','unit','unto','upon','used',
  'vale','vane','vary','vast','veal','veil','vein','vent','very','vest','veto','vice','view',
  'vine','vise','void','vole','volt','vote',
  'wade','wage','wake','walk','wall','wand','wane','ward','warm','wart','wary','wave','weak',
  'weal','wean','weed','week','weld','well','welt','went','west','wide','wild','will','wilt',
  'wind','wine','wing','wink','wire','wise','wish','wisp','wolf','wood','wool','word','wore',
  'work','worm','wove',
  'yawn','year','yell','your',
  'zeal','zero','zest','zinc','zone','zoom',
  // extra words needed for puzzle paths
  'rink','sire','silt','cord','wore',
])

export const WORDS_5: ReadonlySet<string> = new Set([
  'abide','above','abuse','adult','after','again','aisle','alarm','album','alert','alike',
  'align','alive','alley','allow','alone','aloud','altar','alter','angel','anger','angle',
  'angry','ankle','annoy','apple','apply','arena','argue','arise','armor','aroma','arose',
  'array','aside','asset','atone','attic','avoid','awake','award','aware','awful',
  'badge','badly','baker','bathe','beach','began','begin','being','below','bench','berry',
  'bible','birth','black','blade','blame','bland','blank','blast','blaze','bleak','bleed',
  'blend','bless','blind','block','blood','bloom','blown','board','bonus','boost','booth',
  'bored','bound','boxer','brace','braid','brain','brake','brand','brave','bread','break',
  'bride','brief','bring','brisk','brook','broom','broth','brown','brush','build','built',
  'burst','buyer',
  'cabin','candy','carry','catch','cause','cease','chain','chair','chalk','chaos','charm',
  'chase','cheap','check','cheek','cheer','chess','chest','chief','child','chord',
  'chose','civic','civil','claim','clash','class','clean','clear','clerk','click','climb',
  'cling','clock','close','cloth','cloud','coach','coast','coral','could','count',
  'court','cover','crack','craft','crane','crash','crazy','creak','cream','creek','crest',
  'crime','crisp','cross','crowd','crown','crush','curve',
  'daily','dance','dealt','decay','delay','dense','depth','devil','dirty','ditch',
  'dodge','doubt','draft','drain','drama','dream','dress','drift','drink','drive',
  'drone','drove','drown','dying',
  'eager','eagle','early','earth','eight','elite','empty','enemy','enjoy','enter','entry',
  'equal','essay','every','exact','exist','extra',
  'faint','faith','false','fancy','fatal','fault','feast','fence','field',
  'fifth','fight','final','first','fixed','flame','flash','fleet','flesh','flock','flood',
  'floor','flour','fluid','flute','focus','force','forge','forte','forty','found',
  'frame','fresh','front','frost','froze','fruit','fully',
  'ghost','given','glare','gloss','glove','going','grace','grade','grain','grand','grant',
  'grasp','grape','graze','great','green','greet','grief','groan','gross','group','grown',
  'guard','guide','guild','guile','guilt','guise',
  'habit','happy','harsh','haven','heart','heavy','hedge','hence','hinge',
  'hobby','honor','house','human','humor','hurry',
  'ideal','image','imply','infer','inner','input','issue',
  'judge','juice','juicy','jumbo',
  'karma','knack','kneel','knelt','knife','knock','known',
  'label','lance','large','laser','later','laugh','layer','learn','lease','leave','ledge',
  'level','light','liner','liver','local','lodge','logic','loose','lover','lower',
  'lucky','lunar','lunch',
  'magic','major','maker','manor','march','marry','match','mayor','media','mercy','merit',
  'metal','model','money','month','moral','motor','motto','mount','mouse','mouth','mover',
  'movie','music',
  'naive','naval','night','noble','noise','north','noted','novel',
  'ocean','offer','often','olive','order','other','outer',
  'paint','panic','party','pasta','patch','pause','peach','pearl','penny','perch',
  'phase','phone','photo','piano','piece','pilot','place','plain','plane',
  'plant','plate','plaza','plead','pluck','plumb','plume','point',
  'polar','pouch','pound','power','press','price','pride','prime','print','prior','prize',
  'probe','proof','prose','proud','prove','pulse','punch','pupil','purse',
  'queen','query','quick','quiet','quota','quote',
  'rabbi','radar','radio','raise','rally','ranch','range','rapid','ratio','reach','ready',
  'realm','rebel','refer','reign','relax','relay','reply','rider','right','rigid',
  'risky','rival','river','robin','robot','rocky','rouge','rough','round','route','royal','ruler',
  'saint','sauce','scale','scene','score','scout','seize','sense','serve',
  'seven','shade','shaft','shake','shall','shame','shape','share','shark','sharp',
  'shelf','shell','shift','shore','short','shout','since','sixth','sixty','skill',
  'skull','slate','slave','sleep','slice','slide','slope','small','smart','smell',
  'smile','smoke','snake','solar','solid','solve','sorry','sound','south','space','spare',
  'spark','speak','spear','speed','spite','split','spoke','spoon','sport','spray',
  'stain','stair','stake','stale','stalk','stall','stamp','stand','stank','stark','start',
  'state','stave','steel','steep','steer','stern','stick','stiff','still','sting','stock',
  'stomp','stone','stood','stoop','store','storm','story','stove','straw','stray','strip',
  'stuck','study','stump','stung','style','sugar','suite','sunny','super','surge',
  'swear','sweep','sweet','swept','swift','swirl','sword',
  'table','taste','teach','tense','theme','there','these','thick','thing','think','third',
  'thorn','those','three','threw','throw','thumb','tiger','tired','title',
  'today','token','total','touch','tough','towel','tower','toxic','track','trade',
  'trail','train','trait','tread','treat','trend','trial','tribe','trick',
  'tried','troop','trout','truce','truck','truly','trunk','trust','truth','tulip',
  'twice','twist','tying',
  'under','unify','union','unite','until','upper','upset','urban','usage','usual',
  'vague','valid','value','valve','vapor','verse','video','vigor','viral','vital','voice',
  'waste','watch','water','weary','weave','wedge','weigh','weird','whale','wheat','wheel',
  'where','which','while','white','whole','whose','witch','woman','women','world',
  'worry','worse','worst','worth','would','wound','write','wrong','wrote',
  'yield','young','youth','zebra',
  // extra words needed for puzzle paths
  'stoke','clack','clank','creak',
])

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Difficulty = 'easy' | 'medium' | 'hard'

export type PuzzlePair = {
  start: string
  target: string
  /** Maximum number of intermediate steps (not counting the start word) */
  maxSteps: number
}

// ---------------------------------------------------------------------------
// Puzzle Pairs
// Paths verified manually:
//  Easy   (3 letters)  — optimal ≤ 4 steps, maxSteps = 7
//  Medium (4 letters)  — optimal ≤ 5 steps, maxSteps = 9
//  Hard   (5 letters)  — optimal ≤ 4 steps, maxSteps = 8
// ---------------------------------------------------------------------------

export const PUZZLES_EASY: readonly PuzzlePair[] = [
  // CAT→COT→COG→DOG
  { start: 'CAT', target: 'DOG', maxSteps: 7 },
  // HOT→HAT→CAT→CAP
  { start: 'HOT', target: 'CAP', maxSteps: 7 },
  // SIT→BIT→BIN→BUN
  { start: 'SIT', target: 'BUN', maxSteps: 7 },
  // HAT→BAT→BAR→WAR
  { start: 'HAT', target: 'WAR', maxSteps: 7 },
  // TOP→TIP→DIP→DIM
  { start: 'TOP', target: 'DIM', maxSteps: 7 },
  // CAR→CAT→HAT→HIT
  { start: 'CAR', target: 'HIT', maxSteps: 7 },
  // MAN→CAN→CAP→CAT
  { start: 'MAN', target: 'CAT', maxSteps: 7 },
  // BAD→BAT→MAT→MAN
  { start: 'BAD', target: 'MAN', maxSteps: 7 },
]

export const PUZZLES_MEDIUM: readonly PuzzlePair[] = [
  // COLD→CORD→WORD→WARD→WARM
  { start: 'COLD', target: 'WARM', maxSteps: 9 },
  // LOVE→LIVE→LIME→LIKE
  { start: 'LOVE', target: 'LIKE', maxSteps: 9 },
  // HEAD→HEAL→TEAL→TELL→TALL→TAIL
  { start: 'HEAD', target: 'TAIL', maxSteps: 9 },
  // FIRE→HIRE→WIRE→WIDE→WIND
  { start: 'FIRE', target: 'WIND', maxSteps: 9 },
  // RING→RINK→SINK→SING→SONG
  { start: 'RING', target: 'SONG', maxSteps: 9 },
  // MINE→MANE→LANE→LAND→BAND→BOND→BOLD→GOLD
  { start: 'MINE', target: 'GOLD', maxSteps: 9 },
  // MADE→MAKE→LAKE→LIKE→BIKE→BITE
  { start: 'MADE', target: 'BITE', maxSteps: 9 },
  // DARK→DARE→DINE→FINE→WINE→WINE
  { start: 'DARK', target: 'WINE', maxSteps: 9 },
]

export const PUZZLES_HARD: readonly PuzzlePair[] = [
  // STONE→STORE→STARE→SHARE
  { start: 'STONE', target: 'SHARE', maxSteps: 8 },
  // SMART→START→STARK
  { start: 'SMART', target: 'STARK', maxSteps: 8 },
  // STALE→STAKE→STOKE→STOVE
  { start: 'STALE', target: 'STOVE', maxSteps: 8 },
  // CREAM→CREAK→BREAK→BREAD
  { start: 'CREAM', target: 'BREAD', maxSteps: 8 },
  // DRIVE→DROVE→PROVE
  { start: 'DRIVE', target: 'PROVE', maxSteps: 8 },
  // BRAVE→GRAVE→GRAPE→GRAZE
  { start: 'BRAVE', target: 'GRAZE', maxSteps: 8 },
  // SHORE→STORE→STARE→STARK
  { start: 'SHORE', target: 'STARK', maxSteps: 8 },
  // STAND→BLAND→BRAND→BRAID→BRAIN
  { start: 'STAND', target: 'BRAIN', maxSteps: 8 },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the word set for a given word length */
export function getWordSet(length: number): ReadonlySet<string> {
  if (length === 3) return WORDS_3
  if (length === 4) return WORDS_4
  if (length === 5) return WORDS_5
  return new Set()
}

/** Returns the puzzle list for a given difficulty */
export function getPuzzles(difficulty: Difficulty): readonly PuzzlePair[] {
  if (difficulty === 'easy') return PUZZLES_EASY
  if (difficulty === 'medium') return PUZZLES_MEDIUM
  return PUZZLES_HARD
}

/** Picks a random puzzle from the list */
export function getRandomPuzzle(difficulty: Difficulty): PuzzlePair {
  const list = getPuzzles(difficulty)
  return list[Math.floor(Math.random() * list.length)]
}

/** Counts the number of differing letters between two same-length words */
export function diffCount(a: string, b: string): number {
  let count = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) count++
  }
  return count
}

/** Returns true if `word` is in the dictionary for its length */
export function isValidWord(word: string): boolean {
  return getWordSet(word.length).has(word.toLowerCase())
}

/**
 * Returns true when:
 *  1. `to` has the same length as `from`
 *  2. `to` differs from `from` by exactly one letter
 *  3. `to` is a valid dictionary word
 *
 * Delegates the dictionary check to isValidWord so casing is always consistent.
 */
export function isValidStep(from: string, to: string): boolean {
  if (from.length !== to.length) return false
  if (diffCount(from.toUpperCase(), to.toUpperCase()) !== 1) return false
  return isValidWord(to)
}

// ---------------------------------------------------------------------------
// BFS — used to generate hints and verify puzzle solvability
// ---------------------------------------------------------------------------

function getNeighbors(word: string, wordSet: ReadonlySet<string>): string[] {
  const neighbors: string[] = []
  // work in lowercase to match the dictionary
  const lower = word.toLowerCase()
  const chars = lower.split('')
  for (let i = 0; i < chars.length; i++) {
    const original = chars[i]
    for (let c = 97; c <= 122; c++) {          // a–z
      const letter = String.fromCharCode(c)
      if (letter === original) continue
      chars[i] = letter
      const candidate = chars.join('')
      if (wordSet.has(candidate)) neighbors.push(candidate.toUpperCase())
      chars[i] = original
    }
  }
  return neighbors
}

/**
 * BFS shortest-path finder.
 * Returns the full path [start, ..., target] or null if unreachable.
 * Both words must be uppercase.
 * @param usedWords  Optional set of already-used uppercase words to exclude from the search.
 */
export function bfs(
  start: string,
  target: string,
  wordSet: ReadonlySet<string>,
  usedWords: ReadonlySet<string> = new Set(),
): string[] | null {
  // normalise to uppercase for the path output, lowercase for dict lookup
  const startUp = start.toUpperCase()
  const targetUp = target.toUpperCase()
  if (startUp === targetUp) return [startUp]

  const queue: Array<[string, string[]]> = [[startUp, [startUp]]]
  // Seed visited with already-used words so BFS won't route through them
  const visited = new Set<string>([startUp, ...usedWords])

  while (queue.length > 0) {
    const [current, path] = queue.shift()!
    for (const neighbor of getNeighbors(current, wordSet)) {
      if (neighbor === targetUp) return [...path, neighbor]
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push([neighbor, [...path, neighbor]])
      }
    }
  }
  return null
}

/**
 * Returns the next word in the optimal BFS path from `current` to `target`,
 * avoiding any words already in the player's chain.
 * Returns null if no path exists.
 */
export function getHint(
  current: string,
  target: string,
  usedWords: readonly string[] = [],
): string | null {
  const wordSet = getWordSet(current.length)
  const usedSet = new Set(usedWords.map((w) => w.toUpperCase()))
  const path = bfs(current.toUpperCase(), target.toUpperCase(), wordSet, usedSet)
  if (!path || path.length < 2) return null
  return path[1]
}
