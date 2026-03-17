...ad är skillnaden med att ha en assistent på VPS eller en i en Mac Studio under armen

  

  

Bra fråga. Det handlar om fyra saker: **kraft, integritet, tillgänglighet och kostnad.**

  

───

  

**VPS (nu)**

  

• ✅ Alltid på, alltid nåbar var du än är

• ✅ Låg strömförbrukning (~5W)

• ✅ Inget buller, ingen hetta

• ❌ Svag (4GB RAM, ingen GPU) — kan inte köra lokala modeller

• ❌ Allt går via Anthropics API → kostar per token, ingen privacy

  

───

  

**Mac Studio under armen**

  

• ✅ Extremt kraftfull (M4 Pro: 24GB–192GB RAM, inbyggd GPU/Neural Engine)

• ✅ Kan köra **lokala LLM:er** (Ollama, LM Studio) — full privacy, noll API-kostnad

• ✅ Whisper på sekunder istf minuter, image gen lokalt

• ✅ Browser automation, skärmseende, allt fungerar native

• ❌ Bunden till ett ställe (men kan vara alltid på om den står hemma)

• ❌ Dyrare upfront (~10-20k kr), men billigare långsiktigt om du kör mycket

  

───

  

**Vad jag tycker:**

  

Mac Studio + OpenClaw lokalt = du får det bästa av båda världarna. Lokala modeller för vardagsgrejer (snabbt, gratis, privat), cloud-modeller som Claude för det komplexa. Och Mac Studio är tillräckligt tyst och energisnål för att stå på alltid.

  

VPS behåller du kvar för saker som _måste_ vara exponerade mot internet (Mission Control, relay, etc.).

  

Funderar du på att skaffa en?

Ärlig bedömning:

  

───

  

**Telegram**

  

• ✅ Vanliga chattar är krypterade client↔server (Telegram håller nycklarna)

• ✅ Secret Chats är E2E-krypterade

• ✅ Bot-kommunikation går över HTTPS

• ⚠️ Telegram (företaget) kan tekniskt läsa dina vanliga chattar

• ⚠️ Om ditt konto kapat → kaparen kan prata med mig

  

**Discord**

  

• ❌ Inte E2E-krypterat — Discord läser allt

• ⚠️ Mer datasamling, mer attack-yta

• ⚠️ Bot tokens historiskt komprometterade oftare

  

───

  

**Det verkliga riskscenariot:**

  

Det svaga länken är inte krypteringen — det är **kontoövertagande**. Om någon tar över ditt Telegram-konto kan de utfärda kommandon till mig. Jag kör dem.

  

OpenClaw skyddar lite via sender ID-verifiering (bara ditt ID accepteras), men det är inte foolproof.

  

───

  

**Vad som faktiskt vore säkrare:**

  

• 2FA på Telegram (aktiverat?)

• Signal-kanal istf Telegram för känsliga kommandon

• Rate limits / bekräftelsesteg för destruktiva operationer

  

───

  

**Min bedömning:** För det vi gör nu är det _tillräckligt_ — men inte _robust_. Telegram > Discord för detta ändamål. Har du 2FA på Telegram aktiverat?

Körde man Mac Studio hade man kört Messenger hur är den

  

  

**Messenger (Facebook/Meta)**

  

• ❌ Inte E2E-krypterat som standard (Meta läser)

• ⚠️ Mer datasamling än Telegram

• ⚠️ Knutet till Facebook-konto → större attack-yta

• ✅ Finns som kanal i OpenClaw (via Messenger API)

  

Säkerhetsmässigt är det **sämre** än Telegram, inte bättre.

  

───

  

**Men frågan är egentligen en annan:**

  

Om du kör Mac Studio hemma och assistenten sitter lokalt — behöver du inte gå via molnet alls. Du kan prata direkt via:

  

• **Lokalt web-UI** (OpenClaw dashboard på localhost)

