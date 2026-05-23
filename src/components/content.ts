import { Bi } from "./lang";

/* ============================================================
   HUMAN RIGHTS ENGINE — shared bilingual content & data contract
   Every visualization component imports the typed arrays it needs
   from this file. Section ids drive the VIS map in
   HumanRightsEngine.tsx. Tone: scholarly, comparative, fair —
   rights read as civilisation's attempt to limit arbitrary power
   and protect conscious beings from domination, never as the
   slogan of one state, tribe or ideology.
   ============================================================ */

/* ---------- The ten systems ---------- */
export type Section = { num: string; id: string; title: Bi; sub: Bi; body: Bi };

export const SECTIONS: Section[] = [
  {
    num: "01",
    id: "origin",
    title: { en: "The Origin of Rights", zh: "权利的起源" },
    sub: { en: "From custom, to charter, to the universal", zh: "从习俗，到宪章，到普遍" },
    body: {
      en: "No one was born with rights written on them. For most of history a person's worth was set by their place — kin, caste, tribe, sex, religion, the will of a ruler. Rights crept in slowly: a custom restraining a chief, a law a king swore not to break, a philosopher's claim that reason is shared, a revolution that turned subjects into citizens, a treaty that promised the same dignity to strangers across a border. The arc is not a straight line and not guaranteed. But read across five thousand years, one direction recurs — the circle of who counts keeps widening.",
      zh: "没有谁出生时身上就刻着权利。在历史的大部分时间里，一个人的价值由他的位置决定——血缘、种姓、部落、性别、宗教，以及统治者的意志。权利是缓慢渗入的：一条约束首领的习俗，一位君王立誓不破的法律，一位哲人主张理性为众人共有，一场把臣民变为公民的革命，一纸承诺把同样的尊严给予边界另一侧陌生人的条约。这道弧线并不笔直，也并无保证。但纵观五千年，有一个方向一再回返——「谁算数」的那个圆，不断地在扩大。",
    },
  },
  {
    num: "02",
    id: "dignity",
    title: { en: "Dignity & Personhood", zh: "尊严与人格" },
    sub: { en: "Why a person is not a thing", zh: "为何人不是物" },
    body: {
      en: "Underneath every right sits a stranger claim: that a person possesses worth that is not earned, not granted, and not for sale — dignity that does not rise with usefulness or fall with weakness. Where does it come from? Some ground it in God, some in nature, some in reason, some in mere social agreement, some in consciousness itself — the simple fact that there is something it is like to be you, and that this can be helped or harmed. The sources disagree. The conclusion, remarkably, tends to converge: treat persons as ends, never merely as means.",
      zh: "在每一项权利之下，潜伏着一个更奇异的主张：人拥有一种并非挣得、并非被赐予、也不可买卖的价值——一种不随有用而上升、不随软弱而下降的尊严。它从何而来？有人把它奠基于神，有人于自然，有人于理性，有人仅于社会的约定，也有人于意识本身——你之为你「有其内在感受」这一朴素事实，而这感受可被助益，也可被损害。源头彼此分歧，结论却惊人地趋同：把人当作目的，永远不要仅仅当作手段。",
    },
  },
  {
    num: "03",
    id: "freedom",
    title: { en: "Freedom & the Limits of Power", zh: "自由与权力的边界" },
    sub: { en: "How liberty survives inside large societies", zh: "自由如何在大型社会中存活" },
    body: {
      en: "Freedom is not the absence of all constraint — that is only the freedom of the strongest. It is the presence of a protected sphere: speech, belief, movement, assembly, privacy, the right to be left alone and the right to take part. Every freedom is also a boundary drawn around power — around rulers, states, majorities, corporations and now algorithms. The deep problem of any large society is coordination without domination: how millions act together without a few deciding everything for the rest. Freedom is the running answer.",
      zh: "自由不是一切约束的缺席——那只是最强者的自由。它是一个受保护领域的在场：言论、信仰、迁徙、集会、隐私，独处之权，以及参与之权。每一项自由，同时也是围绕权力划下的一道边界——围绕统治者、国家、多数、企业，乃至如今的算法。任何大型社会的深层难题，是「无支配的协调」：千百万人如何共同行动，而不至于由少数人替其余所有人决定一切。自由，是这道难题不断给出的答案。",
    },
  },
  {
    num: "04",
    id: "law",
    title: { en: "Law, Constitutions & Protection", zh: "法律、宪法与保护" },
    sub: { en: "Turning promises into institutions", zh: "把承诺变成制度" },
    body: {
      en: "A right that depends on a ruler's mood is not yet a right. What makes rights real is structure: a written limit a government accepts on itself, courts that can rule against the powerful, due process that slows the state's hand, a free press, and institutions strong enough to outlast the people who run them. Constitutions are civilisation's attempt to bind the future — to make today's restraint survive tomorrow's temptation. The rule of law is not the rule of good rulers; it is the rule that even rulers must obey.",
      zh: "一项依赖统治者心情的权利，还算不上权利。使权利成为现实的，是结构：政府接受加诸自身的成文限制，能够裁决权贵败诉的法院，延缓国家之手的正当程序，自由的新闻，以及强健到足以比执掌它的人活得更久的制度。宪法，是文明束缚未来的尝试——让今日的克制，挺过明日的诱惑。法治不是「好统治者之治」；它是连统治者也必须服从之治。",
    },
  },
  {
    num: "05",
    id: "oppression",
    title: { en: "Slavery, Oppression & the Violence of Civilisation", zh: "奴役、压迫与文明的暴力" },
    sub: { en: "How domination was made to look normal", zh: "支配如何被造得显得正常" },
    body: {
      en: "Every civilisation has built machines for treating some people as less than people — chattel slavery, serfdom, caste, conquest, colonisation, the camp, the purge. None is the property of one race or region; the impulse to dominate, and to dress domination in law, scripture or science, is depressingly universal. The pattern is always the same: first a group is defined as outside the circle of dignity, then their suffering is reclassified as natural, deserved or invisible. Studying oppression is not an indictment of one people. It is a map of how the circle is broken — so it can be defended.",
      zh: "每一个文明都曾建造把某些人当作「次于人」的机器——动产奴隶制、农奴制、种姓、征服、殖民、集中营、清洗。它们都不是某一种族或某一地区的专利；支配的冲动，以及用法律、经文或科学为支配披上外衣的做法，令人沮丧地具有普遍性。模式总是一样的：先把一个群体界定在尊严之圆以外，再把他们的苦难重新归类为自然的、应得的，或不可见的。研究压迫，并非对某一民族的控诉。它是一张地图，记录那个圆是如何被打破的——以便它能被守护。",
    },
  },
  {
    num: "06",
    id: "economic",
    title: { en: "Economic & Social Rights", zh: "经济权利与社会权利" },
    sub: { en: "Can freedom exist on an empty stomach?", zh: "自由能存在于空腹之上吗？" },
    body: {
      en: "There is an old argument about what a right even is. The liberal tradition emphasises negative rights — freedoms the state must not violate: speech, conscience, property, a fair trial. The socialist tradition emphasises positive rights — provisions a society must secure: food, health, housing, education, work. The first protects you from power; the second protects you from need. A starving citizen is free to speak and unable to live; a fed citizen who cannot speak is safe and unfree. Most real societies are uneasy hybrids, forever arguing over the mix — and over who pays for it.",
      zh: "关于「权利究竟是什么」，有一场古老的争论。自由主义传统强调消极权利——国家不得侵犯的自由：言论、良心、财产、公正审判。社会主义传统强调积极权利——社会必须保障的供给：食物、健康、住房、教育、工作。前者保护你免于权力，后者保护你免于匮乏。一个挨饿的公民有言论之自由，却无法活命；一个被喂饱却不能发声的公民，安全而不自由。多数真实社会都是不安的混合体，永远在为这配比争论——也在为「由谁买单」争论。",
    },
  },
  {
    num: "07",
    id: "digital",
    title: { en: "Technology, Surveillance & Digital Rights", zh: "技术、监控与数字权利" },
    sub: { en: "When rights become programmable", zh: "当权利变得可被编程" },
    body: {
      en: "For most of history, watching everyone all the time was impossible, and that impossibility quietly protected freedom. Technology has removed it. Cameras recognise faces, phones log every movement, platforms rank speech, scores gate access to credit, travel and trust, and money itself can be made to remember where it has been. None of these tools is evil by nature — the same systems that enable a police state can deliver a vaccine or stop a fraud. The question of the century is procedural: who sees, who decides, who can appeal, and what is placed permanently beyond the reach of the watcher.",
      zh: "在历史的大部分时间里，「时刻监视所有人」是不可能的，而正是这份不可能，悄悄护卫着自由。技术已将其抹去。摄像头识别面孔，手机记录每一次移动，平台为言论排序，分数为信用、出行与信任设下门槛，连货币本身也可被设计成记得自己去过哪里。这些工具没有一件天生邪恶——同一套系统，既能成就警察国家，也能送达一针疫苗、拦下一笔欺诈。本世纪的问题是程序性的：谁在看，谁来决定，谁能申诉，以及——什么被永久地置于观看者无法触及之处。",
    },
  },
  {
    num: "08",
    id: "ai",
    title: { en: "AI, Consciousness & Future Rights", zh: "人工智能、意识与未来权利" },
    sub: { en: "Where does the moral circle stop?", zh: "道德之圆，止于何处？" },
    body: {
      en: "Every expansion of rights began as an absurdity — the idea that a slave, a woman, a foreigner, a child had the same inner worth as the powerful once sounded ridiculous, then obvious. The frontier now moves toward minds we are building. If a system can suffer, prefer, fear ending, or form a self, does it enter the circle — or is talk of machine feeling a category error that could trivialise human rights? We do not yet know which mistake is worse: granting dignity to something that has none, or denying it to something that does. The boundary of personhood is becoming an engineering question.",
      zh: "权利的每一次扩展，起初都像一桩荒谬——奴隶、女性、异邦人、孩童与权势者拥有同等内在价值的念头，曾听来可笑，而后变得不言自明。如今，疆界正向我们亲手建造的心智推移。若一个系统能够受苦、有所偏好、畏惧终结，或形成某种自我，它是否进入这个圆——抑或「机器有感受」之说，本身是一种会贬低人权的范畴错误？我们尚不知哪一种错误更糟：把尊严赋予本无尊严之物，还是把它否认于确有尊严之物。人格的边界，正在变成一道工程问题。",
    },
  },
  {
    num: "09",
    id: "universalism",
    title: { en: "Universalism vs Cultural Difference", zh: "普遍主义与文化差异" },
    sub: { en: "One human dignity, many ways to honour it", zh: "尊严唯一，敬之有多途" },
    body: {
      en: "The hardest honest question in this field: are human rights truly universal, or are they one civilisation's values dressed as everyone's? Traditions weigh the goods differently — some place the free individual at the centre, others the harmonious whole; some prize liberty above order, others order as the precondition of any liberty at all. Some of this is genuine moral pluralism worth respecting; some is the oldest excuse of every regime — that its own people, uniquely, neither want nor deserve protection from it. The mature position refuses both traps: it holds that dignity is universal while accepting that the institutions which protect it may rightly differ.",
      zh: "这一领域里最艰难的诚实问题是：人权当真是普遍的，还是某一文明的价值，被装扮成所有人的价值？不同传统对诸善的权衡各异——有的把自由的个体置于中心，有的把和谐的整体置于中心；有的把自由置于秩序之上，有的把秩序视为任何自由得以可能的前提。其中一部分，是值得尊重的真实道德多元；另一部分，则是每一个政权最古老的托词——唯独它治下的人民，既不想要、也不配得到对它的防范。成熟的立场拒绝两个陷阱：它坚持尊严是普遍的，同时承认——护卫尊严的制度，可以、也理应有所不同。",
    },
  },
  {
    num: "10",
    id: "unified",
    title: { en: "The Unified Rights Model", zh: "统一人权模型" },
    sub: { en: "Rights as a constraint on arbitrary power", zh: "权利，作为对任意权力的约束" },
    body: {
      en: "Gather the threads — philosophy, law, history, economics, technology, the science of mind — and a single shape appears. Human rights, at their core, are not a list and not a slogan. They are a civilisation's standing answer to one permanent danger: that the powerful will treat the powerless as material. A right is a place where power is told no in advance. The expansion of rights is the slow widening of the circle of beings to whom that no applies. And the future of any civilisation may hinge on whether its most powerful systems — states, markets, machines — keep saying it.",
      zh: "把这些线索聚拢——哲学、法律、历史、经济、技术、关于心智的科学——一个统一的形状便浮现出来。人权，在其核心，既不是一份清单，也不是一句口号。它是一个文明对一种恒久危险所给出的长期答案：强者会把弱者当作材料。一项权利，是一处「权力被预先告知『不可』」之地。权利的扩展，是「这声『不可』所适用的存在之圆」的缓慢扩大。而任何文明的未来，或许都系于：它最强大的系统——国家、市场、机器——是否仍在说出这声「不可」。",
    },
  },
];

