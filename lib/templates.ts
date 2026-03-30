export interface Template {
  id: string;
  title: string;
  category: string;
  time: string;
  image: string;
  tema: string;
  leituraBiblica: string;
  materialApoio: string;
  publicoAlvo: 'Crianças' | 'Jovens' | 'Adultos' | 'Todos';
  textoExplicativo: string;
}

export const initialTemplates: Template[] = [
  // ── QUERIGMA ──
  {
    id: 'q1',
    title: 'O Primeiro Anúncio',
    category: 'Querigma',
    time: '45 min',
    image: 'https://picsum.photos/seed/querigma1/800/600',
    publicoAlvo: 'Todos',
    tema: 'O Amor de Deus revelado em Jesus Cristo',
    leituraBiblica: '1 João 4:7-12',
    materialApoio: 'Papel, canetas coloridas, barbante',
    textoExplicativo: `O Querigma é o núcleo da fé cristã: o anúncio de que Deus nos amou primeiro, enviando seu Filho Jesus Cristo ao mundo. Este tema é fundamental na catequese pois toda a jornada de fé começa quando a pessoa é tocada pelo amor incondicional de Deus.

**Fundamentos teológicos:**
O Concílio Vaticano II, especialmente no Decreto "Ad Gentes", destaca que o primeiro anúncio (querigma) deve preceder toda catequese sistemática. Não se trata apenas de transmitir doutrinas, mas de provocar um encontro pessoal e transformador com Jesus Cristo.

A Exortação Apostólica "Evangelii Gaudium" (Papa Francisco, n.164) reforça: "Na catequese, o primeiro anúncio ou querigma tem um papel fundamental, que deve ocupar o centro da atividade evangelizadora". O catequista não é apenas um professor de religião, mas uma testemunha do amor de Deus.

**Para o catequista:**
Ajude os catequizandos a perceberem que ser cristão não é seguir uma lista de regras, mas responder a um amor. Use exemplos concretos de amor gratuito — a parábola do filho pródigo, a cura dos enfermos por Jesus. Convide cada um a uma resposta pessoal: "O que esse amor de Deus muda na minha vida?"`
  },
  {
    id: 'q2',
    title: 'Encontro Pessoal com Jesus',
    category: 'Querigma',
    time: '60 min',
    image: 'https://picsum.photos/seed/querigma2/800/600',
    publicoAlvo: 'Jovens',
    tema: 'Jesus Cristo, o Salvador',
    leituraBiblica: 'João 3:16',
    materialApoio: 'Cruz, Bíblia, Velas',
    textoExplicativo: `O encontro com Jesus Cristo é o coração de toda catequese. Não basta conhecer sobre Jesus; é preciso conhecê-lo pessoalmente. Esta é a proposta central da Nova Evangelização: levar as pessoas a uma experiência viva, não apenas a um conhecimento intelectual.

**Fundamentos teológicos:**
O Catecismo da Igreja Católica (n.426) afirma: "No centro da catequese encontramos essencialmente uma Pessoa, a de Jesus de Nazaré". A Diretório Geral para a Catequese (2020, n.57) reforça que a catequese deve ser uma escola de discipulado missionário, onde os catequizandos encontram o Senhor vivo.

**Para o catequista:**
Provoque a pergunta de Jesus: "Mas vós, quem dizeis que eu sou?" (Mt 16,15). Incentive o compartilhamento de experiências pessoais de fé. Mostre que Jesus não é um personagem histórico distante, mas o Ressuscitado presente hoje. A oração, a Eucaristia e a Palavra de Deus são os principais caminhos desse encontro.`
  },
  // ── SACRAMENTOS ──
  {
    id: 's1',
    title: 'Batismo: Nova Vida em Cristo',
    category: 'Sacramentos',
    time: '50 min',
    image: 'https://picsum.photos/seed/batismo/800/600',
    publicoAlvo: 'Crianças',
    tema: 'O Sacramento do Batismo',
    leituraBiblica: 'Mateus 3:13-17',
    materialApoio: 'Água benta, vela, veste branca, óleo',
    textoExplicativo: `O Batismo é o primeiro e fundamental sacramento, a porta de entrada para a vida cristã. Por ele, o batizado morre para o pecado e nasce para uma vida nova em Cristo, tornando-se filho de Deus e membro da Igreja.

**Fundamentos teológicos:**
O Catecismo da Igreja Católica (n.1213) ensina que "o santo Batismo é o fundamento de toda a vida cristã, o pórtico da vida no Espírito e a porta que abre o acesso aos outros sacramentos". Os efeitos são: perdão do pecado original e dos pecados pessoais, nascimento para a vida nova, incorporação à Igreja e recebimento do Espírito Santo.

**Símbolos do Batismo:**
— **Água**: purificação e nova vida.
— **Óleo (crisma)**: força do Espírito Santo.
— **Vela acesa**: Cristo, luz do mundo.
— **Veste branca**: revestir-se de Cristo.

**Para o catequista:**
Conecte o batismo à vida cotidiana: somos batizados, portanto amados e chamados. Ajude as crianças a valorizarem o dia do seu batismo como o "aniversário de filho de Deus".`
  },
  {
    id: 's2',
    title: 'Eucaristia: Pão da Vida',
    category: 'Sacramentos',
    time: '90 min',
    image: 'https://picsum.photos/seed/eucaristia/800/600',
    publicoAlvo: 'Crianças',
    tema: 'A Presença Real de Jesus na Eucaristia',
    leituraBiblica: 'Lucas 22:14-20',
    materialApoio: 'Pão, uva, cálice',
    textoExplicativo: `A Eucaristia é "fonte e cúpula de toda a vida cristã" (LG 11). É o memorial da Última Ceia, a presença real de Cristo sob as espécies do pão e do vinho, e o sacrifício que renova o de Calvário.

**Fundamentos teológicos:**
O CIC (n.1324) ensina que a Eucaristia contém todo o bem espiritual da Igreja. A transubstanciação — transformação do pão e do vinho no Corpo e Sangue de Cristo — é um dos dogmas centrais da fé católica, definido pelo Concílio de Trento.

**Dimensões da Eucaristia:**
— **Ação de graças** (Eukaristo em grego).
— **Memorial** da Paixão, Morte e Ressurreição.
— **Sacrifício**: re-presentação do sacrifício de Cristo.
— **Comunhão**: união real com Cristo e com a Igreja.
— **Antecipação** do banquete celeste.

**Para o catequista:**
Prepare as crianças para a Primeira Comunhão com reverência e alegria. Destaque que receber Jesus na Eucaristia é o momento mais íntimo da vida cristã. Ensine a postura de respeito e adoração.`
  },
  {
    id: 's3',
    title: 'Reconciliação: O Abraço do Pai',
    category: 'Sacramentos',
    time: '60 min',
    image: 'https://picsum.photos/seed/confissao/800/600',
    publicoAlvo: 'Crianças',
    tema: 'O perdão e a misericórdia de Deus',
    leituraBiblica: 'Lucas 15:11-32',
    materialApoio: 'Coração de papel limpo e um amassado',
    textoExplicativo: `O sacramento da Reconciliação (ou Confissão) é o sacramento da misericórdia de Deus. Nele, o fiel que se arrepende recebe o perdão dos pecados cometidos após o Batismo.

**Fundamentos teológicos:**
"Aqueles a quem perdoardes os pecados, ser-lhes-ão perdoados" (Jo 20,23). Cristo conferiu este poder aos apóstolos e, através deles, aos sacerdotes ordenados. O CIC (n.1440) afirma que o pecado é uma ofensa a Deus, mas a conversão é a volta ao Pai amoroso.

**Os cinco passos para a Confissão:**
1. Exame de consciência — revisão sincera dos pecados.
2. Contrição — arrependimento verdadeiro.
3. Propósito de emenda — compromisso de mudar.
4. Confissão ao sacerdote — acusação dos pecados.
5. Satisfação (penitência) — reparação do mal causado.

**Para o catequista:**
Use a parábola do Filho Pródigo para mostrar que Deus é um Pai que corre ao nosso encontro. Desmitifique o medo da confissão; ela é encontro, não tribunal. A misericórdia de Deus é sempre maior que qualquer pecado.`
  },
  {
    id: 's4',
    title: 'Crisma: Soldados de Cristo',
    category: 'Sacramentos',
    time: '60 min',
    image: 'https://picsum.photos/seed/crisma/800/600',
    publicoAlvo: 'Jovens',
    tema: 'Os dons do Espírito Santo na Confirmação',
    leituraBiblica: 'Atos 2:1-4',
    materialApoio: 'Símbolos do Espírito Santo, óleo do santo crisma',
    textoExplicativo: `A Confirmação (Crisma) aperfeiçoa a graça do Batismo e confirma o crismando como testemunha adulta de Cristo, fortalecido pelo Espírito Santo para a missão.

**Fundamentos teológicos:**
O CIC (n.1285) ensina que a Confirmação está tão intimamente ligada ao Batismo que os Pais da Igreja chamaram-na de "confirmação do batismo". O dom principal é o Espírito Santo com seus sete dons: Sabedoria, Entendimento, Conselho, Fortaleza, Ciência, Piedade e Temor de Deus (Is 11,2-3).

**Efeitos da Crisma:**
— Aprofundamento da filiação divina.
— União mais sólida com Cristo.
— Aumento dos dons do Espírito Santo.
— Fortaleza para defender e propagar a fé.
— Caráter indelével (marca espiritual permanente).

**Para o catequista jovem:**
A Crisma não é um "fim" da catequese, mas um começo de missão. Desafie os jovens: quais dons do Espírito você quer colocar a serviço da comunidade?`
  },
  {
    id: 's5',
    title: 'O Matrimônio: Aliança de Amor',
    category: 'Sacramentos',
    time: '50 min',
    image: 'https://picsum.photos/seed/matrimonio/800/600',
    publicoAlvo: 'Adultos',
    tema: 'Amor conjugal como sinal do amor de Deus',
    leituraBiblica: 'Marcos 10:6-9',
    materialApoio: 'Alianças ilustrativas, Amoris Laetitia',
    textoExplicativo: `O Matrimônio é o sacramento pelo qual homem e mulher formam uma aliança indissolúvel de amor, tornando-se sinal do amor de Cristo pela Igreja.

**Fundamentos teológicos:**
A Exortação Apostólica "Amoris Laetitia" (Papa Francisco, 2016) desenvolveu uma teologia do amor conjugal que integra alegria, espiritualidade e os desafios concretos da vida familiar. O CIC (n.1601) define o matrimônio como "a aliança matrimonial, pela qual o homem e a mulher constituem entre si um consórcio de toda a vida, ordenado por sua índole natural ao bem dos cônjuges e à geração e educação da prole".

**Propriedades essenciais:**
— **Unidade**: entre um homem e uma mulher.
— **Indissolubilidade**: "o que Deus uniu, o homem não separe".
— **Fidelidade**: amor exclusivo e total.
— **Fecundidade**: abertura à vida.

**Para o catequista:**
Apresente o matrimônio como vocação e missão, não apenas contrato legal. A família é "Igreja doméstica" — o primeiro lugar onde se aprende a amar.`
  },
  // ── JESUS CRISTO ──
  {
    id: 'jc1',
    title: 'Quem é Jesus Cristo?',
    category: 'Jesus Cristo',
    time: '60 min',
    image: 'https://picsum.photos/seed/jesus1/800/600',
    publicoAlvo: 'Todos',
    tema: 'A identidade de Jesus: verdadeiro Deus e verdadeiro homem',
    leituraBiblica: 'João 1:1-14',
    materialApoio: 'Bíblia, imagens de Jesus',
    textoExplicativo: `A pergunta central da fé cristã: "Quem é Jesus?" Ele é ao mesmo tempo verdadeiro Deus e verdadeiro homem — o mistério da Encarnação. Esta é a confissão fundamental do Credo.

**Fundamentos teológicos:**
O Concílio de Niceia (325) definiu que Jesus é "Deus de Deus, luz da luz, gerado, não criado, consubstancial ao Pai". O Concílio de Calcedônia (451) definiu que Jesus tem duas naturezas — divina e humana — unidas em uma só Pessoa.

**Os títulos de Jesus:**
— **Cristo** (Ungido/Messias): o prometido.
— **Senhor** (Kyrios): título divino.
— **Filho de Deus**: relação única com o Pai.
— **Salvador** (Jesus = Yahweh salva).
— **Filho do Homem**: solidariedade com a humanidade.

**Para crianças:** Use histórias dos Evangelhos para mostrar Jesus que brinca, chora, ri e ama.
**Para jovens:** Explore a pergunta: "O que significa que Jesus é meu contemporâneo?"
**Para adultos:** Aprofunde a cristologia e o significado da Encarnação para a vida hoje.`
  },
  {
    id: 'jc2',
    title: 'A Paixão e a Cruz',
    category: 'Jesus Cristo',
    time: '60 min',
    image: 'https://picsum.photos/seed/paixao/800/600',
    publicoAlvo: 'Todos',
    tema: 'O maior ato de amor da história',
    leituraBiblica: 'Lucas 23:33-46',
    materialApoio: 'Crucifixo, vela',
    textoExplicativo: `A Paixão e Morte de Jesus não é uma tragédia, mas o ato supremo de amor. Na Cruz, Deus revelou até onde vai seu amor pela humanidade. A teologia da cruz é central para a compreensão cristã do sofrimento e da redenção.

**Fundamentos teológicos:**
"Deus amou o mundo de tal maneira que deu o seu Filho Unigênito" (Jo 3,16). São Paulo escreve: "Cristo morreu pelos nossos pecados, segundo as Escrituras" (1Cor 15,3). A morte de Cristo é sacrifício redentor, revelação de amor e vitória sobre o pecado e a morte.

**A Via Crucis como catequese:**
As 14 estações da Via Sacra oferecem um roteiro completo para meditar a Paixão. Cada estação conecta o sofrimento de Jesus aos sofrimentos humanos de hoje: a injustiça, o abandono, a dor físca, a solidariedade dos que ajudam.

**Para o catequista:**
Não apresente a cruz como punição, mas como amor total. "Não há amor maior do que dar a vida pelos amigos" (Jo 15,13). Convide à meditação: onde você vê a cruz de Cristo hoje no mundo?`
  },
  {
    id: 'jc3',
    title: 'A Ressurreição: Vitória da Vida',
    category: 'Jesus Cristo',
    time: '50 min',
    image: 'https://picsum.photos/seed/ressurreicao/800/600',
    publicoAlvo: 'Todos',
    tema: 'Jesus ressuscitado e nossa esperança',
    leituraBiblica: 'Mateus 28:1-10',
    materialApoio: 'Vela pascal, flores brancas',
    textoExplicativo: `A Ressurreição de Jesus é o fundamento da fé cristã. "Se Cristo não ressuscitou, vã é a nossa fé" (1Cor 15,17). Não se trata de um mito, mas do evento histórico e transcendente que mudou a história da humanidade.

**Fundamentos teológicos:**
A Ressurreição não é simples retorno à vida física (como Lázaro), mas transformação em novo modo de existência. O Ressuscitado aparece a Maria Madalena, aos discípulos de Emaús, aos apóstolos — cada aparição revela algo: ele é real, mas transformado; conhecido, mas diferente.

**Consequências da Ressurreição:**
— Confirmação de que Jesus é o Filho de Deus.
— Fundamento da nossa esperança na ressurreição dos mortos.
— Presença de Cristo vivo e atuante na Igreja.
— A morte não tem a última palavra.

**Para o catequista:**
A Páscoa não é apenas festa do passado — é a forma de vida do cristão. "Somos um povo pascal", que vive a passagem da morte para a vida em cada escolha de amor.`
  },
  {
    id: 'jc4',
    title: 'As Parábolas do Reino',
    category: 'Jesus Cristo',
    time: '50 min',
    image: 'https://picsum.photos/seed/parabolas/800/600',
    publicoAlvo: 'Crianças',
    tema: 'Como Jesus nos ensina com histórias',
    leituraBiblica: 'Lucas 10:25-37',
    materialApoio: 'Fantoches ou teatro simples',
    textoExplicativo: `Jesus escolheu as parábolas como seu método pedagógico preferido. Por quê? Porque histórias tocam o coração, ficam na memória e provocam reflexão — muito antes que qualquer argumento racional.

**O que são as parábolas:**
São comparações tiradas da vida cotidiana (semeador, ovelha perdida, fariseu e publicano) que revelam verdades profundas sobre o Reino de Deus. Não são apenas ilustrações: são desafios que exigem uma resposta.

**Parábolas-chave para crianças:**
— **Filho Pródigo** (Lc 15): o amor misericordioso do Pai.
— **Bom Samaritano** (Lc 10): quem é o meu próximo?
— **Semeador** (Mt 13): diferentes receptividades à Palavra.
— **Ovelha Perdida** (Lc 15): Deus busca cada um.

**Para o catequista:**
Use dramatizações! Crianças aprendem mais fazendo do que ouvindo. Após encenarem a parábola, faça perguntas simples: "Com qual personagem você mais se identificou?" Isso provoca a aplicação pessoal da mensagem.`
  },
  // ── BÍBLIA ──
  {
    id: 'b1',
    title: 'Como Ler a Bíblia',
    category: 'Bíblia',
    time: '60 min',
    image: 'https://picsum.photos/seed/biblia1/800/600',
    publicoAlvo: 'Todos',
    tema: 'Introdução à Sagrada Escritura',
    leituraBiblica: '2 Timóteo 3:16-17',
    materialApoio: 'Bíblias para todos, marcadores de página',
    textoExplicativo: `A Bíblia é a Palavra de Deus expressa em palavras humanas. Saber lê-la é uma competência fundamental do cristão. O objetivo desta aula é introduzir os catequizandos à estrutura da Bíblia e às ferramentas de leitura.

**Fundamentos teológicos:**
A Constituição Dogmática "Dei Verbum" (Vaticano II, n.11) ensina que a Bíblia foi escrita por autores humanos inspirados pelo Espírito Santo. Portanto, Deus é seu autor principal, mas os humanos escrevem segundo sua cultura, linguagem e gênero literário.

**Estrutura básica:**
— **Antigo Testamento**: 46 livros (Bíblia Católica). História da Aliança de Deus com Israel.
— **Novo Testamento**: 27 livros. Cumprimento das promessas em Jesus Cristo.

**Gêneros literários:**
História, lei, poesia, profecia, sabedoria, cartas, apocalipse — cada gênero exige uma leitura diferente.

**Para o catequista:**
Ensine a encontrar uma passagem (livro, capítulo, versículo). Incentive a Leitura Orante (Lectio Divina): ler, meditar, orar, contemplar. A Bíblia não é livro de respostas prontas — é diálogo com Deus.`
  },
  {
    id: 'b2',
    title: 'A Criação e o Pecado Original',
    category: 'Bíblia',
    time: '50 min',
    image: 'https://picsum.photos/seed/criacao/800/600',
    publicoAlvo: 'Crianças',
    tema: 'Gênesis: a beleza da criação e a fragilidade humana',
    leituraBiblica: 'Gênesis 1:1 — 3:24',
    materialApoio: 'Imagens da natureza, massa de modelar',
    textoExplicativo: `Os dois primeiros capítulos do Gênesis não são textos científicos sobre a origem do universo, mas textos teológicos sobre o significado da criação: Deus cria por amor, e tudo que Ele cria é bom.

**Fundamentos teológicos:**
A Igreja ensina que Gênesis usa linguagem simbólica e poética (gênero literário teológico). O importante não é "como" Deus criou, mas "por que": por amor gratuito. O CIC (n.282-289) distingue entre a leitura literária e a interpretação do sentido espiritual.

**O Pecado Original:**
Não é um mito, mas a realidade de que a humanidade se afastou de Deus (Gn 3). Seus efeitos: desordem interior, sofrimento, morte, tendência ao mal. A boa notícia: a promessa da redenção já está em Gn 3,15 ("Proto-evangelho").

**Para o catequista:**
Com crianças: use a história da criação com imagens e cores. Pergunte: "O que você mais ama na criação de Deus?" Conecte com o cuidado ambiental (Laudato Si). Com adultos: aprofunde o significado do pecado original na vida pessoal e social.`
  },
  {
    id: 'b3',
    title: 'Os Salmos: Orações da Humanidade',
    category: 'Bíblia',
    time: '50 min',
    image: 'https://picsum.photos/seed/salmos/800/600',
    publicoAlvo: 'Adultos',
    tema: 'O livro da oração de Israel e da Igreja',
    leituraBiblica: 'Salmo 23; Salmo 139',
    materialApoio: 'Livro dos Salmos, papel para escrita criativa',
    textoExplicativo: `O Saltério (livro dos Salmos) é o livro de oração por excelência da Bíblia. Usado por Jesus, pelos apóstolos e pela Igreja ao longo de 2000 anos, os 150 Salmos expressam toda a gama de emoções humanas diante de Deus.

**Fundamentos teológicos:**
Santo Agostinho dizia: "Que beleza! Que perfeição! São as vozes da Igreja, voz do Esposo e da Esposa." Os Salmos são a palavra de Deus (Escritura) mas também a palavra do homem a Deus (oração) — diálogo único.

**Tipos de Salmos:**
— **Hinos**: louvor (Sl 150).
— **Súplicas**: pedido de ajuda (Sl 22).
— **Ação de graças** (Sl 116).
— **Penitenciais**: arrependimento (Sl 51 — o Miserere).
— **Sapienciais**: sabedoria (Sl 1).

**Para o catequista:**
Incentive a ler um Salmo por dia. Com adultos: proponha escrever o "salmo pessoal" — expressando a Deus seus medos, alegrias e pedidos com palavras próprias. Os Salmos mostram que diante de Deus podemos ser completamente honestos.`
  },
  // ── MANDAMENTOS ──
  {
    id: 'm1',
    title: 'Os Dez Mandamentos',
    category: 'Mandamentos',
    time: '60 min',
    image: 'https://picsum.photos/seed/mandamentos/800/600',
    publicoAlvo: 'Todos',
    tema: 'A Lei de Deus como caminho de liberdade',
    leituraBiblica: 'Êxodo 20:1-17; Mateus 22:37-40',
    materialApoio: 'Tábuas ilustrativas, cartaz resumo',
    textoExplicativo: `Os Dez Mandamentos não são uma lista de proibições que limitam a liberdade humana — são o caminho para a verdadeira liberdade: a liberdade do amor. Jesus os resume em dois: amar a Deus e ao próximo.

**Fundamentos teológicos:**
O Decálogo (dez palavras) foi dado por Deus a Moisés como expressão da Aliança. O CIC (n.2067) ensina que os mandamentos formam uma unidade orgânica: violar um é violar toda a lei de amor. Jesus não aboliu a lei, mas a cumpriu e aprofundou (Mt 5,17).

**Divisão dos mandamentos:**
— **1º ao 3º**: relação com Deus (amar, respeitar, santificar).
— **4º ao 10º**: relação com o próximo e com si mesmo.

**O mandamento novo** (Jo 13,34): "Amai-vos uns aos outros como eu vos amei." Jesus eleva o padrão do amor: não apenas "não faças o mal", mas "faz o bem ativamente".

**Para o catequista:**
Apresente os mandamentos não como restrições, mas como proteções. Pergunte: "O que aconteceria com a sociedade se todos vivessem os mandamentos?" Use exemplos do cotidiano dos catequizandos.`
  },
  {
    id: 'm2',
    title: 'As Bem-aventuranças',
    category: 'Mandamentos',
    time: '60 min',
    image: 'https://picsum.photos/seed/bemaventurancas/800/600',
    publicoAlvo: 'Jovens',
    tema: 'O programa de vida cristã segundo Jesus',
    leituraBiblica: 'Mateus 5:1-12',
    materialApoio: 'Cartaz das Be-aventuranças, papel para reflexão',
    textoExplicativo: `As Bem-aventuranças (Mateus 5,1-12) são a "carta magna" do cristão. Pronunciadas no Sermão da Montanha, são a resposta de Jesus à pergunta fundamental: "O que é ser feliz?"

**Fundamentos teológicos:**
O CIC (n.1716) ensina que as bem-aventuranças respondem ao desejo natural de felicidade que Deus colocou no coração humano. Não são apenas morais — são escatológicas: anunciam o Reino que já começa aqui.

**Chave de leitura:**
Jesus não diz "serão bem-aventurados", mas "são bem-aventurados" — no presente. A beatitude não é apenas recompensa futura, mas qualidade de vida presente de quem vive segundo o Evangelho.

**As oito bem-aventuranças:**
1. Pobres em espírito (humildes diante de Deus)
2. Os que choram (solidários com o sofrimento)
3. Os mansos (sem violência)
4. Os que têm fome de justiça
5. Os misericordiosos
6. Os puros de coração
7. Os pacificadores
8. Os perseguidos por causa da justiça

**Para jovens:**
Desafie-os: qual bem-aventurança é mais difícil para vocês? Qual sociedade teríamos se todos vivessem as beatitudes?`
  },
  // ── ORAÇÕES ──
  {
    id: 'o1',
    title: 'O Pai Nosso: A Oração Perfeita',
    category: 'Orações',
    time: '60 min',
    image: 'https://picsum.photos/seed/painosso/800/600',
    publicoAlvo: 'Crianças',
    tema: 'A oração que Jesus nos ensinou',
    leituraBiblica: 'Mateus 6:9-13',
    materialApoio: 'Cartaz com o Pai Nosso por partes',
    textoExplicativo: `O Pai Nosso é a oração cristã por excelência — chamado pelos Padres da Igreja de "sumário de todo o Evangelho". Jesus não apenas nos ensinou a orar; nos ensinou como orar e a quem orar.

**Fundamentos teológicos:**
Tertuliano (séc. II) chamou o Pai Nosso de "sumário de todo o Evangelho". O CIC dedica 48 artigos (n.2759-2865) ao Pai Nosso — a maior explicação de qualquer oração no catecismo.

**Estrutura da oração:**
— **"Pai nosso"**: revela a filiação divina e a fraternidade universal.
— **"santificado seja o teu nome"**: adoração — Deus em primeiro lugar.
— **"venha o teu Reino"**: esperança escatológica.
— **"pão nosso de cada dia"**: confiança providencial.
— **"perdoa-nos... como nós perdoamos"**: condição do perdão (Mt 6,14-15!).
— **"não nos deixes cair em tentação"**: reconhecimento da fraqueza.
— **"livra-nos do mal"**: súplica de proteção.

**Para o catequista:**
Ensine o Pai Nosso não para memorizar, mas para viver. Cada petição é um programa de vida. Pergunte: "Quando você reza 'como nós perdoamos', você pensa em alguém que precisa perdoar?"`
  },
  {
    id: 'o2',
    title: 'A Lectio Divina',
    category: 'Orações',
    time: '60 min',
    image: 'https://picsum.photos/seed/lectio/800/600',
    publicoAlvo: 'Adultos',
    tema: 'O método antigo de orar com a Escritura',
    leituraBiblica: 'Lucas 24:13-35 (Emaús)',
    materialApoio: 'Bíblia, caderno de meditação, silêncio',
    textoExplicativo: `A Lectio Divina (Leitura Divina) é um método milenar de oração com a Bíblia, praticado desde os primeiros séculos do monaquismo cristão. O Papa Bento XVI e o Papa Francisco muito a recomendaram como caminho de encontro com Deus.

**Os quatro passos clássicos (Guigo II, séc. XII):**

1. **Lectio** (leitura): Ler devagar o texto, como se fosse uma carta enviada pessoalmente para mim por Deus. Que palavra ou frase me toca?

2. **Meditatio** (meditação): Ruminar a Palavra. Deixar que a frase escolhida dialogue com minha vida. O que Deus quer me dizer?

3. **Oratio** (oração): Responder a Deus com o coração. Não precisa ser formal — pode ser gratidão, pedido, lamento, promessa.

4. **Contemplatio** (contemplação): Descansar em Deus. Silêncio fecundo onde Deus age além das palavras.

**Para o catequista:**
Pratique a Lectio Divina com o grupo antes de ensiná-la. Comece com textos curtos e narrativos (uma parábola, uma cura). O silêncio pode ser desconfortável no início — normalize-o. Deus fala frequentemente no silêncio (1Rs 19,12).`
  },
  // ── NOSSA SENHORA ──
  {
    id: 'ns1',
    title: 'Maria, Mãe de Deus',
    category: 'Nossa Senhora',
    time: '50 min',
    image: 'https://picsum.photos/seed/maria1/800/600',
    publicoAlvo: 'Todos',
    tema: 'O papel de Maria na História da Salvação',
    leituraBiblica: 'Lucas 1:26-38',
    materialApoio: 'Imagem de Nossa Senhora, Terço, Flores',
    textoExplicativo: `Maria é a mais nobre das criaturas — Mãe de Deus (Theotokos), Mãe da Igreja e modelo perfeito de discipulado. A doutrina mariana não é um "extra" opcional da fé — está no coração do mistério de Cristo.

**Fundamentos teológicos:**
Os quatro dogmas marianos:
1. **Maternidade Divina** (Éfeso, 431): Maria é Mãe de Deus, não apenas de Jesus humano.
2. **Virgindade Perpétua**: antes, durante e após o parto.
3. **Imaculada Conceição** (1854): preservada do pecado original desde o primeiro instante.
4. **Assunção** (1950): foi elevada em corpo e alma ao Céu.

**Maria no Evangelho:**
— A Anunciação: o "sim" que mudou a história (Lc 1,38).
— A Visitação: primeira missionária (Lc 1,39-56).
— As Bodas de Caná: sua intercessão ativa (Jo 2,1-11).
— O Calvário: Mãe da Igreja (Jo 19,25-27).

**Para o catequista:**
Apresente Maria não como ser inalcançável, mas como a primeira discípula. Seu "Faça-se em mim segundo a tua Palavra" é o modelo de toda resposta à fé. O Terço é escola de oração contemplativa.`
  },
  // ── LITURGIA ──
  {
    id: 'l1',
    title: 'A Santa Missa: Banquete e Sacrifício',
    category: 'Liturgia',
    time: '60 min',
    image: 'https://picsum.photos/seed/missa/800/600',
    publicoAlvo: 'Todos',
    tema: 'Entendendo e participando ativamente da Eucaristia',
    leituraBiblica: 'Lucas 24:13-35',
    materialApoio: 'Missal ilustrado, paramentos litúrgicos',
    textoExplicativo: `A Missa (Celebração Eucarística) é o centro e cúpula da vida cristã. Não é apenas um rito — é o memorial vivo do sacrifício de Cristo, tornando presente o que Ele fez na Última Ceia e no Calvário.

**Estrutura da Missa:**
**I. Ritos Iniciais**: acolhida, ato penitencial, Glória — preparar o coração.
**II. Liturgia da Palavra**: leituras, salmo responsorial, Evangelho, homilia, Credo, oração universal — Deus fala, nós respondemos.
**III. Liturgia Eucarística**: ofertório, Oração Eucarística (consagração), comunhão — o ápice.
**IV. Ritos Finais**: bênção, missão — "a Missa acabou, vamos em paz."

**Participação ativa (SC 14):**
O Concílio Vaticano II pediu a "participação plena, consciente e ativa" dos fiéis. Não se vai à Missa para "cumprir obrigação", mas para ser transformado pelo encontro com o Ressuscitado.

**Para o catequista:**
Explique cada parte com seus símbolos e gestos. Por que nos persignamos? Por que fazemos genuflexão? Por que o silêncio após a comunhão? Participar com consciência transforma a Missa de rito em vida.`
  },
  {
    id: 'l2',
    title: 'O Ano Litúrgico',
    category: 'Liturgia',
    time: '55 min',
    image: 'https://picsum.photos/seed/anoliturgico/800/600',
    publicoAlvo: 'Crianças',
    tema: 'O calendário da Igreja',
    leituraBiblica: 'Eclesiastes 3:1-8',
    materialApoio: 'Roda do Ano Litúrgico colorida, tecidos nas cores litúrgicas',
    textoExplicativo: `O Ano Litúrgico é o modo pelo qual a Igreja celebra e revive os mistérios da vida de Cristo ao longo de doze meses. Não é apenas um calendário — é uma escola de fé que nos faz viver o ritmo do Evangelho.

**Os tempos litúrgicos:**

— **Advento** (roxo/violeta, 4 semanas): Esperança e preparação para o Natal.
— **Natal** (branco/dourado): Celebração da Encarnação.
— **Tempo Comum I** (verde): Crescimento na fé.
— **Quaresma** (roxo, 40 dias): Conversão, penitência, preparação pascal.
— **Tríduo Pascal** (máximo litúrgico): Quinta, Sexta e Sábado Santos.
— **Páscoa** (branco/dourado, 50 dias): Alegria da Ressurreição.
— **Pentecostes** (vermelho): Dom do Espírito Santo.
— **Tempo Comum II** (verde): Missão no mundo.

**As cores litúrgicas:**
Verde = esperança; Roxo = penitência/espera; Vermelho = Espírito/mártires; Branco/Dourado = alegria/solenidade; Rosa = alegria antecipada (3º domingo do Advento e 4º da Quaresma).

**Para o catequista:**
Use a roda do Ano Litúrgico visualmente. Crianças adoram as cores! Pergunte: "Em que tempo litúrgico estamos? O que estamos celebrando juntos como Igreja?"`
  },
  // ── DOUTRINA SOCIAL ──
  {
    id: 'ds1',
    title: 'Laudato Si: Cuidado da Casa Comum',
    category: 'Doutrina Social',
    time: '50 min',
    image: 'https://picsum.photos/seed/laudatosi/800/600',
    publicoAlvo: 'Jovens',
    tema: 'Ecologia integral e responsabilidade cristã',
    leituraBiblica: 'Gênesis 2:15; Apocalipse 11:18',
    materialApoio: 'Encíclica Laudato Si, sementes, vasinhos',
    textoExplicativo: `A encíclica "Laudato Si" (2015) do Papa Francisco é o maior documento Social da Igreja sobre ecologia. Vai além do ambientalismo secular: propõe uma "ecologia integral" que une a crise ambiental à crise moral e espiritual.

**Tese central da Laudato Si:**
"Tudo está interligado." A degradação ambiental está ligada à pobreza, ao consumismo, à falta de espiritualidade. Cuidar da terra é cuidar dos pobres — e vice-versa.

**Princípios fundamentais:**
— A terra pertence a Deus, não ao ser humano.
— O ser humano é administrador (mayordomo), não proprietário.
— Os bens da terra têm "destino universal" — são para todos.
— A escolha por um estilo de vida simples é uma opção espiritual.

**Laudate Deum (2023):**
O Papa Francisco escreveu a carta apostólica como urgente atualização da Laudato Si, diante da aceleração da crise climática.

**Para jovens:**
Esta é a geração da crise climática. Como a fé cristã me convida a agir? O que posso mudar no meu estilo de vida? Conecte a fé à ação concreta: reciclagem, consumo consciente, cuidado com a natureza local.`
  },
  {
    id: 'ds2',
    title: 'A Opção pelos Pobres',
    category: 'Doutrina Social',
    time: '60 min',
    image: 'https://picsum.photos/seed/pobres/800/600',
    publicoAlvo: 'Adultos',
    tema: 'A Doutrina Social da Igreja e o amor preferencial pelos excluídos',
    leituraBiblica: 'Mateus 25:31-46; Lucas 4:18',
    materialApoio: 'Documentos sociais da Igreja, testemunhos de vida',
    textoExplicativo: `A "opção preferencial pelos pobres" é uma das mais importantes contribuições da teologia latino-americana à Igreja universal, acolhida pelo Magistério desde o Concílio Vaticano II.

**Fundamentos bíblicos:**
Em Mateus 25, Jesus se identifica com os pobres: "Tive fome e me destes de comer... o que fizestes a um desses meus irmãos mais pequeninos, a mim o fizestes." Esta não é opção política — é cristológica.

**A Doutrina Social da Igreja:**
Desde a Rerum Novarum (Leão XIII, 1891) até a Laudato Si (Francisco, 2015), a DSI desenvolveu princípios para a vida social:
— **Dignidade humana**: todo ser humano tem valor inalienável.
— **Bem comum**: o bem de todos, não apenas de alguns.
— **Subsidiariedade**: cada comunidade resolve o que pode.
— **Solidariedade**: "somos todos responsáveis por todos" (João Paulo II).

**Para o catequista adulto:**
Provoque a consciência crítica: Como nosso estilo de vida contribui para a exclusão dos pobres? A fé que não tem consequências sociais é fé incompleta (Tiago 2,14-26). Mostre exemplos de engajamento social cristão.`
  },
  // ── CATEQUESE DE ADULTOS ──
  {
    id: 'ca1',
    title: 'O Credo: A Fé da Igreja',
    category: 'Catequese de Adultos',
    time: '75 min',
    image: 'https://picsum.photos/seed/credo/800/600',
    publicoAlvo: 'Adultos',
    tema: 'Professores e guardiões da fé apostólica',
    leituraBiblica: '1 Coríntios 15:1-8',
    materialApoio: 'Texto do Credo Niceno-Constantinopolitano, CIC',
    textoExplicativo: `O Credo (Símbolo da Fé) é a confissão de fé da Igreja, condensando em poucas palavras o núcleo do que cremos. Existem dois principais: o Apostólico (mais antigo) e o Niceno-Constantinopolitano (mais completo).

**Origem histórica:**
O Credo Niceno foi formulado nos Concílios de Niceia (325) e Constantinopla (381), em resposta a heresias que negavam a divindade de Cristo (arianismo) e do Espírito Santo.

**Estrutura trinitária:**
— **"Creio em Deus Pai..."**: criação e providência.
— **"...e em Jesus Cristo..."**: encarnação, redenção, ressurreição, ascensão, retorno.
— **"...e no Espírito Santo..."**: a Igreja, sacramentos, ressurreição dos mortos, vida eterna.

**O Símbolo como regra de fé:**
O Credo distingue a fé ortodoxa das heresias. Conhecer o Credo é conhecer o que a Igreja crê — não apenas individualmente, mas como corpo eclesial ("Creio" = acredito com a Igreja).

**Para adultos:**
Proponha o estudo artigo por artigo. Que diferença faz acreditar em "a ressurreição da carne"? Ou em "a comunhão dos santos"? O Credo não é só teoria — tem consequências para a vida.`
  },
  {
    id: 'ca2',
    title: 'Discernimento Espiritual',
    category: 'Catequese de Adultos',
    time: '75 min',
    image: 'https://picsum.photos/seed/discernimento/800/600',
    publicoAlvo: 'Adultos',
    tema: 'Como reconhecer a voz de Deus na vida',
    leituraBiblica: '1 Reis 19:9-13; Romanos 12:1-2',
    materialApoio: 'Exercícios Espirituais de Santo Inácio, caderno',
    textoExplicativo: `O discernimento espiritual é a capacidade de reconhecer a ação de Deus na vida e distinguir os "espíritos" que nos movem. Santo Inácio de Loyola desenvolveu o sistema mais elaborado de discernimento da tradição cristã.

**O que é discernimento:**
Não é simplesmente "fazer o que se sente", nem "seguir regras sem pensar". É a arte de ler os movimentos interiores (consolações e desolações) à luz da fé, para tomar decisões livres e responsáveis.

**Princípios inacinianos:**
— **Consolação espiritual**: movimento de paz, amor, clareza, profundidade — sinal do Bem.
— **Desolação espiritual**: inquietação, obscuridade, fechamento — sinal de resistência ao Bem.
— Os movimentos devem ser observados consistentemente, não em momentos isolados.

**O Exame de Consciência diário (Examen):**
1. Gratidão: pelo que agradeço hoje?
2. Revisão: como estive presente a Deus?
3. Arrependimento: o que falhou?
4. Perdão: receber o amor misericordioso.
5. Resolução: como amanhã posso melhorar?

**Para o catequista:**
Ensine adultos que a fé matura não é apenas cumprir ritos — é aprender a perceber Deus na vida concreta: no trabalho, nas relações, nas decisões cotidianas.`
  },
  // ── CATEQUESE JOVEM ──
  {
    id: 'cj1',
    title: 'Fé e Ciência: Contradição?',
    category: 'Catequese de Jovens',
    time: '75 min',
    image: 'https://picsum.photos/seed/feciencia/800/600',
    publicoAlvo: 'Jovens',
    tema: 'Diálogo entre razão e fé',
    leituraBiblica: 'Sabedoria 13:1-9; Romanos 1:19-20',
    materialApoio: 'Textos de cientistas católicos, linha do tempo da ciência',
    textoExplicativo: `Um dos maiores obstáculos à fé dos jovens hoje é o suposto conflito entre ciência e religião. Este tema desmonta esse mito historicamente e propõe um diálogo fecundo.

**O mito do conflito:**
A ideia de que "ciência prova que Deus não existe" é uma ideologia, não uma conclusão científica. A ciência responde "como"; a fé responde "por quê" e "para quê". São questões diferentes.

**Cientistas de fé (exemplos):**
— Gregor Mendel (fundador da genética): frade agostiniano.
— Georges Lemaître (Big Bang): padre católico.
— Blaise Pascal, René Descartes, Isaac Newton — profundamente religiosos.
— Francis Collins (Projeto Genoma Humano): cristão.

**O Magistério e a Ciência:**
"Fé e razão são como duas asas pelas quais o espírito humano se eleva à contemplação da verdade." (João Paulo II, Fides et Ratio, n.1)

A Igreja aceita a evolução como teoria científica válida, desde que não seja transformada em filosofia materialista que nega o espírito e Deus.

**Para jovens:**
Não fuja das perguntas difíceis — abrace-as! Deus não tem medo das perguntas. A busca sincera da verdade é sempre caminho para Deus. Apresente figuras de intelectuais cristãos contemporâneos.`
  },
  {
    id: 'cj2',
    title: 'Missão e Vocação',
    category: 'Catequese de Jovens',
    time: '60 min',
    image: 'https://picsum.photos/seed/vocacao/800/600',
    publicoAlvo: 'Jovens',
    tema: 'Deus tem um projeto para minha vida',
    leituraBiblica: 'Jeremias 1:5; João 15:16',
    materialApoio: 'Mapa de talentos pessoais, testemunhos vocacionais',
    textoExplicativo: `Todo ser humano tem uma vocação — um chamado específico de Deus. A catequese vocacional ajuda os jovens a descobrirem o projeto de Deus para suas vidas, seja no matrimônio, vida consagrada, sacerdócio ou vocação laical.

**Fundamentos teológicos:**
"Antes de te formar no seio materno, te conhecia; antes de saíres do ventre, te consagrei" (Jer 1,5). Deus não cria por acaso — cada pessoa é um projeto único de amor. O Papa João Paulo II dedicou toda a exortação "Christifideles Laici" à vocação dos leigos.

**Tipos de vocação:**
— **Matrimônio**: formar família como "Igreja doméstica".
— **Vida consagrada**: mosteiros, congregações religiosas.
— **Sacerdócio ministerial**: serviço à comunidade eclesial.
— **Vocação laical**: santificar o mundo no trabalho, política, cultura.

**Descobrindo a vocação:**
— Quais são meus talentos naturais (donum)?
— O que me dá alegria profunda (gaudium)?
— O que o mundo precisa que eu posso oferecer (necessitas)?
— Onde estas três coisas se encontram? Aí pode estar minha vocação.

**Para o catequista:**
Convide testemunhos de pessoas com diferentes vocações. Mostre que nenhuma vocação é superior — todas são caminhos de santidade e missão.`
  },
  // ── ESPÍRITO SANTO ──
  {
    id: 'es1',
    title: 'O Espírito Santo na Vida Cristã',
    category: 'Espírito Santo',
    time: '60 min',
    image: 'https://picsum.photos/seed/espiritosanto/800/600',
    publicoAlvo: 'Todos',
    tema: 'A pessoa e a ação do Espírito Santo',
    leituraBiblica: 'João 14:15-26; Atos 2:1-13',
    materialApoio: 'Símbolos: fogo, pomba, vento, água, óleo',
    textoExplicativo: `O Espírito Santo — a "Pessoa mais desconhecida da Trindade" (Congar) — é o protagonista da vida da Igreja e de cada cristão. Não é uma força impessoal, mas a terceira Pessoa da Santíssima Trindade.

**O Espírito Santo nos textos bíblicos:**
— Criação: "o Espírito de Deus pairava sobre as águas" (Gn 1,2).
— Profetas: "o Espírito do Senhor está sobre mim" (Lc 4,18).
— Encarnação: "o Espírito Santo virá sobre ti" (Lc 1,35).
— Pentecostes: a efusão sobre os apóstolos (At 2).
— Paulo: "o Espírito intercede por nós com gemidos inefáveis" (Rm 8,26).

**Os sete dons do Espírito (Is 11,2-3):**
Sabedoria · Entendimento · Conselho · Fortaleza · Ciência · Piedade · Temor de Deus.

**Os 12 frutos do Espírito (Gl 5,22-23):**
Caridade, alegria, paz, paciência, benignidade, bondade, longanimidade, mansidão, fé, modéstia, continência, castidade.

**Para o catequista:**
O Espírito Santo não é apenas o "Deus do Pentecostes" — é o companheiro permanente do cristão. Incentive a abertura ao Espírito na oração diária: "Veni, Sancte Spiritus" — Vem, Espírito Santo.`
  },
  // ── SANTIDADE ──
  {
    id: 'sa1',
    title: 'Todos São Chamados à Santidade',
    category: 'Santidade',
    time: '60 min',
    image: 'https://picsum.photos/seed/santidade/800/600',
    publicoAlvo: 'Adultos',
    tema: 'Gaudete et Exsultate: o chamado universal à santidade',
    leituraBiblica: '1 Pedro 1:15-16; Mateus 5:48',
    materialApoio: 'Exortação Gaudete et Exsultate (Papa Francisco)',
    textoExplicativo: `A santidade não é privilégio de alguns "super-heróis espirituais". É o chamado de Deus a todo batizado. O Papa Francisco, na Exortação "Gaudete et Exsultate" (2018), convida cada cristão a descobrir seu caminho único de santidade.

**Fundamentos teológicos:**
O Capítulo V da Constituição "Lumen Gentium" (Vaticano II) proclamou o "chamado universal à santidade". Todos os estados de vida (casados, religiosos, sacerdotes, solteiros) são caminhos de santidade.

**O que é santidade:**
Não é perfeição moral sem falhas, mas:
— Abertura total a Deus.
— Amor concreto ao próximo.
— Fidelidade à "missão pessoal" que Deus deu a cada um.
— Perseverança no bem, apesar das quedas.

**Santos "do cotidiano":**
A Igreja beatificou e canonizou pais de família, professores, médicos, artistas. Carlo Acutis (jovem italiano, + 2006) foi beatificado em 2020 — mostra que a santidade é possível hoje, inclusive para jovens.

**Para o catequista:**
Mostre que santidade não é sinônimo de tristeza ou rigidez. Os santos são as pessoas mais livres e alegres que existiram. Beato Carlo Acutis dizia: "A Eucaristia é minha autoestrada para o Céu."`,
  },
];