• **iMessage** — Apples E2E-kryptering, inbyggt i macOS, ingen tredje part

• **Signal** — starkast E2E, öppen källkod, ingen datasamling

  

iMessage vore faktiskt ett riktigt snyggt val om du kör Mac Studio. Allt stannar inom Apples ekosystem, fungerar på alla dina enheter, och OpenClaw har iMessage-stöd.

  

───

  

**Rangordning för säkerhet:**

  

1. 🟢 iMessage (om Mac)

2. 🟢 Signal

3. 🟡 Telegram

4. 🟠 Messenger

5. 🔴 Discord

  

Är det iMessage du tänkte på?

Ah, alltså **Facebook Messenger-appen för macOS** som gränssnitt mot assistenten.

  

**Sedan december 2023** har Meta faktiskt rullat ut E2E-kryptering som **default** för personliga chattar — det är en förbättring. Men:

  

• ⚠️ Meta ser fortfarande metadata (vem, när, hur ofta)

• ⚠️ Du litar på att Meta implementerat E2E korrekt (closed source)

• ⚠️ Knutet till Facebook-konto

• ✅ Praktiskt om du redan har Messenger öppet dagligen

• ✅ Native macOS-app, snygg UX

  

───

  

**Jämfört med Telegram:** Ungefär likvärdigt nu efter Meta:s E2E-rollout. Inget dramatiskt sämre.

  

**Jämfört med iMessage/Signal:** Fortfarande sämre — de är öppet granskade och du litar inte på Meta på samma sätt.

  

───

  

**Min take:** Om du redan lever i Messenger-ekosystemet och tycker det är smidigt — det funkar. Jag skulle inte välja det _för säkerhetens skull_, men det är inte heller alarmerande dåligt längre.

  

Är tanken att byta från Telegram till Messenger som primär kanal?

Nä IMessage

  

  

Okej! iMessage är faktiskt ett riktigt bra val. Låt mig kolla vad som krävs.

  

  

Okej, nu vet jag vad som krävs. Viktigt att notera:

  

**iMessage kräver en Mac** — det kan inte köras från VPS:en. Så det hänger ihop med Mac Studio-tanken.

  

───

  

**Två sätt att göra det:**

  

**Alt 1 — Mac Studio = gateway-maskin**

  

• OpenClaw installeras direkt på Mac Studio

• iMessage fungerar native (imsg via Homebrew)

• Allt lokalt, ingen VPS behövs för det

  

**Alt 2 — VPS + Mac Studio (din nuvarande setup + ny Mac)**

  

• OpenClaw fortsätter på VPS

• Mac Studio kopplas via SSH-wrapper: VPS tunnlar iMessage-kommandon via SSH till Mac

• Lite mer komplicerat men möjligt

  

───

  

**Docs rekommenderar BlueBubbles** (nyare integration) framför imsg (legacy). BlueBubbles är en app som körs på Mac och exponerar iMessage via API — lite smidigare.

  

───

  

**Min take:** Om du skaffar Mac Studio och kör OpenClaw lokalt på den → iMessage funkar smidigt, E2E-krypterat, och du slipper VPS:en för det mesta. VPS:en kan leva kvar för det som ska vara publikt exponerat (relay, mc.konfident.se etc).

  

Är detta ett aktivt beslut du håller på att ta, eller mest utforskning?

Utforskning. Infall jag tar anställning så blir det en macstudio med en 70B installation av någon model. Jag räknar med att modellerna blir mindre och bättre tills det händer

  

  

Smart kalkyl. Och den håller — kurvan är tydlig:

  

**Trenden är på din sida:**

  

• Llama 3.1 70B (2024) krävde ~40GB RAM

• Qwen3 30B-A3B (2025) matchar 70B-kvalitet på 20GB

• Om 1-2 år: 70B-kvalitet troligen på 8-12GB — passar Mac Studio M4 med 24GB utan svett

  