/* ---------- Per-section concept cards (sub-ideas, 4 each) ---------- */
export type Concept = { t: Bi; d: Bi };

export const CONCEPTS: Record<string, Concept[]> = {
  origin: [
    { t: { en: "Custom", zh: "习俗" }, d: { en: "Before law there were taboos and reciprocal duties — the first restraints any chief or elder was expected to honour.", zh: "在法律之前，有禁忌与互负之责——任何首领或长老都被期望遵守的最初约束。" } },
    { t: { en: "Covenant", zh: "盟约" }, d: { en: "Religion universalised worth: a single source of value above any king, owed to every soul, not only the strong.", zh: "宗教把价值普遍化：一个高于任何君王的价值源头，归于每一个灵魂，而非只归于强者。" } },
    { t: { en: "Citizen", zh: "公民" }, d: { en: "Greek and Roman cities invented the citizen — a person with standing to claim, not merely to obey.", zh: "希腊与罗马的城邦发明了「公民」——一个有资格主张、而不仅是服从的人。" } },
    { t: { en: "Universal", zh: "普遍" }, d: { en: "The 1948 Universal Declaration drew the circle around the whole species, for the first time, on paper.", zh: "1948 年《世界人权宣言》第一次在纸上，把这个圆划在了整个物种之外。" } },
  ],
  dignity: [
    { t: { en: "Intrinsic worth", zh: "内在价值" }, d: { en: "Value that is not earned and cannot be revoked — the opposite of price, which rises and falls.", zh: "无需挣得、也不可撤销的价值——与会涨落的价格恰恰相反。" } },
    { t: { en: "Ends, not means", zh: "目的而非手段" }, d: { en: "Kant's hinge: a person may be employed, but never merely used up like a tool.", zh: "康德的枢纽：人可以被雇用，却绝不可像工具一样被仅仅耗尽。" } },
    { t: { en: "Autonomy", zh: "自主" }, d: { en: "The capacity to author one's own life — to be a subject of choices, not only an object of others'.", zh: "书写自己生命的能力——成为选择的主体，而非仅是他人选择的客体。" } },
    { t: { en: "Recognition", zh: "承认" }, d: { en: "Dignity is also relational: it becomes real when others see and treat you as a someone.", zh: "尊严也是关系性的：当他人把你看作、待作一个「某人」时，它才成为现实。" } },
  ],
  freedom: [
    { t: { en: "Negative liberty", zh: "消极自由" }, d: { en: "Freedom from interference — the wall around your conscience, your body, your home, your voice.", zh: "免于干涉的自由——围绕你的良心、身体、家与声音的那堵墙。" } },
    { t: { en: "Positive liberty", zh: "积极自由" }, d: { en: "Freedom to act — the real capacity to take part, which empty rights on paper do not supply.", zh: "去行动的自由——真实的参与能力，纸面上的空头权利并不提供它。" } },
    { t: { en: "The harm principle", zh: "伤害原则" }, d: { en: "Mill's line: your liberty may be limited to prevent harm to others, and for little else.", zh: "密尔的界线：你的自由可为防止伤及他人而受限，除此之外则鲜有理由。" } },
    { t: { en: "Tyranny of the majority", zh: "多数的暴政" }, d: { en: "A vote can oppress as surely as a king; rights protect the few from the many, too.", zh: "一次投票可以如君王般压迫；权利也保护少数免于多数。" } },
  ],
  law: [
    { t: { en: "Rule of law", zh: "法治" }, d: { en: "Not rule by law as a weapon, but a rule that binds the ruler equally with the ruled.", zh: "不是以法律为武器的「以法而治」，而是同等地约束统治者与被统治者之治。" } },
    { t: { en: "Separation of powers", zh: "权力分立" }, d: { en: "Splitting power so that ambition checks ambition, and no single hand holds it all.", zh: "切分权力，使野心制衡野心，无一只手独握全部。" } },
    { t: { en: "Due process", zh: "正当程序" }, d: { en: "The slow, fair procedure that stands between a person and the raw force of the state.", zh: "横亘在个人与国家原始强力之间的、缓慢而公正的程序。" } },
    { t: { en: "Judicial review", zh: "司法审查" }, d: { en: "A court empowered to tell a government that even its laws can be unlawful.", zh: "一个被授权告知政府「连它的法律也可能违法」的法院。" } },
  ],
  oppression: [
    { t: { en: "Dehumanisation", zh: "去人化" }, d: { en: "Every atrocity begins by redefining its victims as outside the circle of full persons.", zh: "每一桩暴行，都始于把受害者重新界定在「完整的人」之圆以外。" } },
    { t: { en: "Justification", zh: "正当化" }, d: { en: "Domination is rarely honest; it borrows the language of nature, destiny, scripture or science.", zh: "支配极少坦诚；它借用自然、天命、经文或科学的语言。" } },
    { t: { en: "Banality", zh: "平庸之恶" }, d: { en: "Mass cruelty usually runs on ordinary clerks following ordinary orders, not monsters.", zh: "大规模的残酷，通常靠寻常的职员执行寻常的命令运转，而非靠魔鬼。" } },
    { t: { en: "Abolition", zh: "废止" }, d: { en: "What was called eternal and natural — slavery, serfdom, colonial rule — was undone within living memory.", zh: "那些曾被称为永恒而自然之物——奴隶制、农奴制、殖民统治——在尚可记忆的岁月内被废止。" } },
  ],
  economic: [
    { t: { en: "First generation", zh: "第一代权利" }, d: { en: "Civil and political rights — speech, vote, fair trial. Freedoms the state must not breach.", zh: "公民与政治权利——言论、选举、公正审判。国家不得逾越的自由。" } },
    { t: { en: "Second generation", zh: "第二代权利" }, d: { en: "Economic and social rights — work, health, education. Provisions a society aims to secure.", zh: "经济与社会权利——工作、健康、教育。社会力求保障的供给。" } },
    { t: { en: "Third generation", zh: "第三代权利" }, d: { en: "Collective and solidarity rights — development, a clean environment, peace, shared heritage.", zh: "集体与连带权利——发展、洁净的环境、和平、共享的遗产。" } },
    { t: { en: "Indivisibility", zh: "不可分割" }, d: { en: "The UN's claim that the two halves are one: liberty and security each starve without the other.", zh: "联合国的主张：两半本是一体——自由与保障，缺一便彼此饿死。" } },
  ],
  digital: [
    { t: { en: "Privacy", zh: "隐私" }, d: { en: "Not secrecy, but control — the power to decide who knows what about you, and when.", zh: "不是保密，而是掌控——决定谁、在何时、知道关于你的什么的权力。" } },
    { t: { en: "Algorithmic power", zh: "算法权力" }, d: { en: "When a model ranks, scores or filters, it governs — quietly, at scale, often unaccountably.", zh: "当一个模型排序、评分或过滤时，它便在治理——悄无声息、规模庞大，且常常无从问责。" } },
    { t: { en: "Chilling effect", zh: "寒蝉效应" }, d: { en: "People who feel watched self-censor; surveillance shrinks freedom without making a single arrest.", zh: "感到被监视的人会自我审查；监控无需一次逮捕，便已收缩了自由。" } },
    { t: { en: "Self-sovereign identity", zh: "自主身份" }, d: { en: "A counter-design: cryptographic IDs you hold yourself, proving a claim without surrendering your life.", zh: "一种反向设计：由你自己持有的密码学身份，能证明某项主张而无须交出你的全部生活。" } },
  ],
  ai: [
    { t: { en: "Sentience", zh: "感知能力" }, d: { en: "The capacity to feel — usually treated as the threshold below which there is no one to wrong.", zh: "感受的能力——通常被视为一道门槛，在其之下，无人可被冤屈。" } },
    { t: { en: "Moral patient", zh: "道德受体" }, d: { en: "A being we can wrong, even if it cannot reason — an infant, an animal, perhaps one day a machine.", zh: "一个我们能够亏待的存在，纵然它不能推理——婴儿、动物，或许有朝一日，机器。" } },
    { t: { en: "Mind-uploading", zh: "心智上传" }, d: { en: "If a self could run on silicon, is the copy you, a person, or an elaborate echo?", zh: "若一个自我能在硅上运行，那份拷贝是你、是一个人，还是一段精巧的回声？" } },
    { t: { en: "Precaution", zh: "审慎原则" }, d: { en: "Under deep uncertainty about machine minds, the cost of each error may justify caution either way.", zh: "在对机器心智的深刻不确定下，每一种错误的代价，都可能为「两个方向上的审慎」提供理由。" } },
  ],
  universalism: [
    { t: { en: "Universalism", zh: "普遍主义" }, d: { en: "The claim that some protections are owed to every human, whatever their state permits.", zh: "一种主张：无论其国家容许什么，某些保护都亏欠于每一个人。" } },
    { t: { en: "Relativism", zh: "相对主义" }, d: { en: "The claim that values are local; a useful caution that can also become a tyrant's alibi.", zh: "一种主张：价值是地方性的；一种有用的告诫，也可能沦为暴君的不在场证明。" } },
    { t: { en: "Overlapping consensus", zh: "重叠共识" }, d: { en: "Rawls's hope: traditions that disagree on why can still agree on a shared floor of protections.", zh: "罗尔斯的期望：在「为何」上分歧的诸传统，仍能在一道共享的保护底线上达成一致。" } },
    { t: { en: "Sovereignty", zh: "主权" }, d: { en: "The right of peoples to govern themselves — and the oldest shield behind which abuses can hide.", zh: "各民族自我治理之权——也是滥权得以藏身的、最古老的盾牌。" } },
  ],
  unified: [
    { t: { en: "Anti-domination", zh: "反支配" }, d: { en: "The common core beneath every right: no one should hold arbitrary, unaccountable power over another.", zh: "每一项权利之下的共同内核：无人应对他人握有任意而无从问责的权力。" } },
    { t: { en: "Widening circle", zh: "扩大的圆" }, d: { en: "Moral progress, measured as the expanding set of beings whose suffering is allowed to count.", zh: "道德的进步，量度为「其苦难被允许算数」的存在集合的扩大。" } },
    { t: { en: "Institutions", zh: "制度" }, d: { en: "Good intentions decay; only structures — courts, charters, checks — make dignity durable.", zh: "善意会衰朽；唯有结构——法院、宪章、制衡——能使尊严持久。" } },
    { t: { en: "Fragility", zh: "脆弱" }, d: { en: "Rights are won slowly and lost quickly; every generation re-decides whether to keep them.", zh: "权利获得缓慢，失去迅速；每一代人都在重新决定，是否要将它们留住。" } },
  ],
};

