/* eslint-disable no-unused-vars */
window.PROGRAMMES_DATA = {
  fr: {
    intro:
      'Programmes disponibles pour festivals, salles de concert et événements privés. Durées indicatives. Autres programmes sur demande auprès des représentants.',
    label: 'Récitals proposés',
    contactCta: 'Demande de programme — Contact',
    downloadPdf: 'Télécharger le PDF',
    close: 'Fermer',
    footnoteOptional: "Les œuvres entre parenthèses sont programmables dans l'année à venir ou disponibles sous court délai.",
    programmes: [
      {
        id: 'concerto',
        title: 'Répertoire concerto',
        subtitle: 'Œuvres pour piano et orchestre',
        pdfFilename: 'Keigo Mukawa - Répertoire concerto.pdf',
        footnote:
          'Œuvres interprétées avec orchestre. Collaborations orchestrales sélectionnées (concours et concerts) : Orchestre national de Lorraine, Orchestre national de France, Orchestre national de Belgique, Brussels Philharmonic, Prague Philharmonia, Tokyo Symphony Orchestra, Tokyo Philharmonic Orchestra, Japan Philharmonic Orchestra, Yomiuri Nippon Symphony Orchestra, Tokyo Metropolitan Symphony Orchestra, etc.',
        sections: [
          {
            composer: 'J. S. Bach',
            works: [
              { title: 'Concerto pour clavecin n° 2 en mi majeur, BWV 1053' },
              { title: 'Concerto pour clavecin n° 5 en fa mineur, BWV 1056' },
            ],
          },
          {
            composer: 'Mozart',
            works: [
              { title: "Concerto pour piano n° 9 en mi bémol majeur, KV 271 « Jeunehomme »" },
              { title: 'Concerto pour piano n° 12 en la majeur, KV 414' },
              { title: 'Concerto pour piano n° 20 en ré mineur, KV 466', optional: true },
              { title: 'Concerto pour piano n° 21 en do majeur, KV 467' },
              { title: 'Concerto pour piano n° 27 en si bémol majeur, KV 595' },
              { title: 'Concerto pour deux pianos en mi bémol majeur, KV 365' },
            ],
          },
          {
            composer: 'Beethoven',
            works: [
              { title: 'Concerto pour piano n° 1 en do majeur, op. 15', optional: true },
              { title: 'Concerto pour piano n° 3 en ut mineur, op. 37' },
              { title: 'Concerto pour piano n° 4 en sol majeur, op. 58' },
              { title: 'Concerto pour piano n° 5 en mi bémol majeur, op. 73 « L’Empereur »', optional: true },
              { title: 'Concerto pour piano n° 6, op. 61a — d’après le Concerto pour violon op. 61' },
              { title: 'Triple concerto pour violon, violoncelle et piano en ut majeur, op. 56' },
            ],
          },
          {
            composer: 'Mendelssohn',
            works: [{ title: 'Concerto pour piano n° 1 en sol mineur, op. 25' }],
          },
          {
            composer: 'Chopin',
            works: [
              { title: 'Concerto pour piano n° 1 en mi mineur, op. 11' },
              { title: 'Concerto pour piano n° 2 en fa mineur, op. 21' },
              { title: 'Andante spianato et Grande polonaise brillante, op. 22' },
            ],
          },
          {
            composer: 'Schumann',
            works: [{ title: 'Concerto pour piano en la mineur, op. 54' }],
          },
          {
            composer: 'Brahms',
            works: [{ title: 'Concerto pour piano n° 2 en si bémol majeur, op. 83' }],
          },
          {
            composer: 'Saint-Saëns',
            works: [
              { title: 'Concerto pour piano n° 2 en sol mineur, op. 22' },
              { title: 'Concerto pour piano n° 5 en fa majeur, op. 103 « L’Égyptien »' },
            ],
          },
          {
            composer: 'Tchaikovsky',
            works: [
              { title: 'Concerto pour piano n° 1 en si bémol mineur, op. 23' },
              { title: 'Concerto pour piano n° 2 en sol majeur, op. 44' },
            ],
          },
          {
            composer: 'Grieg',
            works: [{ title: 'Concerto pour piano en la mineur, op. 16' }],
          },
          {
            composer: 'Rachmaninov',
            works: [
              { title: 'Concerto pour piano n° 2 en ut mineur, op. 18' },
              { title: 'Concerto pour piano n° 3 en ré mineur, op. 30' },
              { title: 'Rhapsodie sur un thème de Paganini, op. 43' },
            ],
          },
          {
            composer: 'Ravel',
            works: [
              { title: 'Concerto pour piano en sol majeur' },
              { title: 'Concerto pour la main gauche' },
            ],
          },
          {
            composer: 'Prokofiev',
            works: [
              { title: 'Concerto pour piano n° 1 en si bémol majeur, op. 10', optional: true },
              { title: 'Concerto pour piano n° 2 en sol mineur, op. 16' },
              { title: 'Concerto pour piano n° 3 en do majeur, op. 26' },
            ],
          },
          {
            composer: 'Gershwin',
            works: [{ title: 'Rhapsody in Blue' }],
          },
          {
            composer: 'Poulenc',
            works: [{ title: 'Concerto pour deux pianos en ré mineur' }],
          },
          {
            composer: 'Messiaen',
            works: [{ title: 'Turangalîla-Symphonie' }],
          },
          {
            composer: 'Ifukube',
            works: [{ title: 'Ritmica ostinata pour piano et orchestre (1961/71)' }],
          },
          {
            composer: 'Yoshimatsu',
            works: [
              {
                title: 'Threnody to Toki pour orchestre à cordes et piano (1980)',
                optional: true,
              },
            ],
          },
          {
            composer: 'Nishimura',
            works: [{ title: 'Hétérophonie pour deux pianos et orchestre (1987)' }],
          },
          {
            composer: 'Mantovani',
            works: [{ title: 'D’un jardin féérique (2021)' }],
          },
        ],
      },
      {
        id: 'voyage',
        title: 'Voyage autour du si mineur',
        subtitle: 'Aspiration à la lumière',
        pdfFilename: 'Keigo Mukawa - Voyage autour du si mineur.pdf',
        meta: 'Programme de récital · env. 90 minutes',
        intro: [
          'La tonalité de si mineur a donné naissance à de nombreux chefs-d’œuvre, souvent empreints d’un caractère sacré. Or, le sacré entretient souvent un lien étroit avec la lumière.',
          'À travers des œuvres en si mineur et dans ses tonalités voisines, ce concert dessine comme un chemin allant de l’ombre vers la lumière, en aboutissant à l’un des chefs-d’œuvre du répertoire pianistique : la Sonate en si mineur de Liszt. Ce parcours, porté par une aspiration à la lumière, ouvrira un espace de réflexion sur le mystère du sacré et de la lumière, tout en donnant à la Sonate de Liszt un nouveau contexte d’écoute.',
        ],
        pieces: [
          { text: 'Bach — Suite française n° 3 en si mineur, BWV 814', duration: '14′' },
          { text: 'Arvo Pärt — Für Alina', duration: '4′' },
          { text: 'Liszt — Romance oubliée en mi majeur, S. 527', duration: '4′' },
          {
            text: 'Debussy — Images oubliées, I. Lent (mélancolique et doux)',
            duration: '4′',
          },
          { text: 'Chopin — Barcarolle en fa dièse majeur, op. 60', duration: '9′' },
          { intermission: true },
          {
            text: 'Franck — Prélude, Fugue et Variation en si mineur (arr. Jörg Demus pour piano)',
            duration: '11′',
          },
          { text: 'Liszt — Sonate pour piano en si mineur, S. 178', duration: '30′' },
        ],
      },
      {
        id: 'beethoven',
        title: 'De Beethoven à la décadence',
        subtitle: 'Deux aspects de la beauté — structure et extase',
        pdfFilename: 'Keigo Mukawa - De Beethoven à la décadence.pdf',
        meta: 'Programme de récital · env. 90 minutes',
        intro: [
          'De la rigueur classique de Beethoven à l’extase fin-de-siècle, ce programme oppose deux visages de la beauté musicale : la structure architecturée et l’ivresse sonore. Les trois sonates de Beethoven ouvrent la première partie ; après l’entracte, Ravel, Debussy, Crumb et Scriabin mènent vers un monde de masques, de rêves et de valse.',
        ],
        pieces: [
          {
            text: 'Beethoven — Sonate pour piano n° 1 en fa mineur, op. 2 n° 1',
            duration: '16′',
          },
          {
            text: 'Beethoven — Sonate pour piano n° 6 en fa majeur, op. 10 n° 2',
            duration: '11′30',
          },
          {
            text: 'Beethoven — Sonate pour piano n° 23 en fa mineur, op. 57 « Appassionata »',
            duration: '23′',
          },
          { intermission: true },
          { text: 'Ravel — Sérénade grotesque', duration: '3′30' },
          { text: 'Debussy — Danse bohémienne', duration: '2′' },
          {
            text: 'George Crumb — « Dream Images (Love-Death Music) » – Gemini, extrait de Makrokosmos, vol. I',
            duration: '4′30',
          },
          { text: 'Scriabin — Deux poèmes, op. 32', duration: '4′30' },
          { text: 'Debussy — Masques', duration: '5′' },
          { text: 'Ravel — La Valse', duration: '12′' },
        ],
      },
      {
        id: 'mosaique',
        title: 'Mosaïque parisienne',
        subtitle: 'Programme de récital · env. 90 minutes',
        pdfFilename: 'Keigo Mukawa - Mosaïque parisienne.pdf',
        intro: [
          'Ce programme vous invite dans l’univers musical parisien à travers une mosaïque d’œuvres de compositeurs ayant tous vécu à Paris — qu’ils soient français ou étrangers. Danse, impressionnisme, cosmopolitisme, l’esprit de salon, hommage au passé… La culture musicale parisienne s’est toujours nourrie d’une grande diversité d’influences. Réunies et agencées en tenant compte des liens de contexte entre elles, ces œuvres composent un concert qui permet de ressentir un Paris à la fois divers et profond.',
        ],
        pieces: [
          {
            text: "Poulenc — Suite française d'après Claude Gervaise",
            duration: '10′',
          },
          { text: 'Ravel — Pavane pour une infante défunte', duration: '6′' },
          { text: 'Satie — Le Piccadilly', duration: '2′' },
          { text: 'Ravel — Alborada del gracioso (extrait de Miroirs)', duration: '7′' },
          { text: 'Ravel — La Vallée des cloches (extrait de Miroirs)', duration: '5′' },
          { text: 'Chopin — Ballade n° 4 en fa mineur, op. 52', duration: '10′' },
          { intermission: true },
          { text: 'Chopin — Scherzo n° 4 en mi majeur, op. 54', duration: '11′' },
          { text: "Ravel — Jeux d'eau", duration: '5′' },
          {
            text: 'Mayu Hirano — Impromptu n° 1 « Les Jardins de Forge »',
            duration: '4′',
          },
          {
            text: 'Satie — Véritables Préludes flasques (pour un chien)',
            duration: '3′',
          },
          { text: 'Ravel — Le Tombeau de Couperin', duration: '21′' },
        ],
        links: [
          {
            href: 'https://youtu.be/ZGn2YlbwY2M',
            label: 'Écouter « Les Jardins de Forge » (Mayu Hirano) →',
          },
        ],
      },
      {
        id: 'hommage',
        title: 'Hommage au Salon Parisien',
        subtitle: 'Programme de récital · env. 90 minutes',
        pdfFilename: 'Keigo Mukawa - Hommage au Salon Parisien.pdf',
        pieces: [
          { text: 'Satie — Le Piccadilly', duration: '2′' },
          { text: 'Satie — Valse-ballet', duration: '3′' },
          { text: 'Satie — Sonatine bureaucratique', duration: '4′' },
          { text: 'Ravel — Parade', duration: '12′' },
          { text: 'Poulenc — Trois Novelettes', duration: '7′' },
          { text: 'Poulenc — Trois mouvements perpétuels', duration: '6′' },
          { text: 'Poulenc — Toccata', duration: '2′' },
          { intermission: true },
          { text: 'Satie — Gnossienne n° 1', duration: '3′' },
          { text: "Poulenc — Les Chemins de l'amour", duration: '3′' },
          {
            text: 'Poulenc — Improvisation n° 15 « Hommage à Édith Piaf »',
            duration: '3′',
          },
          { text: 'Debussy — Nocturne', duration: '7′' },
          {
            text: "Debussy — Les soirs illuminés par l'ardeur du charbon",
            duration: '2′',
          },
          { text: 'Poulenc — Les Soirées de Nazelles', duration: '23′' },
        ],
      },
    ],
  },
  en: {
    intro:
      'Programmes available for festivals, concert halls and private events. Indicative durations. Other programmes on request via management.',
    label: 'Recital programmes',
    contactCta: 'Programme request — Contact',
    downloadPdf: 'Download PDF',
    close: 'Close',
    footnoteOptional:
      'Works in parentheses are scheduled within the next year or available on short notice.',
    programmes: [
      {
        id: 'concerto',
        title: 'Concerto Repertoire',
        subtitle: 'Works for piano and orchestra',
        pdfFilename: 'Keigo Mukawa - Concerto Repertoire.pdf',
        footnote:
          'Performed with orchestra. Selected orchestra collaborations (competitions and concerts): Lorraine National Orchestra, Orchestre National de France, Belgian National Orchestra, Brussels Philharmonic, Prague Philharmonic Orchestra, Tokyo Symphony Orchestra, Tokyo Philharmonic Orchestra, Japan Philharmonic Orchestra, Yomiuri Nippon Symphony Orchestra, Tokyo Metropolitan Symphony Orchestra, etc.',
        sections: [
          {
            composer: 'J.S. Bach',
            works: [
              { title: 'Harpsichord Concerto No. 2 in E major, BWV 1053' },
              { title: 'Harpsichord Concerto No. 5 in F minor, BWV 1056' },
            ],
          },
          {
            composer: 'Mozart',
            works: [
              { title: "Piano Concerto No. 9 in E-flat major, KV 271 'Jeunehomme'" },
              { title: 'Piano Concerto No. 12 in A major, KV 414' },
              { title: 'Piano Concerto No. 20 in D minor, KV 466', optional: true },
              { title: 'Piano Concerto No. 21 in C major, KV 467' },
              { title: 'Piano Concerto No. 27 in B-flat major, KV 595' },
              { title: 'Concerto for Two Pianos in E-flat major, KV 365' },
            ],
          },
          {
            composer: 'Beethoven',
            works: [
              { title: 'Piano Concerto No. 1 in C major, Op. 15', optional: true },
              { title: 'Piano Concerto No. 3 in C minor, Op. 37' },
              { title: 'Piano Concerto No. 4 in G major, Op. 58' },
              { title: 'Piano Concerto No. 5 in E-flat major, Op. 73', optional: true },
              { title: 'Piano Concerto No. 6, Op. 61a — after the Violin Concerto Op. 61' },
              { title: 'Triple Concerto for Violin, Cello and Piano in C major, Op. 56' },
            ],
          },
          {
            composer: 'Mendelssohn',
            works: [{ title: 'Piano Concerto No. 1 in G minor, Op. 25' }],
          },
          {
            composer: 'Chopin',
            works: [
              { title: 'Piano Concerto No. 1 in E minor, Op. 11' },
              { title: 'Piano Concerto No. 2 in F minor, Op. 21' },
              { title: 'Andante spianato et Grande Polonaise brillante, Op. 22' },
            ],
          },
          {
            composer: 'Schumann',
            works: [{ title: 'Piano Concerto in A minor, Op. 54' }],
          },
          {
            composer: 'Brahms',
            works: [{ title: 'Piano Concerto No. 2 in B-flat major, Op. 83' }],
          },
          {
            composer: 'Saint-Saëns',
            works: [
              { title: 'Piano Concerto No. 2 in G minor, Op. 22' },
              { title: 'Piano Concerto No. 5 in F major, Op. 103 “L’Egyptien”' },
            ],
          },
          {
            composer: 'Tchaikovsky',
            works: [
              { title: 'Piano Concerto No. 1 in B-flat minor, Op. 23' },
              { title: 'Piano Concerto No. 2 in G major, Op. 44' },
            ],
          },
          {
            composer: 'Grieg',
            works: [{ title: 'Piano Concerto in A minor, Op. 16' }],
          },
          {
            composer: 'Rachmaninov',
            works: [
              { title: 'Piano Concerto No. 2 in C minor, Op. 18' },
              { title: 'Piano Concerto No. 3 in D minor, Op. 30' },
              { title: 'Rhapsody on a Theme of Paganini, Op. 43' },
            ],
          },
          {
            composer: 'Ravel',
            works: [
              { title: 'Piano Concerto in G major' },
              { title: 'Piano Concerto for the Left Hand' },
            ],
          },
          {
            composer: 'Prokofiev',
            works: [
              { title: 'Piano Concerto No. 1 in D-flat major, Op. 10', optional: true },
              { title: 'Piano Concerto No. 2 in G minor, Op. 16' },
              { title: 'Piano Concerto No. 3 in C major, Op. 26' },
            ],
          },
          {
            composer: 'Gershwin',
            works: [{ title: 'Rhapsody in Blue' }],
          },
          {
            composer: 'Poulenc',
            works: [{ title: 'Concerto for Two Pianos in D minor' }],
          },
          {
            composer: 'Messiaen',
            works: [{ title: 'Turangalîla-Symphonie' }],
          },
          {
            composer: 'Ifukube',
            works: [{ title: 'Ritmica Ostinata per Pianoforte ed Orchestra (1961/71)' }],
          },
          {
            composer: 'Yoshimatsu',
            works: [
              {
                title: 'Threnody to Toki for String Orchestra and Piano (1980)',
                optional: true,
              },
            ],
          },
          {
            composer: 'Nishimura',
            works: [{ title: 'Heterophony of Two Pianos and Orchestra (1987)' }],
          },
          {
            composer: 'Mantovani',
            works: [{ title: 'D’un jardin féérique (2021)' }],
          },
        ],
      },
      {
        id: 'voyage',
        title: 'Journey Around B Minor',
        subtitle: 'Aspiration Toward Light',
        pdfFilename: 'Keigo Mukawa - Journey Around B Minor.pdf',
        meta: 'Recital programme · c. 90 minutes',
        intro: [
          'The key of B minor has given rise to numerous masterpieces, often imbued with a sacred character. Yet the sacred often maintains a close link with light.',
          'Through works in B minor and its related keys, this recital traces a path from shadow toward light, culminating in one of the pinnacles of the piano repertoire: Liszt’s Sonata in B minor. Carried by an aspiration toward light, this journey opens a space for reflection on the mystery of the sacred and of light, while offering Liszt’s Sonata a new context for listening.',
        ],
        pieces: [
          { text: 'Bach — French Suite No. 3 in B minor, BWV 814', duration: '14′' },
          { text: 'Arvo Pärt — Für Alina', duration: '4′' },
          { text: 'Liszt — Romance oubliée in E major, S. 527', duration: '4′' },
          {
            text: 'Debussy — Images oubliées, I. Lent (melancholic and gentle)',
            duration: '4′',
          },
          { text: 'Chopin — Barcarolle in F-sharp major, Op. 60', duration: '9′' },
          { intermission: true },
          {
            text: 'Franck — Prélude, Fugue et Variation in B minor (arr. Jörg Demus for piano)',
            duration: '11′',
          },
          { text: 'Liszt — Piano Sonata in B minor, S. 178', duration: '30′' },
        ],
      },
      {
        id: 'beethoven',
        title: 'From Beethoven to Decadence',
        subtitle: 'Two Aspects of Beauty — Structure and Ecstasy',
        pdfFilename: 'Keigo Mukawa - From Beethoven to Decadence.pdf',
        meta: 'Recital programme · c. 90 minutes',
        intro: [
          'From Beethoven’s classical rigour to fin-de-siècle ecstasy, this programme sets two faces of musical beauty in dialogue: architectural structure and sonic intoxication. Three Beethoven sonatas open the first half; after the intermission, Ravel, Debussy, Crumb and Scriabin lead toward a world of masks, dreams and waltz.',
        ],
        pieces: [
          { text: 'Beethoven — Piano Sonata No. 1 in F minor, Op. 2 No. 1', duration: '16′' },
          { text: 'Beethoven — Piano Sonata No. 6 in F major, Op. 10 No. 2', duration: '11′30' },
          {
            text: 'Beethoven — Piano Sonata No. 23 in F minor, Op. 57 “Appassionata”',
            duration: '23′',
          },
          { intermission: true },
          { text: 'Ravel — Sérénade grotesque', duration: '3′30' },
          { text: 'Debussy — Danse bohémienne', duration: '2′' },
          {
            text: 'George Crumb — “Dream Images (Love-Death Music)” – Gemini, from Makrokosmos, Volume I',
            duration: '4′30',
          },
          { text: 'Scriabin — Two Poems, Op. 32', duration: '4′30' },
          { text: 'Debussy — Masques', duration: '5′' },
          { text: 'Ravel — La Valse', duration: '12′' },
        ],
      },
      {
        id: 'mosaique',
        title: 'Parisian Mosaic',
        subtitle: 'Recital programme · c. 90 minutes',
        pdfFilename: 'Keigo Mukawa - Parisian Mosaic.pdf',
        intro: [
          'This programme invites you into the musical world of Paris through a mosaic of works by composers who all lived in the French capital — whether French or foreign. Dance, Impressionism, cosmopolitanism, the spirit of the salon, homage to the past… Parisian musical culture has always drawn on a great diversity of influences. Gathered and arranged with attention to their contextual links, these works form a concert that conveys a Paris at once diverse and profound.',
        ],
        pieces: [
          { text: 'Poulenc — Suite française after Claude Gervaise', duration: '10′' },
          { text: 'Ravel — Pavane pour une infante défunte', duration: '6′' },
          { text: 'Satie — Le Piccadilly', duration: '2′' },
          { text: 'Ravel — Alborada del gracioso (from Miroirs)', duration: '7′' },
          { text: 'Ravel — La Vallée des cloches (from Miroirs)', duration: '5′' },
          { text: 'Chopin — Ballade No. 4 in F minor, Op. 52', duration: '10′' },
          { intermission: true },
          { text: 'Chopin — Scherzo No. 4 in E major, Op. 54', duration: '11′' },
          { text: "Ravel — Jeux d'eau", duration: '5′' },
          { text: 'Mayu Hirano — Impromptu No. 1 « Les Jardins de Forge »', duration: '4′' },
          { text: 'Satie — Véritables Préludes flasques (pour un chien)', duration: '3′' },
          { text: 'Ravel — Le Tombeau de Couperin', duration: '21′' },
        ],
        links: [
          {
            href: 'https://youtu.be/ZGn2YlbwY2M',
            label: 'Listen to « Les Jardins de Forge » (Mayu Hirano) →',
          },
        ],
      },
      {
        id: 'hommage',
        title: 'Homage to the Parisian Salon',
        subtitle: 'Recital programme · c. 90 minutes',
        pdfFilename: 'Keigo Mukawa - Homage to the Parisian Salon.pdf',
        pieces: [
          { text: 'Satie — Le Piccadilly', duration: '2′' },
          { text: 'Satie — Valse-ballet', duration: '3′' },
          { text: 'Satie — Sonatine bureaucratique', duration: '4′' },
          { text: 'Ravel — Parade', duration: '12′' },
          { text: 'Poulenc — Trois Novelettes', duration: '7′' },
          { text: 'Poulenc — Trois mouvements perpétuels', duration: '6′' },
          { text: 'Poulenc — Toccata', duration: '2′' },
          { intermission: true },
          { text: 'Satie — Gnossienne No. 1', duration: '3′' },
          { text: "Poulenc — Les Chemins de l'amour", duration: '3′' },
          { text: 'Poulenc — Improvisation No. 15 « Hommage à Édith Piaf »', duration: '3′' },
          { text: 'Debussy — Nocturne', duration: '7′' },
          {
            text: "Debussy — Les soirs illuminés par l'ardeur du charbon",
            duration: '2′',
          },
          { text: 'Poulenc — Les Soirées de Nazelles', duration: '23′' },
        ],
      },
    ],
  },
};