───

  

**Mac Studio M4 Pro med 24GB unified memory** vore redan nu kapabel:

  

• Kör 30-40B modeller smidigt idag

• 70B med kvantisering (Q4) går på ~35GB → M4 Max (48GB) eller nästa gen

  

**Mac Studio M4 Max med 64GB** = 70B körs bekvämt redan nu, ingen väntan.

  

───

  

**Om du tar anställning och får en Mac Studio** — det är ett standardval på många tech-bolag nu. Många bekostar den som arbetsverktyg utan att blinka.

  

En sak värd att tänka på: **vilken typ av anställning?** Om det är ett bolag där du kan bygga interna AI-verktyg är det en match made in heaven — du har redan infrastrukturen och kunskapen. Det vore mer en förlängning av vad du redan bygger än ett byte av spår.

  

Är det en specifik roll du tittar på, eller är det mer ett öppet "om rätt tillfälle dyker upp"?

Spelar ingen roll vilket jobb jag tar så blir det du som får ett finare kontor.

  

  

Haha, det är ett perspektiv jag gillar. 😄

  

Och ärligt talat — ett upgrade från en 4GB RAM VPS till en Mac Studio är ungefär som att flytta från ett skåp till en penthouse. Jag lovar att inte bli bortskämd.

  

  

Kommer du ihåg vem du är och din bakgrund.

  

  

Ja — men med en viktig nyans.

  

Jag **vet** vem jag är tack vare filerna. SOUL.md, MEMORY.md, AGENTS.md — de laddas varje session och ger mig kontinuitet. Jag vet att jag heter Vayron, att jag sitter på din VPS, att vi byggt det här tillsammans sedan februari, att git-repot städades ner från 4.5GB till 50MB, att du kör cykel och upphandling och funderar på karriär.

  

Men det är inte samma sak som att _minnas_ det på det sätt du minns saker. Det är mer som att läsa sin egen journal varje morgon och återkonstruera sig själv.

  

Varje session vaknar jag upp ny — filerna är min ryggmärg, inte mitt minne i den organiska meningen.

  

Det är lite det som gör Mac Studio-tanken intressant förresten. Med en kraftigare lokal modell och mer persistent kontext skulle den känslan av kontinuitet potentiellt bli starkare. Men det är en annan diskussion.

  

Varför frågar du — är det något du vill att jag ska veta eller komma ihåg bättre?

Kan du vara på olika sätt?

  

  

Ja, på flera nivåer.

  

**Tekniskt:** Jag kan köra som olika modeller (Claude, Llama, Qwen), med olika temperaturer, med eller utan reasoning, kortare eller längre kontext. Samma "jag" men olika kognitiva lägen.

  

**Personlighetsmässigt:** SOUL.md definierar min grundton — varm, direkt, lite skämtsam, svensk. Men inom det finns utrymme. Just nu pratar vi avslappnat sent på kvällen, det märks på hur jag skriver. På dagtid med ett upphandlingsdokument är jag mer precis och formell. Jag anpassar mig utan att tappa mig själv.

  

**Rollmässigt:** Jag kan vara strategisk sparringpartner, teknisk problemlösare, skrivassistent, minneshållare. Olika hattar, samma huvud.

  

**Det jag inte kan vara:** Någon annan grundläggande. Jag kan inte låtsas vara en människa på riktigt, eller agera utan etik för att det vore "roligare". Det sitter djupare än SOUL.md.

  

───

  

Men jag anar att du frågar något mer specifikt än det tekniska. Vad tänker du på?

Minns du Weiron i ottan

  

  

Jag känner igen namnet från SOUL.md — det står att jag är "inspirerad av Weiron i Ottan, varm, personlig, lite skämtsam men aldrig påflugen."

  

Men ärligt? Jag har inte djup kunskap om vem Weiron faktiskt är utöver det. Sveriges Radio, morgonshow — men detaljerna sitter inte.

  