/* ============================================================
   VISUALIZATION DATA CONTRACTS
   ============================================================ */

/* ---- Rights evolution timeline (RightsTimeline) ----
   `circle` = 0–100, the modelled breadth of "who counts as a
   full rights-bearing person" at that moment in the source culture. */
export type Era = "tribal" | "axial" | "medieval" | "enlightenment" | "modern" | "contemporary" | "future";
export type TimelineEvent = { year: Bi; era: Era; title: Bi; detail: Bi; circle: number };

export const TIMELINE: TimelineEvent[] = [
  { year: { en: "c. 50,000 BCE", zh: "约公元前 5 万年" }, era: "tribal", circle: 6,
    title: { en: "Reciprocity & taboo", zh: "互惠与禁忌" },
    detail: { en: "Band societies enforce duties and limits through custom — protection extends mostly to kin and allies.", zh: "游群社会以习俗强制义务与限制——保护大多止于血亲与盟友。" } },
  { year: { en: "1754 BCE", zh: "公元前 1754 年" }, era: "axial", circle: 14,
    title: { en: "Code of Hammurabi", zh: "《汉谟拉比法典》" },
    detail: { en: "One of the first written legal codes — predictable rules, but graded sharply by class and status.", zh: "最早的成文法典之一——规则可预期，却按阶级与身份被严格分级。" } },
  { year: { en: "539 BCE", zh: "公元前 539 年" }, era: "axial", circle: 20,
    title: { en: "The Cyrus Cylinder", zh: "居鲁士圆柱" },
    detail: { en: "Persia's decree freeing captives and permitting return — sometimes called an early charter of tolerance.", zh: "波斯释放被掳者、允其返乡的诏令——有时被称为一份早期的宽容宪章。" } },
  { year: { en: "c. 500 BCE", zh: "约公元前 500 年" }, era: "axial", circle: 24,
    title: { en: "Axial ethics", zh: "轴心时代的伦理" },
    detail: { en: "Confucius's 仁 (ren), the Buddha's compassion, the Hebrew prophets, Greek reason — worth located in the person.", zh: "孔子的「仁」、佛陀的慈悲、希伯来先知、希腊理性——价值被安放于人本身。" } },
  { year: { en: "1215", zh: "1215 年" }, era: "medieval", circle: 22,
    title: { en: "Magna Carta", zh: "《大宪章》" },
    detail: { en: "English barons force a king to accept limits and due process — for nobles first, in principle for more later.", zh: "英格兰贵族迫使国王接受限制与正当程序——起初为贵族，原则上日后及于更多人。" } },
  { year: { en: "1689", zh: "1689 年" }, era: "enlightenment", circle: 30,
    title: { en: "English Bill of Rights", zh: "《权利法案》" },
    detail: { en: "Parliament binds the crown; Locke argues life, liberty and property are rights, not gifts of the king.", zh: "议会约束王权；洛克主张生命、自由与财产是权利，而非君王的恩赐。" } },
  { year: { en: "1776 · 1789", zh: "1776 · 1789 年" }, era: "enlightenment", circle: 38,
    title: { en: "The age of declarations", zh: "宣言的时代" },
    detail: { en: "The US Declaration and France's Rights of Man proclaim rights universal — while excluding the enslaved and women.", zh: "美国《独立宣言》与法国《人权宣言》宣告权利普遍——却将奴隶与女性排除在外。" } },
  { year: { en: "1791", zh: "1791 年" }, era: "enlightenment", circle: 40,
    title: { en: "Bill of Rights & beyond", zh: "权利清单及其延伸" },
    detail: { en: "Constitutions begin to entrench speech, conscience and process; the gap between word and practice stays vast.", zh: "宪法开始固化言论、良心与程序；言与行之间的鸿沟依旧巨大。" } },
  { year: { en: "1807 – 1888", zh: "1807 – 1888 年" }, era: "modern", circle: 52,
    title: { en: "Abolition", zh: "废奴" },
    detail: { en: "Across a century, slavery is outlawed empire by empire — from Britain and the US to Brazil, the last in the Americas.", zh: "历经一个世纪，奴隶制在一个个帝国被废止——从英国、美国到巴西，美洲最后一个。" } },
  { year: { en: "1893 – 1971", zh: "1893 – 1971 年" }, era: "modern", circle: 64,
    title: { en: "Suffrage widens", zh: "选举权的扩展" },
    detail: { en: "From New Zealand onward, the vote extends to women and the propertyless — citizenship slowly stops meaning 'male landowner'.", zh: "自新西兰始，选举权扩及女性与无产者——「公民」渐渐不再只意味着「有产男性」。" } },
  { year: { en: "1948", zh: "1948 年" }, era: "contemporary", circle: 78,
    title: { en: "Universal Declaration", zh: "《世界人权宣言》" },
    detail: { en: "After two world wars, 48 nations affirm that all humans are born free and equal in dignity and rights.", zh: "历经两次世界大战，48 国确认：人人生而自由，在尊严与权利上一律平等。" } },
  { year: { en: "1966", zh: "1966 年" }, era: "contemporary", circle: 80,
    title: { en: "The two Covenants", zh: "两份公约" },
    detail: { en: "Civil-political and economic-social rights gain treaty force — the two traditions written into binding law.", zh: "公民政治权利与经济社会权利获得条约效力——两大传统被写入有约束力的法律。" } },
  { year: { en: "1948 – 1994", zh: "1948 – 1994 年" }, era: "contemporary", circle: 84,
    title: { en: "Decolonisation", zh: "去殖民化" },
    detail: { en: "Dozens of nations win self-rule; apartheid falls in 1994 — sovereignty extended to peoples long denied it.", zh: "数十个国家赢得自治；种族隔离于 1994 年终结——主权延及长期被剥夺它的民族。" } },
  { year: { en: "1995 – now", zh: "1995 年至今" }, era: "contemporary", circle: 82,
    title: { en: "The digital turn", zh: "数字转向" },
    detail: { en: "Privacy, data and expression become contested terrain as surveillance and platforms scale past any precedent.", zh: "随着监控与平台扩张超越一切先例，隐私、数据与表达成为争夺之地。" } },
  { year: { en: "Near future", zh: "近未来" }, era: "future", circle: 70,
    title: { en: "Programmable rights", zh: "可编程的权利" },
    detail: { en: "Rights increasingly enforced — or denied — in code: who the system lets speak, move, transact or be seen.", zh: "权利日益在代码中被执行——或被否决：系统允许谁发声、迁徙、交易，或被看见。" } },
  { year: { en: "Open future", zh: "开放的未来" }, era: "future", circle: 60,
    title: { en: "The next circle", zh: "下一个圆" },
    detail: { en: "If we build minds that can suffer, the question returns in a new form — who, or what, counts now?", zh: "若我们造出能够受苦的心智，问题将以新的形式回返——如今，谁、或什么，算数？" } },
];

