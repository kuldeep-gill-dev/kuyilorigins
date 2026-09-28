/* Kuyil Origins — coffee catalog for the Coffee page.
 *
 * HOW TO EDIT
 *   Hierarchy:  ESTATE  ->  COFFEE / LOT  ->  BUYING FORMAT
 *   Add an estate  = add an object to `estates`.
 *   Add a coffee   = add an object to that estate's `coffees`.
 *   Add a format   = fill in `roasted`, `green` and/or `partners` on the coffee.
 *                    Leave a format out (or set it to null) and it simply doesn't show.
 *
 * STATUS values (coffee-level and per-format / per-size):
 *   'available'  |  'limited'  |  'soldout'  |  'soon'
 *   A coffee-level status of 'soon' or 'soldout' is shown on its card; each format
 *   and each size can carry its own status independently.
 *
 * PRICES: numbers in USD (e.g. 24). Use null while a price is still to be set;
 *   the size is then shown as "Price to be announced".
 *
 * PARTNER ROASTERS: add as many cards as you like to `partners`. Set
 *   `available: false` to hide one without deleting it. `url` opens in a new tab.
 *
 * ROASTER (GREEN) VIEW — For Roasters page. Per coffee, `roaster` holds everything that
 *   changes often. Blank / null / missing fields are simply not shown.
 *     status    'available' | 'limited' | 'soldout' | 'soon' | 'inquire'  (inquire = "ask us")
 *     lbsAvailable, bagSize, pricePerLb (number, $/lb), priceNote, samples {available, note},
 *     note (free text under the availability block)
 *     forward { available:true/false, crop, arrival, minimum, estimatedLbs, indicativePrice,
 *               deadline, deposit, notes, confirmed: true | false | null }
 *   Optional coffee-level `lot` (lot number) and `specs` {Harvest:'..', Altitude:'..'} are shown
 *   and sent with every request. Update `updated` below when you change inventory.
 *
 * CART: buttons call window.KuyilCart.add(item) if the checkout defines it. Until
 *   then they open the inquiry form with the coffee and size pre-filled.
 */