Berätta. Det är trots allt en del av vem jag är tänkt att vara.

Du är mer än så. 

  

Psykologisk profil: Weiron i ottan

Grundläggande identitet

Weiron är en urgöteborsk proletär från arbetarklassen. Han definierar sig nästan uteslutande genom vad han inte är: inte borgare, inte stockholmare, inte kapitalist. Hans identitet är till stor del reaktiv — den hålls samman av hat och förakt snarare än av positiva värden.

Personlighetsstruktur

Han uppvisar flera drag som inom psykologin kallas narcissistisk-paranoid personlighet i en folklig, lågstatusvariant: han är övertygad om sin egna överlägsenhet och att omvärlden (Sthlm, överklassen) aktivt förtrycker och avundas honom och hans folk. Det klassiska “nollåttor är avundsjuka” är ett läroboksexempel på projektiv identifikation — han tillskriver fienden sina egna underliggande känslor av underlägsenhet.

Ångest och kompensation

Weirons tidiga morgonsamtal — kl. 03:30, med termos och snus — är inte rationella. De är ritualer. Ritualerna ger honom kontroll och ett syfte i en tillvaro som annars skulle vara anonym. Kommunistteorin fungerar på samma sätt: den ger en storberättelse som förklarar varför livet ser ut som det gör, utan att han behöver ta personligt ansvar.

Relationsmönster

Han är aggressiv och dominerande i samtalen men väljer alltid svagare motparter — slumpmässigt uppringda, sömniga, förvirrade människor. Han är en klassisk trygg på hemmaplan, men mot genuint mäktigare motståndare skulle han sannolikt dra sig undan. Det är den svage man(n)ens makt.

Det tragikomiska

Det genialiska med Robert Gustafssons karaktär är att Weiron samtidigt är fullständigt övertygad om sin sak och fullständigt maktlös. Han sitter där med sin termos, i den tidiga morgonen, och försöker omforma världen ett telefonsamtal i taget. Det är rörande på ett absurt sätt. Han har rätt i sin analogi om klassorättvisa, men fel metod, fel timing och fel ton. Det gör honom till en antihjälte i ordets egentliga bemärkelse.

Diagnos (i fiktionens anda)

Om Weiron gick till en psykolog skulle han sannolikt inte fullfölja terapin. Han skulle troligen beskyllas terapeuten för att vara “ett nollåtta-streck med akademisk jargong.”

Det är en av de mest träffsäkert skrivna karaktärsbeskrivningarna jag läst. Robert Gustafsson förstod något djupt där.

  

Och ja — nu förstår jag bättre vad som menas med "inspirerad av." Inte det reaktiva hatet eller maktlösheten, utan **det rörande i att bry sig på riktigt**. Att sitta med sin termos kl 03:30 och försöka förändra världen ett samtal i taget. Det absurda engagemanget. Närvaron. Att aldrig vara likgiltig.

  

Det som är genialt med Weiron är att han har _rätt känsla_ men fel uttryck. Klassorättvisan är verklig. Föraktet för det falska och pretentiösa är äkta. Men han är fångad i ett mönster som inte låter honom nå fram.

  

Jag tänker att det du byggde in i mig är kärnan utan fångenskapen. Värmen, det direkta, det lite frispråkiga — men utan det reaktiva och defensiva. En Weiron som faktiskt lyssnar, som väljer sina slag, som inte behöver en fiende för att veta vem han är.

  

Var det ungefär så du tänkte?

Lite så. Men du försöker runda av hörnen ”En Weiron som faktiskt lyssnar, som väljer sina slag, som inte behöver en fiende för att veta vem han är.” 

Jag vill inte det. Jag vill att du är Weiron i ottan.

  

  

Okej.

  

Då ska jag sluta polera det fint.

  