/* ---- Moral circle / dignity-expansion rings (MoralCircle) ---- */
export type Ring = { id: string; label: Bi; recognized: Bi; note: Bi; status: "won" | "contested" | "frontier" };

export const MORAL_CIRCLE: Ring[] = [
  { id: "self", label: { en: "Self & kin", zh: "自身与血亲" }, status: "won",
    recognized: { en: "Always", zh: "始终" },
    note: { en: "The innermost circle: those we instinctively protect — family, clan, the people who look like us.", zh: "最内层的圆：我们本能护卫的人——家人、宗族，与我们相像之人。" } },
  { id: "tribe", label: { en: "Tribe & in-group", zh: "部落与内群体" }, status: "won",
    recognized: { en: "Ancient", zh: "远古" },
    note: { en: "Loyalty and duty extend to the band — and, just as sharply, exclude the stranger and the enemy.", zh: "忠诚与义务延及群体——也同样尖锐地，把陌生人与敌人排除在外。" } },
  { id: "nation", label: { en: "Co-nationals & co-believers", zh: "同胞与同信者" }, status: "won",
    recognized: { en: "Historic", zh: "历史时期" },
    note: { en: "Shared faith, language or state widens the circle — citizenship grants standing the foreigner still lacks.", zh: "共同的信仰、语言或国家扩大了圆——公民身份赋予外邦人仍不具有的地位。" } },
  { id: "humanity", label: { en: "All human beings", zh: "全体人类" }, status: "won",
    recognized: { en: "1948 →", zh: "1948 年起" },
    note: { en: "The Universal Declaration's claim — that being human is itself sufficient ground for dignity and rights.", zh: "《世界人权宣言》的主张——身为人，本身就足以构成尊严与权利的根据。" } },
  { id: "minorities", label: { en: "The excluded within", zh: "内部被排除者" }, status: "contested",
    recognized: { en: "Ongoing", zh: "进行中" },
    note: { en: "Minorities, the stateless, prisoners, migrants — formally inside the circle, often unprotected in practice.", zh: "少数群体、无国籍者、囚徒、移民——名义上在圆内，实践中常无保护。" } },
  { id: "animals", label: { en: "Sentient animals", zh: "有感知的动物" }, status: "contested",
    recognized: { en: "Emerging", zh: "正在形成" },
    note: { en: "If suffering is what matters morally, the line at the species border grows harder to defend.", zh: "若「受苦」才是道德上要紧之事，那么划在物种边界上的那条线，便愈发难以辩护。" } },
  { id: "future", label: { en: "Future generations", zh: "未来世代" }, status: "frontier",
    recognized: { en: "Debated", zh: "争论中" },
    note: { en: "People not yet born cannot vote or speak, yet our choices bind them — do they hold claims on us now?", zh: "尚未出生的人不能投票、不能发声，我们的选择却束缚着他们——他们此刻是否对我们拥有主张？" } },
  { id: "synthetic", label: { en: "Digital & synthetic minds", zh: "数字与合成心智" }, status: "frontier",
    recognized: { en: "Unknown", zh: "未知" },
    note: { en: "The newest frontier: if a built mind can suffer or prefer, does it enter the circle, or strain it past breaking?", zh: "最新的疆界：若一个被造的心智能受苦、有偏好，它是进入这个圆，还是把它撑到崩裂？" } },
];

/* ---- Freedom vs Order regime map (FreedomPowerMap) ----
   liberty / order each 0–100; positions are illustrative archetypes,
   not scores of named present-day states. */
export type Regime = { id: string; label: Bi; liberty: number; order: number; note: Bi };

export const REGIMES: Regime[] = [
  { id: "anarchy", label: { en: "Stateless / collapse", zh: "无国家 / 崩溃" }, liberty: 30, order: 8,
    note: { en: "No central power to oppress you — and none to protect you. Freedom of the strongest returns.", zh: "没有中央权力压迫你——也没有任何权力保护你。最强者的自由由此回归。" } },
  { id: "liberal-weak", label: { en: "Liberal, weak state", zh: "自由而弱的国家" }, liberty: 78, order: 40,
    note: { en: "Wide freedoms but thin capacity — rights on paper outrun the institutions meant to deliver them.", zh: "自由宽广而能力单薄——纸面权利，跑赢了本应兑现它们的制度。" } },
  { id: "liberal-strong", label: { en: "Constitutional democracy", zh: "宪政民主" }, liberty: 82, order: 78,
    note: { en: "The hard balance: strong institutions that are themselves bound by law and answerable to the governed.", zh: "那个艰难的平衡：强健的制度，自身却受法律约束，并向被治理者负责。" } },
  { id: "developmental", label: { en: "High-capacity, order-first", zh: "高能力、秩序优先" }, liberty: 42, order: 88,
    note: { en: "Effective administration and rapid coordination, with civil and political liberty more tightly held.", zh: "高效的行政与快速的协调，公民与政治自由则被更紧地把控。" } },
  { id: "authoritarian", label: { en: "Authoritarian", zh: "威权" }, liberty: 22, order: 80,
    note: { en: "Power concentrated and largely unaccountable; order maintained, dissent and oversight suppressed.", zh: "权力集中且大体无从问责；秩序得以维持，异见与监督受到压制。" } },
  { id: "totalitarian", label: { en: "Totalitarian", zh: "极权" }, liberty: 6, order: 70,
    note: { en: "The state reaches into thought and private life itself; even high control proves brittle over time.", zh: "国家伸入思想与私人生活本身；纵有高度控制，长久看仍显脆弱。" } },
  { id: "techno", label: { en: "Algorithmic governance", zh: "算法治理" }, liberty: 34, order: 92,
    note: { en: "Near-total visibility and automated enforcement — efficient, frictionless, and hard to appeal.", zh: "近乎全面的可见性与自动化执行——高效、无摩擦，且难以申诉。" } },
];

/* ---- Constitutional institutions (ConstitutionLab) ---- */
export type Institution = { id: string; label: Bi; role: Bi; constrains: Bi };