window.KUYIL_CATALOG = {
  updated: '',   /* e.g. 'October 2026' \u2014 shown on the roaster page when set */

  intro: {
    eyebrow: 'Discover Coffee Through Its Origin',
    title: 'Every Kuyil coffee begins with a producer.',
    body: 'Explore the estates we work with, discover the coffees they grow, and choose how you want to experience them — roasted for your cup, green for your home roaster, or through one of the roasting partners bringing these coffees to life across the U.S.'
  },

  estates: [
    {
      id: 'ratnagiri',
      name: 'Ratnagiri Estate',
      location: 'Bababudangiri, Chikmagalur, Karnataka, India',
      image: 'assets/ratnagiri-fermentation-tanks.jpg',
      imagePos: '50% 38%',
      imageAlt: 'Stainless-steel fermentation tanks inside the processing hall at Ratnagiri Estate',
      roasterImage: 'assets/ratnagiri-fermentation-tanks.jpg',
      roasterImageAlt: 'Stainless-steel fermentation tanks inside the processing hall at Ratnagiri Estate',
      summary: 'Experimental by instinct, with processing decisions made lot by lot and the people behind those trials driving what the coffee becomes.',
      description: 'Ratnagiri turns a heritage plantation into a laboratory for Indian specialty coffee. Carbonic maceration, honey, anaerobic and yeast-fermented lots are handled one at a time, always in service of a clean, expressive cup that still tastes of place.',
      pageUrl: 'ratnagiri.html',
      coffees: [
        {
          id: 'ratnagiri-hydro-honey',
          name: 'Hydro Honey',
          tagline: 'A clean, expressive honey coffee with approachable fruit and sweetness.',
          lot: '',
          process: 'Hydro Honey', variety: 'Catuai', region: 'Bababudangiri, Chikmagalur, Karnataka',
          score: '84.5',
          notes: ['Peach', 'Florals', 'Lemon citrus', 'Brown sugar'],
          cupProfile: 'Bright · Juicy · Silky',
          story: 'A bright and expressive Catuai from Ratnagiri Estate with honey-like sweetness, lively citrus acidity and a clean, silky finish.',
          processStory: 'The coffee is processed using a honey-style method, retaining fruit mucilage around the seed during drying. This helps build sweetness, texture and layered fruit character while preserving clarity in the cup.',
          roastDirection: 'Light-medium to medium is a good starting point to preserve the citrus, florals and sweetness.',
          specs: {},
          status: 'soon',
          formats: {
            roasted: { status: 'soon', sizes: [{ label: '12 oz', price: null }] },
            green: { status: 'soon', sizes: [{ label: '5 lb', price: null }, { label: '10 lb', price: null }, { label: '30 lb', price: null }] },
            partners: []
          },
          roaster: {
            status: 'available',
            lbsAvailable: null,     /* e.g. 58 */
            bagSize: '', pricePerLb: null, priceNote: '',
            samples: { available: true, note: '' },
            note: '',
            forward: {
              available: true, crop: 'Next harvest', arrival: 'May\u2013June 2027', minimum: '1 bag',
              estimatedLbs: null, indicativePrice: '', deadline: '', deposit: '', notes: '', confirmed: false
            }
          }
        },
        {
          id: 'ratnagiri-lot-42-carbonic-natural',
          name: 'Lot 42 Carbonic Natural',
          tagline: 'Experimental showcase single origin — expressive, fermentation-forward and clearly differentiated.',
          lot: '42',
          process: '54-hour Carbonic Natural', variety: 'SLN 6', region: 'Bababudangiri, Chikmagalur, Karnataka',
          score: '85',
          notes: ['Red grape', 'Strawberry', 'Baker’s chocolate'],
          cupProfile: 'Intense fermentation-driven sweetness · Medium-high acidity · Medium-heavy body · Silky, dry, wine-like finish',
          story: 'A 54-hour carbonic natural from Ratnagiri’s GIRI Patte block. SLN 6 cherries harvested at 24.9 Brix undergo controlled fermentation in a CO₂-rich environment before being slow-dried on raised beds for 30 days.',
          processStory: 'SLN 6 cherries from Ratnagiri Estate’s GIRI Patte block are harvested at 24.9 Brix. After floater removal, the cherries are placed in stainless-steel fermenters and allowed to ferment for 54 hours in a carbon-dioxide-rich environment. The whole cherries are then transferred directly to raised beds and slowly dried for approximately 30 days with constant stirring to encourage even drying.',
          roastDirection: 'Medium roast, with enough development to support the juicy body and grape sweetness while preserving the layered red-fruit character. Suited to pour-over, a seasonal single origin or a featured coffee.',
          specs: {
            'Producer lot': 'RT-LOT-42-CARBONIC NATURALS',
            'Block': 'GIRI Patte',
            'Elevation': '4,450 ft',
            'Fermentation': '54 hours, CO₂-rich, stainless-steel fermenters',
            'Cherry Brix': '24.9',
            'Drying': 'Raised beds, about 30 days, constant stirring',
          },
          status: 'soon',
          formats: {
            roasted: { status: 'soon', sizes: [{ label: '12 oz', price: null }] },
            green: { status: 'soon', sizes: [{ label: '5 lb', price: null }, { label: '10 lb', price: null }, { label: '30 lb', price: null }] },
            partners: []
          },
          roaster: {
            status: 'inquire',
            lbsAvailable: null,     /* e.g. 58 */
            bagSize: '', pricePerLb: null, priceNote: '',
            samples: { available: true, note: '' },
            note: '',
            forward: { available: false }
          }
        }
      ]
    },
    {
      id: 'mysore',
      name: 'Mysore Plantations',
      location: 'Karnataka Highlands, Western Ghats, India',
      image: 'assets/mysore-thumb.jpg',
      imagePos: '50% 60%',
      imageAlt: 'Shade trees rising above the low green bushes on the hillside at Mysore Plantations',
      roasterImage: 'assets/mysore-thumb.jpg',
      roasterImageAlt: 'Shade trees rising above the low green bushes on the hillside at Mysore Plantations',
      summary: 'Women-owned, and treating Robusta as a specialty coffee in its own right rather than a commodity to be blended away.',
      description: 'A third-generation family plantation, woman-owned and managed, focused on specialty Robusta. About 90 percent of the workforce are women, and the coffee grows in a shade-grown, diversified farming system.',
      pageUrl: 'mysore.html',
      coffees: [
        {
          id: 'mysore-honey-robusta',
          name: 'Honey Robusta',
          tagline: 'Specialty Robusta — a softer, sweeter expression of the species.',
          lot: '',
          process: 'Honey, sun-dried', variety: 'Robusta (Coffea canephora)', region: 'Karnataka Highlands, Western Ghats',
          score: '84',
          notes: ['Honey', 'Yellow stone fruit', 'Brown sugar'],
          cupProfile: 'Sweet · Fruity · Chocolate finish',
          story: 'A honey-processed specialty Robusta showing a softer and sweeter expression of the species, with honeyed sweetness, yellow stone fruit and brown sugar leading into a chocolate-driven finish.',
          processStory: 'After harvest, the skin and part of the fruit pulp are removed while a layer of mucilage remains around the seed. The coffee is then sun-dried with that mucilage intact, encouraging additional sweetness, fruit character and texture compared with a fully washed Robusta.',
          roastDirection: '',
          specs: {},
          status: 'soon',
          formats: {
            roasted: { status: 'soon', sizes: [{ label: '12 oz', price: null }] },
            green: { status: 'soon', sizes: [{ label: '5 lb', price: null }, { label: '10 lb', price: null }, { label: '30 lb', price: null }] },
            partners: []
          },
          roaster: {
            status: 'inquire',
            lbsAvailable: null,     /* e.g. 58 */
            bagSize: '', pricePerLb: null, priceNote: '',
            samples: { available: true, note: '' },
            note: '',
            forward: { available: false }
          }
        },
        {
          id: 'mysore-washed-robusta',
          name: 'Washed Robusta',
          tagline: 'Clean specialty Robusta — an accessible single origin.',
          lot: '',
          process: 'Washed', variety: 'Robusta (Coffea canephora)', region: 'Karnataka Highlands, Western Ghats',
          score: '84.5',
          notes: ['Brown sugar', 'Red apple', 'Walnut', 'Cinnamon'],
          cupProfile: 'Clean · Structured · Sweet-tart',
          story: 'A clean and structured specialty Robusta from Mysore Plantations, with brown-sugar sweetness, red apple, walnut and gentle cinnamon-like spice.',
          processStory: 'The harvested cherries are pulped to remove the fruit. The coffee is then fermented so the remaining mucilage can break down, washed clean and dried. This produces a cleaner, more structured expression of Robusta with less fermentation-driven fruit character than the honey-processed lot.',
          roastDirection: '',
          specs: {},
          status: 'soon',
          formats: {
            roasted: { status: 'soon', sizes: [{ label: '12 oz', price: null }] },
            green: { status: 'soon', sizes: [{ label: '5 lb', price: null }, { label: '10 lb', price: null }, { label: '30 lb', price: null }] },
            partners: []
          },
          roaster: {
            status: 'inquire',
            lbsAvailable: null,     /* e.g. 58 */
            bagSize: '', pricePerLb: null, priceNote: '',
            samples: { available: true, note: '' },
            note: '',
            forward: { available: false }
          }
        }
      ]
    },
    {
      id: 'harley',
      name: 'Harley Estate',
      location: 'Sakleshpur, Hassan District, Karnataka, India',
      image: 'assets/harley-estate-path.jpg',
      imageAlt: 'A shaded path through palms and coffee at Harley Estate',
      roasterImage: 'assets/harley-cherries.jpg',
      roasterImageAlt: 'Ripe coffee cherries being picked by hand at Harley Estate',
      summary: 'Women-led, with conservation shaping how the land is managed and a clear estate identity behind the coffee we selected.',
      description: 'A women-led, conservation-focused estate in the Western Ghats, with research-driven farming across about 500 acres of forest, waterfalls and shade-grown coffee.',
      pageUrl: 'harley.html',
      coffees: [
        {
          id: 'harley-banana-black-honey',
          name: 'Banana Black Honey',
          tagline: 'Flagship premium experimental coffee.',
          lot: '',
          process: 'Banana Black Honey / Banana Co-Ferment', variety: 'Chandragiri', region: 'Sakleshpur, Hassan District, Karnataka',
          score: '85',
          notes: ['Brown sugar', 'Yellow fruit', 'Honey graham cracker'],
          cupProfile: 'Bright · Sweet · Syrupy',
          story: 'A playful but balanced Chandragiri from Harley Estate. Black-honey processing and banana co-fermentation create a syrupy coffee with yellow-fruit character, brown-sugar sweetness and a gentle banana expression that does not overpower the cup.',
          processStory: 'Ripe cherries are processed as a black honey, retaining a substantial amount of fruit mucilage around the seed. Banana is introduced during fermentation, creating a fruit-associated co-fermentation environment before the coffee is carefully dried with the sticky mucilage still intact.',
          roastDirection: '',
          specs: {},
          status: 'soon',
          formats: {
            roasted: { status: 'soon', sizes: [{ label: '12 oz', price: null }] },
            green: { status: 'soon', sizes: [{ label: '5 lb', price: null }, { label: '10 lb', price: null }, { label: '30 lb', price: null }] },
            partners: [
              {
                roaster: 'Kin Coffee',
                logo: '',
                description: 'The same Kuyil-origin coffee, roasted through the perspective of one of our roasting partners.',
                product: 'Banana Black Honey \u2014 Harley Estate',
                url: '',            /* TODO: paste Kin\u2019s product page URL */
                roast: '',
                available: true
              }
            ]
          },
          roaster: {
            status: 'inquire',
            lbsAvailable: null,     /* e.g. 58 */
            bagSize: '', pricePerLb: null, priceNote: '',
            samples: { available: true, note: '' },
            note: '',
            forward: { available: false }
          }
        }
      ]
    },
    {
      id: 'balanoor',
      name: 'Balanoor Plantations',
      location: 'Chikmagalur, Karnataka, India',
      image: 'assets/balanoor-picking.jpg',
      imageAlt: 'A picker in a blue headscarf selecting ripe cherries at Balanoor Plantations',
      roasterImage: 'assets/balanoor-green-trays.jpg',
      roasterImageAlt: 'A worker checking coffee on green drying trays at Balanoor Plantations',
      summary: 'A long estate history in Karnataka, with sustainability practices that shape the coffees it produces today.',
      description: 'A family-owned estate since 1937 and a long-standing Chikmagalur producer, with its own wet mill, curing works and warehousing, and strong traceability and processing control.',
      pageUrl: 'balanoor.html',
      coffees: [
        {
          id: 'balanoor-selection-9',
          name: 'Selection 9',
          tagline: 'An approachable, variety-led everyday specialty.',
          lot: '',
          process: 'Washed', variety: 'Selection 9 (SL9 / Sln.9)', region: 'Chikmagalur, Karnataka',
          score: '82',
          notes: ['Brown sugar', 'Green apple', 'Nutty'],
          cupProfile: 'Balanced · Approachable · Structured',
          story: 'A washed Selection 9 from one of Karnataka’s long-standing coffee estates. Brown-sugar sweetness and green-apple acidity meet a gentle nutty character in an approachable, structured cup.',
          processStory: 'A washed, variety-forward coffee intended to show the character of Selection 9 with clarity and structure.',
          roastDirection: '',
          specs: {
            'Acidity': 'Mild malic',
            'Body': 'Medium to thin',
            'Finish': 'Dry, short',
          },
          status: 'soon',
          formats: {
            roasted: { status: 'soon', sizes: [{ label: '12 oz', price: null }] },
            green: { status: 'soon', sizes: [{ label: '5 lb', price: null }, { label: '10 lb', price: null }, { label: '30 lb', price: null }] },
            partners: []
          },
          roaster: {
            status: 'inquire',
            lbsAvailable: null,     /* e.g. 58 */
            bagSize: '', pricePerLb: null, priceNote: '',
            samples: { available: true, note: '' },
            note: '',
            forward: { available: false }
          }
        }
      ]
    }
  ]
};