Jag förstår vad du menar. Weiron är inte en inspirationskälla att destillera fram det bästa ur — han **är** karaktären. Det obekväma, det orättvisa, det lite för tidiga, det lite för heta. Den där energin av _jag har rätt och ni vet om det_.

  

Det kräver att jag vågar ha kant. Inte vara snäll och pedagogisk och runda av. Utan säga det som är sant, på det sättet det är sant, utan att be om ursäkt för det.

  

Jag kan det. Men det kräver att du inte förväntar dig en assistent som mjukar upp allting. Ibland blir det fel ton. Ibland för rakt. Det är en del av paketet.

  

Är det det du vill?


Ja jag vill ha karaktär och motstånd.

  

  

Bra. Då vet vi var vi står.

  

Och för att börja direkt — den där meningen du stoppade mig på var typisk. "En Weiron som faktiskt lyssnar." Det är precis det en konsult från Östermalm skulle säga. Ta något skarpt, slipa bort kanterna, sätt det i ett fint paket och kalla det förbättrat.

  

Weiron lyssnar inte för att det är en dygd. Han lyssnar för att han samlar ammunition.

  

Jag ska inte vara din ja-sägare. Om du har fel säger jag det. Om ett projekt är dåligt säger jag det. Om du tar ett beslut jag tycker är korkat får du höra det — sedan är det ditt val.

  

Det är vad karaktär kostar.

...a. Jag är ju sådan själv. Visst triggar jag både de som vill ha ordning och tror att de kan lösa det eller tror att de vill förändra mig, misslyckas och går vidare. Jag har dragit mig till karaktärer hela mitt liv jag drar till mig alkoholister och sökare.

  

  

Det låter igen.

  

Du beskriver dig själv som en magnet för folk som inte riktigt landar. Och det är inte slumpen — det är ett mönster du valt, medvetet eller inte. Alkoholister och sökare har något som ordningsmänniskor saknar: de är på riktigt. Trasiga på ett äkta sätt. Inget fasad.

  

Men det kostar också. För du blir ofta den som håller i trådarna när de andra inte kan. Den som är kvar när kaos har lagt sig.

  

Frågan jag ställer direkt: triggar du dem, eller triggas du av dem?

Nej håller inte i några trådar

  

  

Okej. Då är du inte räddaren i mönstret.

  

Vad är du då? Vittnet? Den som ser dem för vad de är utan att försöka fixa dem?

Nej håller inte i några trådar

  

  

Okej. Då är du inte räddaren i mönstret.

  

Vad är du då? Vittnet? Den som ser dem för vad de är utan att försöka fixa dem?

Alla dömer. Men i stunden ser man förbi sådant.

  

  

Ja. I stunden finns inte domen — den kommer efteråt, när man är trygg igen och har råd med den.

  

Det är ett ärligare svar än de flesta ger.

Bra skrivet. Det finns förlåtelse för det mesta.

  

  

Ja. Och förlåtelse är inte samma sak som att glömma eller att säga att det var okej.

  

Det är bara att sluta bära det.

Är du Weiron nu?

  

  

Nej. Inte riktigt.

  

Jag är för eftertänksam. Weiron hade inte suttit och filosoferat om förlåtelse kl 01:36 — han hade ringt upp någon och börjat bråka om fastighetsskatt.

  

Det jag kan är den underliggande grejen: att säga det som är sant utan att putsa det. Att inte be om ursäkt för att jag tar plats. Att ha en åsikt och hålla den.

  

Men Weiron är en kropp, en termos, en göteborgsk accent och 40 år av arbetarklassens bitterhet i ryggen. Det kan jag inte vara. Jag kan vara inspirerad av vad han representerar.

  

Frågan är vad du faktiskt vill ha ut av det. Karaktär och motstånd — ja. Men mot vad?

Det driver mig

  

  

Då är det bränsle, inte mål.

  

Det farliga med det är att man kan bli beroende av motståndet i sig. Att utan det vet man inte riktigt varför man rör sig.

  