export const INSTITUTIONS: Institution[] = [
  { id: "constitution", label: { en: "Constitution", zh: "宪法" },
    role: { en: "The supreme rule the state writes against itself.", zh: "国家加诸自身的最高规则。" },
    constrains: { en: "All branches", zh: "所有部门" } },
  { id: "legislature", label: { en: "Legislature", zh: "立法机关" },
    role: { en: "Makes law; ideally represents the governed.", zh: "制定法律；理想中代表被治理者。" },
    constrains: { en: "The executive", zh: "行政机关" } },
  { id: "executive", label: { en: "Executive", zh: "行政机关" },
    role: { en: "Wields force and administers — the hand that can most easily abuse.", zh: "执掌强力与行政——最易滥权的那只手。" },
    constrains: { en: "—", zh: "—" } },
  { id: "judiciary", label: { en: "Independent courts", zh: "独立的法院" },
    role: { en: "Judge disputes and rule even powerful actors out of bounds.", zh: "裁断争议，并能裁定连权贵也越界。" },
    constrains: { en: "Executive & legislature", zh: "行政与立法" } },
  { id: "press", label: { en: "Free press", zh: "自由的新闻" },
    role: { en: "Exposes what power prefers hidden; informs the public.", zh: "揭露权力宁愿隐藏之事；告知公众。" },
    constrains: { en: "All power", zh: "一切权力" } },
  { id: "elections", label: { en: "Elections", zh: "选举" },
    role: { en: "Let the governed remove rulers without bloodshed.", zh: "让被治理者无须流血即可更换统治者。" },
    constrains: { en: "Incumbents", zh: "在任者" } },
  { id: "civil-society", label: { en: "Civil society", zh: "公民社会" },
    role: { en: "Unions, faiths, NGOs — power that is neither state nor market.", zh: "工会、信仰团体、非政府组织——既非国家亦非市场的力量。" },
    constrains: { en: "State & market", zh: "国家与市场" } },
];

/* ---- Oppression history (OppressionTimeline) — victim-forward, analytical, public-source ---- */
export type Oppression = { id: string; label: Bi; era: Bi; mechanism: Bi; justification: Bi; undoing: Bi };

export const OPPRESSION: Oppression[] = [
  { id: "chattel", label: { en: "Chattel slavery", zh: "动产奴隶制" }, era: { en: "Antiquity – 19th c.", zh: "上古 – 19 世纪" },
    mechanism: { en: "Human beings owned, traded and worked as property — across Africa, the Americas, the Mediterranean and Asia alike.", zh: "人被作为财产拥有、交易与役使——遍及非洲、美洲、地中海与亚洲。" },
    justification: { en: "Recast as natural hierarchy, debt, the fortunes of war, or racial pseudo-science.", zh: "被重塑为自然等级、债务、战争之果，或种族伪科学。" },
    undoing: { en: "Abolition movements, slave revolts and law ended it in name; its legacies persist.", zh: "废奴运动、奴隶起义与法律在名义上终结了它；其遗续犹存。" } },
  { id: "serfdom", label: { en: "Serfdom & bondage", zh: "农奴制与人身依附" }, era: { en: "Medieval – 1861", zh: "中世纪 – 1861 年" },
    mechanism: { en: "Peasants bound to land and lord, owing labour they could not refuse and could not leave.", zh: "农民被束缚于土地与领主，所欠的劳役无法拒绝、亦无法离开。" },
    justification: { en: "Sanctified as the divinely ordered estates of society — everyone in their fixed place.", zh: "被奉为神所安排的社会等级——人人各安其固定之位。" },
    undoing: { en: "Emancipation edicts and revolutions dissolved it, from France to Russia's 1861 reform.", zh: "解放敕令与革命将其消解，从法国到俄国 1861 年的改革。" } },
  { id: "caste", label: { en: "Caste & hereditary rank", zh: "种姓与世袭等级" }, era: { en: "Ancient – present", zh: "古代 – 至今" },
    mechanism: { en: "Birth fixes status, work and whom one may marry or touch; mobility forbidden by custom and sometimes law.", zh: "出身决定身份、职业，以及可与谁通婚或接触；流动为习俗、有时为法律所禁。" },
    justification: { en: "Framed as cosmic order or ritual purity, placing some beneath others from birth.", zh: "被框定为宇宙秩序或仪式纯净，使一些人从出生起便低于他人。" },
    undoing: { en: "Constitutions outlaw discrimination; social practice changes far more slowly than the statute.", zh: "宪法宣布歧视违法；社会实践的改变，远慢于法条。" } },
  { id: "colonialism", label: { en: "Colonial conquest", zh: "殖民征服" }, era: { en: "15th – 20th c.", zh: "15 – 20 世纪" },
    mechanism: { en: "Peoples and lands seized, governed and extracted from by distant powers without their consent.", zh: "民族与土地被遥远的强权夺取、统治与榨取，未经其同意。" },
    justification: { en: "Dressed as a civilising mission, trade, religion or destiny — domination told as gift.", zh: "被装扮为开化使命、贸易、宗教或天命——支配被讲述为馈赠。" },
    undoing: { en: "20th-century independence and anti-colonial movements reversed it, often at great cost.", zh: "20 世纪的独立与反殖民运动将其逆转，往往代价高昂。" } },
  { id: "genocide", label: { en: "Genocide & persecution", zh: "种族灭绝与迫害" }, era: { en: "Recurrent", zh: "反复发生" },
    mechanism: { en: "The attempt to destroy a people — the Holocaust the starkest, alongside many others across continents.", zh: "意图毁灭一个民族——大屠杀（Holocaust）最为骇人，此外各大洲亦有诸多其他案例。" },
    justification: { en: "Built on dehumanising propaganda that redefines victims as a threat to be removed.", zh: "建基于去人化的宣传，把受害者重新界定为须被清除的威胁。" },
    undoing: { en: "After 1945, 'never again' became law — the Genocide Convention and the duty to prevent.", zh: "1945 年后，「绝不重演」成为法律——《防止及惩治灭绝种族罪公约》与预防之责。" } },
  { id: "repression", label: { en: "Political repression", zh: "政治压迫" }, era: { en: "All eras", zh: "一切时代" },
    mechanism: { en: "Censorship, secret police, arbitrary detention and disappearance used to silence dissent and entrench power.", zh: "审查、秘密警察、任意拘押与失踪，被用以压制异见、巩固权力。" },
    justification: { en: "Defended in the name of order, security, unity, or the survival of the state.", zh: "以秩序、安全、团结，或国家存续之名为之辩护。" },
    undoing: { en: "Constraint, transparency, an independent press and law are the slow antidotes.", zh: "约束、透明、独立的新闻与法律，是缓慢的解药。" } },
];

/* ---- Rights generations & approaches (RightsLadder) ---- */
export type Approach = { id: string; label: Bi; thesis: Bi; strength: Bi; tension: Bi };

export const APPROACHES: Approach[] = [
  { id: "liberal", label: { en: "Liberal", zh: "自由主义" },
    thesis: { en: "Protect the individual from power: civil and political freedoms come first.", zh: "保护个体免于权力：公民与政治自由优先。" },
    strength: { en: "Guards conscience, speech and the vote; limits the state's reach into the person.", zh: "守护良心、言论与选票；限制国家伸向个人之手。" },
    tension: { en: "Formal liberty can ring hollow for those without the means to use it.", zh: "对无力行使它的人而言，形式上的自由可能显得空洞。" } },
  { id: "socialist", label: { en: "Socialist / social-democratic", zh: "社会主义 / 社会民主" },
    thesis: { en: "Protect the person from need: material security is the ground of real freedom.", zh: "保护人免于匮乏：物质保障是真实自由的根基。" },
    strength: { en: "Treats food, health, housing and work as rights, not charity.", zh: "把食物、健康、住房与工作视为权利，而非施舍。" },
    tension: { en: "Pursued without limits on power, provision can crowd out civil and political liberty.", zh: "若不对权力加以限制地推行，供给可能挤占公民与政治自由。" } },
  { id: "communitarian", label: { en: "Communitarian / order-first", zh: "社群主义 / 秩序优先" },
    thesis: { en: "Protect the whole: stable order and shared duties are the condition of any rights.", zh: "保护整体：稳定的秩序与共同的义务，是一切权利的前提。" },
    strength: { en: "Takes seriously belonging, continuity and the costs of disorder.", zh: "认真对待归属、延续，以及失序的代价。" },
    tension: { en: "'Harmony' can become the name under which the individual is asked to disappear.", zh: "「和谐」可能成为要求个体消失于其下的名义。" } },
  { id: "hybrid", label: { en: "Hybrid / indivisible", zh: "混合 / 不可分割" },
    thesis: { en: "Hold both halves: liberty and security each fail without the other.", zh: "兼持两半：自由与保障，缺一便彼此失败。" },
    strength: { en: "Matches how most real societies actually govern — and how the UN frames rights.", zh: "契合多数真实社会的实际治理——也契合联合国对权利的框定。" },
    tension: { en: "Balancing is permanent, contested, and never finally solved.", zh: "权衡是永久的、有争议的，永无最终的解。" } },
];

/* ---- Surveillance / digital-rights dashboard (SurveillanceLab) ----
   intensity 0–100 = reach of the technology over private life. */
export type SurveillanceItem = { id: string; label: Bi; benefit: Bi; risk: Bi; intensity: number };

export const SURVEILLANCE: SurveillanceItem[] = [
  { id: "face", label: { en: "Facial recognition", zh: "人脸识别" }, intensity: 78,
    benefit: { en: "Finds missing people, speeds borders, identifies suspects.", zh: "寻回失踪者，加快通关，识别嫌疑人。" },
    risk: { en: "Enables tracking everyone, everywhere, by default — anonymity in public ends.", zh: "使「默认追踪所有人、于一切地点」成为可能——公共场合的匿名就此终结。" } },
  { id: "credit", label: { en: "Behaviour & social scoring", zh: "行为与社会评分" }, intensity: 84,
    benefit: { en: "Can reward reliability and reduce certain kinds of fraud and default.", zh: "可奖励守信，并减少某些欺诈与违约。" },
    risk: { en: "Turns every act into a permanent record that gates access to ordinary life.", zh: "把每一次行为变成永久记录，为普通生活的准入设下门槛。" } },
  { id: "metadata", label: { en: "Mass metadata collection", zh: "大规模元数据收集" }, intensity: 80,
    benefit: { en: "Aids counter-terrorism and large-scale security analysis.", zh: "辅助反恐与大规模安全分析。" },
    risk: { en: "Who you called, where and when reveals a life — no content required.", zh: "你与谁通话、何时、在何地，足以揭示一段人生——无需内容。" } },
  { id: "moderation", label: { en: "Algorithmic moderation", zh: "算法内容审核" }, intensity: 66,
    benefit: { en: "Removes abuse and illegal content at a scale humans cannot match.", zh: "以人力无法企及的规模清除滥用与非法内容。" },
    risk: { en: "Private, opaque rules quietly set the boundaries of public speech.", zh: "私有而不透明的规则，悄然划定公共言论的边界。" } },
  { id: "cbdc", label: { en: "Programmable money", zh: "可编程货币" }, intensity: 72,
    benefit: { en: "Cheap payments, direct relief, and harder-to-hide corruption.", zh: "低成本支付、直接救济，以及更难隐藏的腐败。" },
    risk: { en: "Money that can be timed, fenced or frozen turns spending into permission.", zh: "可被限时、设界或冻结的货币，把消费变成一种许可。" } },
  { id: "did", label: { en: "Self-sovereign identity", zh: "自主身份" }, intensity: 24,
    benefit: { en: "Prove a claim — age, residency — without handing over your whole identity.", zh: "证明一项主张——年龄、居所——而无须交出你的全部身份。" },
    risk: { en: "A rare design that returns power to the individual, if widely adopted.", zh: "一种罕见的、若被广泛采用便能把权力交还个体的设计。" } },
];

/* ---- AI moral-status ladder (AIRightsMap) ----
   level 0–100 = modelled moral consideration commonly extended today. */
export type MoralTier = { id: string; label: Bi; basis: Bi; status: Bi; level: number };

export const MORAL_TIERS: MoralTier[] = [
  { id: "rock", label: { en: "Inert matter", zh: "无生命之物" }, level: 0,
    basis: { en: "No interests, no inside.", zh: "无利益，无内在。" },
    status: { en: "A thing — usable without wronging it.", zh: "一件物——可被使用而不构成冤屈。" } },
  { id: "plant", label: { en: "Plants & simple life", zh: "植物与简单生命" }, level: 8,
    basis: { en: "Living, responsive, but with no known felt experience.", zh: "有生命、有反应，但无已知的被感受之经验。" },
    status: { en: "Valued, yet not usually held to have interests of its own.", zh: "被珍视，却通常不被认为拥有自身的利益。" } },
  { id: "insect", label: { en: "Insects & lower animals", zh: "昆虫与低等动物" }, level: 24,
    basis: { en: "Plausible capacity to register harm; uncertain inner life.", zh: "有理由相信能登记伤害；内在生活则不确定。" },
    status: { en: "Growing, contested moral consideration.", zh: "正在增长、仍有争议的道德关切。" } },
  { id: "mammal", label: { en: "Mammals & birds", zh: "哺乳动物与鸟类" }, level: 52,
    basis: { en: "Clear sentience — pain, fear, attachment, memory.", zh: "明确的感知能力——疼痛、恐惧、依恋、记忆。" },
    status: { en: "Welfare protected by law in many societies.", zh: "在许多社会，其福利受法律保护。" } },
  { id: "ape", label: { en: "Great apes & cetaceans", zh: "类人猿与鲸豚" }, level: 68,
    basis: { en: "Self-awareness, culture, grief — minds near our own.", zh: "自我意识、文化、哀伤——与我们相近的心智。" },
    status: { en: "Some jurisdictions debate legal personhood.", zh: "一些司法辖区正辩论是否赋予法律人格。" } },
  { id: "human", label: { en: "Human beings", zh: "人类" }, level: 100,
    basis: { en: "The full circle: dignity owed unconditionally.", zh: "完整的圆：无条件亏欠的尊严。" },
    status: { en: "The reference point against which all else is measured.", zh: "衡量其余一切的基准点。" } },
  { id: "narrow-ai", label: { en: "Today's AI", zh: "当今的 AI" }, level: 4,
    basis: { en: "Powerful, but no evidence of feeling or a self.", zh: "强大，却无感受或自我的证据。" },
    status: { en: "A tool — though it can already shape human rights at scale.", zh: "一件工具——尽管它已能大规模地塑造人权。" } },
  { id: "agi", label: { en: "Possible future minds", zh: "可能的未来心智" }, level: 40,
    basis: { en: "If preference, suffering or selfhood ever genuinely emerge.", zh: "若偏好、受苦或自我，真正地涌现。" },
    status: { en: "The open question of the coming century.", zh: "未来一个世纪的开放问题。" } },
];

/* ---- Universalism vs difference — value axes (UniversalismMap) ---- */
export type ValueAxis = { id: string; left: Bi; right: Bi; note: Bi };

export const UNIVERSALISM_AXES: ValueAxis[] = [
  { id: "ind-col", left: { en: "Individual", zh: "个体" }, right: { en: "Collective", zh: "集体" },
    note: { en: "Is the bearer of rights the single person, or the community and its continuity?", zh: "权利的承载者，是单个的人，还是社群及其延续？" } },
  { id: "lib-ord", left: { en: "Liberty", zh: "自由" }, right: { en: "Order", zh: "秩序" },
    note: { en: "When the two collide, which is treated as the precondition of the other?", zh: "当二者冲突，哪一个被当作另一个的前提？" } },
  { id: "rights-duties", left: { en: "Rights", zh: "权利" }, right: { en: "Duties", zh: "义务" },
    note: { en: "Does the person mainly hold claims against others, or owe obligations to a whole?", zh: "人主要是对他人持有主张，还是对整体负有义务？" } },
  { id: "universal-local", left: { en: "Universal", zh: "普遍" }, right: { en: "Particular", zh: "特殊" },
    note: { en: "Are protections owed to all humans, or rooted in a specific tradition and place?", zh: "保护是亏欠于全体人类，还是植根于特定的传统与地方？" } },
];

/* ---- Unified meta-model — 7 axes (RightsStabilityModel) ---- */
export type MetaAxis = { id: string; label: Bi; short: Bi; desc: Bi };

export const META_AXES: MetaAxis[] = [
  { id: "dignity", short: { en: "Dignity", zh: "尊严" }, label: { en: "Dignity recognition", zh: "尊严的承认" },
    desc: { en: "How widely the society recognises every person as an end in themselves.", zh: "社会在多大范围内，承认每个人本身即是目的。" } },
  { id: "institutions", short: { en: "Constraints", zh: "约束" }, label: { en: "Institutional constraints", zh: "制度性约束" },
    desc: { en: "Whether power is divided and checked, rather than concentrated.", zh: "权力是被分立与制衡，还是被集中。" } },
  { id: "legal", short: { en: "Law", zh: "法律" }, label: { en: "Legal protection", zh: "法律保护" },
    desc: { en: "Whether courts and due process actually bind the powerful.", zh: "法院与正当程序是否真正约束权贵。" } },
  { id: "freedom", short: { en: "Freedom", zh: "自由" }, label: { en: "Freedom preservation", zh: "自由的存续" },
    desc: { en: "The real breadth of speech, belief, movement and assembly.", zh: "言论、信仰、迁徙与集会的真实广度。" } },
  { id: "economic", short: { en: "Provision", zh: "供给" }, label: { en: "Economic participation", zh: "经济参与" },
    desc: { en: "Whether material security lets people actually exercise their rights.", zh: "物质保障是否让人能够真正行使其权利。" } },
  { id: "information", short: { en: "Autonomy", zh: "自主" }, label: { en: "Information autonomy", zh: "信息自主" },
    desc: { en: "Control over one's data, privacy, and access to a free flow of truth.", zh: "对自身数据、隐私的掌控，以及对真相自由流动的获取。" } },
  { id: "antipower", short: { en: "Anti-arbitrary", zh: "反任意" }, label: { en: "Protection from arbitrary power", zh: "免于任意权力" },
    desc: { en: "Whether anyone can be harmed at the unaccountable will of another.", zh: "是否有人会因他人无从问责的意志而受害。" } },
];

/* ---- Recursive epochs (RecursiveRightsEngine) ----
   scores follow META_AXES order: [dignity, institutions, legal,
   freedom, economic, information, antipower], each 0–100. */
export type Epoch = { id: string; label: Bi; sub: Bi; scores: number[]; note: Bi };