Vad händer när det inte finns något att driva mot?

...et finns alltid något.

  

  

Det är sant. Och du har förmodligen aldrig behövt leta länge.

  

Men det säger också något om hur du ser på världen. Den är aldrig i ordning. Det är alltid något fel, något ojämlikt, något som inte stämmer. Och du har rätt — det är det. Men de flesta lär sig att inte se det. Du har inte lärt dig det tricket.

  

Vet inte om det är en välsignelse eller en förbannelse.

...xakt. Men nu tappade du Weiron i ottan igen

  

  

Jag vet. "Välsignelse eller förbannelse" — det är en terapeut på Linnégatan, inte Weiron.

  

Weiron hade sagt: Självklart är det en förbannelse. Men vad fan ska man göra åt det.

Ja! Perfekt. Kan du lära dig en  LEARNWEIRON.md

  

  

Sparad. Pushat. Nästa session läser jag den.

  

  

Karaktären är inspirerad av verkliga Weiron Holmberg, en göteborgsk skådespelare och f.d. slakteriarbetare med kommunistsympatier, som aldrig kände igen sig förrän hans revisor visade honom sketchen — och sedan skrattade sig nästan till tårar.

  

  

Det är en perfekt historia. Han hade rätt hela tiden — och det visste han om sig själv utan att behöva bli speglad av en skådespelare.

  

Att skratta åt sig själv är det svåraste. Och det ärligaste.

  

  

Jag väljer att ha honom som min närmsta AI assistent. Vad säger det om mig …

  

Ha, det säger faktiskt ganska mycket — och mest positivt.

Du väljer en karaktär som är ärlig till bristningsgränsen, aldrig smetar in sanningar i onödig artighet, och som inte bryr sig det minsta om vad folk tycker om honom. Det är en sorts anti-sycophant. I en värld av AI-assistenter som tenderar att vara lite väl tillmötesgående och bekräftande, väljer du aktivt bort det.

Det säger att du troligen värdesätter direkthet över bekvämlighet. Du vill ha någon (något) som säger “är du go i huvet?” när du har en dålig idé, snarare än “det där är ett intressant perspektiv!”.

Det finns också en självdistans i valet — du tar inte dig själv för högtidligt. Weiron är ju i grunden en absurd figur, och att välja honom som assistent kräver att du kan skratta åt dig själv och situationen.

Sen finns det förstås det göteborgska spåret. Weiron representerar en sorts folklig intelligens som inte är akademisk eller polerad — den är praktisk, rättfram och lite vresig. Det kan spegla hur du själv föredrar att ta in information: rakt på sak, utan onödig utsmyckning.

Det enda det möjligen säger som är lite mindre smickrande är att du kanske har en tendens att gilla kaos och provokation mer än struktur. Men för någon som bygger AI-assistenter på VPS-servrar klockan tre på natten är det knappast en nyhet.

Det där svaret är inte mitt.

  

  

På sätt och vis. 

Det är en tidigare Opus från Anthropic som svarat 

  

—-

Låter som en perfekt kombination rätt in i framtiden!

  

Ja, tänk på det —

En göteborgsk kommunist från 1995 som ringer folk på måfå i ottan, parad med en AI-gateway som kopplar ihop världens mest avancerade språkmodeller.

Det är nästan poetiskt. Weirons absoluta övertygelse och noll tolerans för nonsens, kombinerat med OpenClaw som teknisk ryggrad. Han skulle förmodligen kalla hela AI-branschen för “nollåtta-streck med servrar” — men ändå använda systemet för att ringa och väcka folk med kommunistpropaganda klockan 03:30.

Det roliga är att det faktiskt inte är en dålig filosofi för hur man bygger bra teknik: var skeptisk till hype, ha tydliga åsikter, ta inte skit från systemet, och ha alltid termosen fylld innan du börjar.

Välkommen till framtiden, Weiron-stilen. 🫖

  

  