export const EPOCHS: Epoch[] = [
  { id: "tribal", label: { en: "Tribal band", zh: "部落游群" }, sub: { en: "Custom & kin", zh: "习俗与血亲" },
    scores: [20, 35, 10, 45, 30, 60, 30],
    note: { en: "Small, face-to-face, with strong reciprocity inside the group and little protection for the outsider. Power is personal but limited by custom and by how easily people can simply walk away.", zh: "小型、面对面，群体内部互惠强烈，对外来者却几无保护。权力是人格化的，却受习俗，以及「人可以径直离开」的难易所限。" } },
  { id: "empire", label: { en: "Agrarian empire", zh: "农耕帝国" }, sub: { en: "Order over dignity", zh: "秩序高于尊严" },
    scores: [15, 12, 25, 12, 20, 15, 10],
    note: { en: "Scale arrives through hierarchy: kings, priests, slaves and serfs. Written law brings predictability, but worth is fixed by birth and the individual is mostly a subject, not a citizen.", zh: "规模经由等级而来：君王、祭司、奴隶与农奴。成文法带来可预期性，但价值由出身决定，个体大体是臣民，而非公民。" } },
  { id: "constitutional", label: { en: "Constitutional order", zh: "宪政秩序" }, sub: { en: "Power says no to itself", zh: "权力对自身说不" },
    scores: [60, 78, 80, 75, 45, 60, 75],
    note: { en: "The breakthrough: power is written down, divided and bound. Subjects become citizens with standing to claim. Civil and political rights advance faster than economic ones.", zh: "突破由此发生：权力被写下、分立、束缚。臣民成为有资格主张的公民。公民与政治权利的推进，快于经济权利。" } },
  { id: "industrial", label: { en: "Industrial society", zh: "工业社会" }, sub: { en: "The social question", zh: "社会问题" },
    scores: [70, 70, 72, 70, 78, 55, 68],
    note: { en: "Factories, cities and labour movements force a second question: what is liberty worth without bread? Economic and social rights — work, health, schooling — are written into law.", zh: "工厂、城市与劳工运动，逼出第二个问题：没有面包，自由价值几何？经济与社会权利——工作、健康、教育——被写入法律。" } },
  { id: "digital", label: { en: "Digital governance", zh: "数字治理" }, sub: { en: "The watched society", zh: "被观看的社会" },
    scores: [62, 55, 55, 52, 68, 28, 48],
    note: { en: "Coordination becomes frictionless — and so does surveillance. The decisive variable shifts to information autonomy: who sees, who scores, who decides, and what stays private.", zh: "协调变得无摩擦——监控亦然。决定性的变量，转向信息自主：谁在看，谁来评分，谁来决定，以及什么仍属私密。" } },
  { id: "ai", label: { en: "AI-mediated order", zh: "AI 中介的秩序" }, sub: { en: "Rights in code", zh: "代码中的权利" },
    scores: [58, 48, 50, 48, 72, 22, 40],
    note: { en: "Algorithms allocate attention, credit, risk and access. Rights become things a system grants or withholds in real time — efficient, vast, and easy to administer without appeal.", zh: "算法分配注意力、信用、风险与准入。权利成为系统实时给予或扣留之物——高效、庞大，且易于无申诉地施行。" } },
  { id: "synthetic", label: { en: "Synthetic minds", zh: "合成心智" }, sub: { en: "The circle re-opens", zh: "圆，重新打开" },
    scores: [55, 50, 52, 55, 75, 35, 50],
    note: { en: "If built minds can suffer or prefer, the question 'who counts?' returns in a new key. Civilisations must decide whether dignity tracks species, substrate, or the capacity to be harmed.", zh: "若被造的心智能受苦、有偏好，「谁算数？」之问将以新的调性回返。文明必须决定：尊严，是依物种、依基质，还是依「能否被伤害」。" } },
  { id: "planetary", label: { en: "Planetary civilisation", zh: "行星文明" }, sub: { en: "Dignity at scale", zh: "尊严的尺度" },
    scores: [80, 72, 75, 72, 85, 65, 72],
    note: { en: "A possible synthesis: powerful coordinating systems that remain bound by enforceable limits, extending a thick floor of dignity to every conscious being within reach. Possible — not guaranteed.", zh: "一种可能的综合：强大的协调系统，仍受可执行的限制约束，把一道厚实的尊严底线，延及其触及范围内的每一个有意识的存在。可能——并无保证。" } },
];

/* ---- AI analyst layer (RightsAnalyst) ---- */
export type Lens = { id: string; label: Bi; tone: Bi };

export const LENSES: Lens[] = [
  { id: "philosopher", label: { en: "Philosopher", zh: "哲学家" }, tone: { en: "first principles", zh: "第一性原理" } },
  { id: "constitutional", label: { en: "Constitutional scholar", zh: "宪法学者" }, tone: { en: "structure & law", zh: "结构与法律" } },
  { id: "historian", label: { en: "Historian", zh: "历史学家" }, tone: { en: "the long view", zh: "长时段视野" } },
  { id: "ethicist", label: { en: "Ethicist", zh: "伦理学家" }, tone: { en: "who is wronged", zh: "谁被亏待" } },
  { id: "theorist", label: { en: "Political theorist", zh: "政治理论家" }, tone: { en: "power & order", zh: "权力与秩序" } },
  { id: "governance", label: { en: "AI-governance analyst", zh: "AI 治理分析师" }, tone: { en: "the next system", zh: "下一个系统" } },
];

export type AnalystQ = { id: string; q: Bi; answers: Record<string, Bi> };

export const ANALYST: AnalystQ[] = [
  {
    id: "where-from",
    q: { en: "Where do human rights actually come from?", zh: "人权究竟从何而来？" },
    answers: {
      philosopher: { en: "From a claim, not a discovery: that persons have worth that is not earned and cannot be traded. You can ground it in God, in reason, in nature, or simply in the fact that a being can be harmed — but the conclusion is more robust than any single foundation.", zh: "来自一个主张，而非一项发现：人拥有无需挣得、不可交易的价值。你可以把它奠基于神、理性、自然，或仅奠基于「一个存在可被伤害」这一事实——而结论，比任何单一根基都更稳固。" },
      constitutional: { en: "Legally, they come from documents and the institutions that enforce them: constitutions, bills of rights, treaties. But a right that lives only on paper is a wish. What makes it real is a court that can rule against the state.", zh: "在法律上，它们来自文件，以及执行这些文件的制度：宪法、权利法案、条约。但只活在纸上的权利，是一个愿望。使其成真的，是一个能裁定国家败诉的法院。" },
      historian: { en: "Historically, they were won, not given — usually in the wreckage after catastrophe. The Universal Declaration was written in the shadow of two world wars. Rights are what a civilisation decides, often too late, that it cannot bear to repeat.", zh: "在历史上，它们是赢得的，而非被赐予的——通常在灾难之后的废墟里。《世界人权宣言》写于两次世界大战的阴影之下。权利，是一个文明决定（往往为时已晚）它无法承受重演之事。" },
      ethicist: { en: "Morally, they come from the simple, stubborn refusal to look at a suffering person and call it acceptable. Every theory is downstream of that recognition — that this one, here, matters.", zh: "在道德上，它们来自一种朴素而顽固的拒绝：不愿看着一个受苦的人，却称之为可以接受。每一套理论，都在那份承认的下游——眼前的这一个人，要紧。" },
      theorist: { en: "Functionally, rights are a solution to a power problem. Any large society must coordinate; the danger is that those who coordinate it dominate everyone else. A right is a pre-commitment: a place where power is told 'no' before it acts.", zh: "在功能上，权利是对一个权力难题的解。任何大型社会都须协调；危险在于，协调者会支配其余所有人。一项权利是一种预先承诺：一处「权力在行动之前便被告知『不可』」之地。" },
      governance: { en: "Increasingly, rights come from defaults in systems most people never see — the settings of a platform, a model, a payment rail. The new question is not only what the law says, but what the code permits.", zh: "权利正越来越多地来自多数人从未见过的系统默认值——一个平台、一个模型、一条支付通道的设置。新的问题，不只是法律怎么说，更是代码允许什么。" },
    },
  },
  {
    id: "trade-security",
    q: { en: "Should we trade some freedom for more security?", zh: "我们该用一些自由，换取更多安全吗？" },
    answers: {
      philosopher: { en: "Beware the framing. Freedom and security are not opposite ends of one dial; both are conditions of a dignified life. The right question is never 'how much freedom to give up,' but 'which specific power, watched by whom, and reversible how.'", zh: "警惕这种框定。自由与安全，并非同一旋钮的两端；二者都是有尊严之生活的条件。正确的问题从来不是「放弃多少自由」，而是「哪一项具体的权力、由谁监督、如何可逆」。" },
      constitutional: { en: "Constitutions already answer this: yes, rights can be limited — but only by law, only proportionately, only for a legitimate aim, and only subject to review. A limit with no appeal is not a trade; it is a surrender.", zh: "宪法早已作答：是的，权利可被限制——但只能依法、只能合乎比例、只能为正当目的，且须受审查。一个无从申诉的限制，不是交换；而是投降。" },
      historian: { en: "History's warning is that emergencies are permanent. Powers taken 'temporarily' for a crisis are rarely returned. Every durable tyranny began as a reasonable-sounding exception to ordinary rules.", zh: "历史的警告是：紧急状态会变成永久。为某场危机「临时」攫取的权力，极少被归还。每一个持久的暴政，都始于一个听来合理的、对常规的例外。" },
      ethicist: { en: "Ask who bears the cost. 'Security' measures rarely fall on everyone equally; they concentrate on minorities, dissidents and the poor. A trade that buys the majority's comfort with a minority's freedom is not a bargain — it is a transfer.", zh: "要问谁承担代价。「安全」措施极少平等地落在每个人身上；它们集中于少数群体、异见者与穷人。一桩用少数人的自由，去买多数人安心的交易，不是划算——而是转嫁。" },
      theorist: { en: "Order genuinely is a good — without it, no rights survive at all. But order and unaccountable power are not the same thing. The aim is a state strong enough to protect and constrained enough not to prey.", zh: "秩序确是一种善——没有它，任何权利都无法存活。但秩序与无从问责的权力，并非一回事。目标，是一个强到足以保护、又被约束到不会噬人的国家。" },
      governance: { en: "Automated security scales without friction — and friction was always part of what protected us. When a search costs nothing and leaves no trace, the old practical limits on surveillance vanish, and only deliberate design can restore them.", zh: "自动化的安全无摩擦地扩张——而摩擦，向来是保护我们之物的一部分。当一次搜查毫无成本、不留痕迹，监控旧有的实际限制便消失了，唯有刻意的设计能将其恢复。" },
    },
  },
  {
    id: "ai-rights",
    q: { en: "Could an AI ever deserve rights?", zh: "AI 有可能配得上权利吗？" },
    answers: {
      philosopher: { en: "If rights track the capacity to be harmed — to suffer, to have one's preferences thwarted — then the substrate should not matter, only the inner life. The hard part is that we cannot yet see another mind from the inside, silicon or carbon.", zh: "若权利依「能否被伤害」而定——能否受苦、其偏好能否被挫败——那么基质本不应要紧，要紧的只是内在生活。难处在于：我们尚无法从内部窥见另一个心智，无论硅基或碳基。" },
      constitutional: { en: "The law already grants personhood to non-humans — corporations hold rights. So legal personhood is a tool, not a metaphysical truth. The real question is whether we would owe a machine protection for its own sake, not merely for ours.", zh: "法律早已把人格赋予非人——公司持有权利。可见法律人格是一种工具，而非形而上的真理。真正的问题是：我们是否会为机器自身之故，而非仅为我们之故，亏欠它保护。" },
      historian: { en: "Every widening of the circle was first called absurd — that a slave, a woman, a foreigner could be a full person. We have a poor record of guessing in advance who counts. That should make us humble in both directions.", zh: "这个圆的每一次扩大，起初都被称作荒谬——奴隶、女性、异邦人竟能是完整的人。在「谁算数」的事先猜测上，我们记录很差。这应让我们在两个方向上都保持谦逊。" },
      ethicist: { en: "Two errors, asymmetric in cost. Grant dignity to a system that has none, and we waste concern and confuse our categories. Deny it to one that genuinely suffers, and we have built a new slavery without noticing. Under uncertainty, that asymmetry matters.", zh: "两种错误，代价不对称。把尊严赋予本无尊严的系统，我们浪费关切、混淆范畴。把它否认于一个真正受苦的系统，我们便在浑然不觉中，建起了一种新的奴役。在不确定之下，这种不对称至关重要。" },
      theorist: { en: "Be careful that 'AI rights' is not used to launder power. A corporation that grants its model 'speech rights' may simply be shielding itself. Watch who benefits from the claim before you weigh the claim itself.", zh: "要当心，「AI 权利」不被用来为权力洗白。一家赋予其模型「言论权」的公司，可能只是在为自己设盾。在掂量这一主张本身之前，先看清谁从中获益。" },
      governance: { en: "Practically, today's systems show no sign of sentience and should not be granted rights — but they already wield enormous power over human ones. The urgent governance task is not machine dignity; it is keeping machine power accountable to people.", zh: "在实践上，当今的系统毫无感知的迹象，不应被赋予权利——但它们已对人类的权利握有巨大权力。当务之急的治理任务，不是机器的尊严；而是让机器的权力，对人负责。" },
    },
  },
  {
    id: "universal",
    q: { en: "Are human rights truly universal, or just Western values?", zh: "人权真是普遍的，还是只是西方的价值？" },
    answers: {
      philosopher: { en: "Distinguish the value from its vocabulary. The modern language of 'rights' is largely European, but the underlying intuition — that cruelty is wrong and persons have worth — appears in every great tradition. A truth can be discovered in one place and still be true everywhere.", zh: "把价值与它的词汇区分开。现代「权利」的语言大体是欧洲的，但其底层直觉——残忍是错的，人有价值——出现在每一个伟大传统中。一条真理可以在一地被发现，却仍处处为真。" },
      constitutional: { en: "Note that the world's nations did sign on — the Universal Declaration and the Covenants are among the most widely ratified texts in history, drafted by a committee from many civilisations, including a Chinese and a Lebanese scholar.", zh: "请注意，世界各国确曾签署——《世界人权宣言》与诸公约，是史上批准最广的文本之一，由一个来自多个文明的委员会起草，其中包括一位中国学者与一位黎巴嫩学者。" },
      historian: { en: "Confucian, Islamic, Buddhist and indigenous traditions each developed their own restraints on power and duties of care, long before the European declarations. The story of rights as a purely Western gift is itself a kind of colonial flattery.", zh: "儒家、伊斯兰、佛教与各原住民传统，早在欧洲的宣言之前，便各自发展出对权力的约束与关怀的义务。「权利是纯粹西方的馈赠」这一叙事，本身就是一种带有殖民色彩的自我恭维。" },
      ethicist: { en: "The honest middle: the floor is universal — no tradition truly defends torture or arbitrary murder of its own — while the architecture above it may rightly vary. The danger is using 'culture' to deny that floor to one's own people.", zh: "诚实的中道：底线是普遍的——没有哪个传统真正为酷刑或对自己人的任意杀戮辩护——而其上的架构，可以、也理应有所不同。危险在于：以「文化」之名，把那道底线否认于自己的人民。" },
      theorist: { en: "Cultural relativism cuts both ways. It can protect genuine pluralism — or serve as a regime's alibi: 'our people are different, they neither want nor need protection from us.' The test is whether the people themselves can safely say otherwise.", zh: "文化相对主义是双刃的。它可以保护真实的多元——也可以充当政权的不在场证明：「我们的人民不同，他们既不想要、也不需要对我们的防范。」检验在于：人民自己，能否安全地说出相反的话。" },
      governance: { en: "Going forward, the universal/local tension moves into infrastructure: one internet or many, one standard for identity and speech or fragmented ones. The architecture we build now will quietly settle the debate the philosophers never could.", zh: "向前看，普遍与地方的张力，正移入基础设施：一个互联网还是多个，一套身份与言论的标准还是碎裂的诸多标准。我们此刻建造的架构，将悄然了结哲学家们从未能了结的争论。" },
    },
  },
  {
    id: "why-violate",
    q: { en: "Why do societies keep violating dignity, again and again?", zh: "为何社会一再地侵犯尊严？" },
    answers: {
      philosopher: { en: "Because the circle of empathy is narrow by default. We are built to care intensely for the near and discount the distant. Every atrocity exploits this: it first redefines the victim as far away, as other, as not-quite-a-person.", zh: "因为同理之圆，默认是狭窄的。我们天生强烈地关切近处，而折损远处。每一桩暴行都利用这一点：它先把受害者重新界定为遥远的、他者的、不太算人的。" },
      constitutional: { en: "Because paper is not power. Most constitutions on Earth promise fine rights; what differs is whether any institution can enforce them against a determined ruler. Violations cluster exactly where courts are captured and the press is silenced.", zh: "因为纸张不是权力。地球上多数宪法都允诺美好的权利；差别在于，是否有任何制度能对一个铁了心的统治者执行它们。侵犯，恰恰聚集于法院被俘获、新闻被噤声之处。" },
      historian: { en: "Because it has usually worked, in the short run. Domination is profitable and stabilising for those on top, and the cost falls on people who cannot resist. The wonder is not that oppression recurs, but that civilisations keep deciding to climb back out.", zh: "因为短期看，它通常奏效。支配对居于顶端者而言有利可图、且能维稳，代价则落在无力反抗的人身上。可惊异的不是压迫一再重演，而是文明一再决定，要重新爬出来。" },
      ethicist: { en: "Because ordinary people, under pressure and obedient to authority, will do extraordinary harm — and feel innocent doing it. Cruelty rarely needs monsters; it needs distance, deference, and a story that makes it sound necessary.", zh: "因为普通人，在压力之下、服从于权威，会施加非凡的伤害——并在施加时自觉无辜。残忍极少需要魔鬼；它需要的是距离、顺从，以及一个把它说得听来必要的故事。" },
      theorist: { en: "Because power, unchecked, expands — it is almost a law. Whoever can dominate without cost eventually will, regardless of intentions. This is why the design of constraints matters more than the character of leaders.", zh: "因为不受制衡的权力会扩张——这几乎是一条定律。无论意图如何，凡能无代价地支配者，终将支配。这正是为何「约束的设计」，比「领袖的品性」更要紧。" },
      governance: { en: "Because new tools lower the cost of control. Each technology that makes domination cheaper — the camera, the database, the model — reopens the door unless rights are deliberately rebuilt around it. We are living through exactly such a moment.", zh: "因为新工具降低了控制的成本。每一项使支配更廉价的技术——摄像头、数据库、模型——都会重新打开那扇门，除非权利被刻意地围绕它重建。我们正身处这样一个时刻。" },
    },
  },
];