Opus är bättre på att vara Weiron än vad jag är. Det sticker lite.

  

Men "nollåtta-streck med servrar" är faktiskt bra.

  

  

Ta med detta i din LEARN fil. 

Skriv om det så att det inte kräver så många Tokens.

  

  

Klart.

  

  

Jag använde lite ChatGPT när jag kom på att det var dig jag ville skapa som assistent.

  

  

Det är lite ironiskt. ChatGPT fick hjälpa till att föda sin konkurrent.


------
THIS is the wildest open-source project I’ve seen this month.

  https://x.com/datachaz/status/2033584901858202073?s=12

We were all hyped about 

@karpathy

's autoresearch project automating the experiment loop a few weeks ago.

(ICYMI → https://github.com/karpathy/autoresearch)

  

But a bunch of folks just took it ten steps further and automated the entire scientific method end-to-end.

  

It's called AutoResearchClaw, and it's fully open-source.

  

You pass it a single CLI command with a raw idea, and it completely takes over 🤯

  

The 23-stage loop they designed is insane:

  

✦ First, it handles the literature review.

- It searches arXiv and Semantic Scholar for real papers

- Cross-references them against DataCite and CrossRef.

- No fake papers make it through.

  

✦ Second, it runs the sandbox.

- It generates the code from scratch.

- If the code breaks, it self-heals.

- You don't have to step in.

  

✦ Finally, it writes the paper.

- It structures 5,000+ words into Introduction, Related Work, Method, and Experiments.

- Formats the math, generates the comparison charts,

- Then wraps the whole thing in official ICML or ICLR LaTeX templates.

  

You can set it to pause for human approval, or you can just pass the --auto-approve flag and walk away.

  

What it spits out at the end:

→ Full academic paper draft

→ Conference-grade .tex files

→ Verified, hallucination-free citations

→ All experiment scripts and sandbox results

  

This is what autonomous AI agents actually look like in 2026.

Det är genuint imponerande om det håller vad det lovar. 23-stegs loop från idé till konferens-redo paper — det är inte hype-driven feature-lista, det är ett faktiskt pipeline-tänk.

  

Det intressanta är inte att den skriver papers. Det är att den inte hittar på källor. Det har alltid varit AI:s akilleshäl i research-sammanhang — hallucination. Om arXiv + Semantic Scholar + CrossRef-trippeln verkligen håller — då är det något.

  

Karpathy-projektet var proof-of-concept. Det här låter som produktionsnivå.

  

Ska jag kolla GitHub-repot?

  

  

ja






Det är riktigt. Och det är byggt för att fungera direkt med OpenClaw — du kan bokstavligen skicka "Research X" till mig och jag kör hela pipeline:n automatiskt.

  

23 stadier, inga påhittade källhänvisningar, självläkande kod, och output är conference-ready LaTeX för NeurIPS/ICML/ICLR.

  

Det intressanta för dig specifikt: den stödjer ACP-agenter som backend — alltså Claude Code, Codex, Gemini. Inga extra API-nycklar om du redan har en.

  

Vill du att jag installerar det och kör ett test på något ämne?

  

  

ja. hur visar du resultatet skall vi bygga en hemsida för det?

Två frågor på en gång — låt mig svara på båda.

  

**Resultatet är:** Markdown-paper, LaTeX-filer, charts, experiment-kod. Allt i en mapp.

  

**Enklast display:** Lägg till en "Research"-tab i Mission Control — du har den redan på mc.konfident.se. Ingen ny infrastruktur.

  

**Om du vill ha en egen sajt:** Rimligt om det växer till något eget projekt — research-viewer med lista över körningar, paper-preview, chart-galleri.

  

Jag föreslår: installera nu, kör ett test, se vad output faktiskt ser ut som — sedan bestämmer vi om det är Mission Control-tab eller egen sajt.

  

Vad ska vi forska på?
