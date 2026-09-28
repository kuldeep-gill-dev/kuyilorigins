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
      location: 'Karnataka, India',
      image: 'assets/ratnagiri-shade-pruning.jpg',
      imageAlt: 'A worker high in a shade tree at Ratnagiri Estate, managing the canopy over the coffee',
      roasterImage: 'assets/ratnagiri-sorting.jpg',
      roasterImageAlt: 'Workers hand-sorting green coffee spread across the floor at Ratnagiri Estate',
      summary: 'Experimental by instinct, with processing decisions made lot by lot and the people behind those trials driving what the coffee becomes.',
      description: 'Ratnagiri turns a heritage plantation into a laboratory for Indian specialty coffee. Carbonic maceration, honey, anaerobic and yeast-fermented lots are handled one at a time, always in service of a clean, expressive cup that still tastes of place.',
      pageUrl: 'ratnagiri.html',
      coffees: [
        {
          id: 'ratnagiri-hydro-honey',
          name: 'Ratnagiri Hydro Honey',
          lot: '',
          process: 'Hydro honey', variety: '', region: 'Karnataka',
          notes: [],
          story: '',
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
          id: 'ratnagiri-thermal-shock-natural',
          name: 'Ratnagiri Thermal Shock Natural',
          lot: '',
          process: 'Thermal shock, natural', variety: '', region: 'Karnataka',
          notes: [],
          story: '',
          status: 'soon',
          formats: {
            roasted: { status: 'soon', sizes: [{ label: '12 oz', price: null }] },
            green: { status: 'soon', sizes: [{ label: '5 lb', price: null }, { label: '10 lb', price: null }, { label: '30 lb', price: null }] },
            partners: []
          },
          roaster: {
            status: 'soldout',
            samples: { available: false },
            forward: {
              available: true, crop: 'Next harvest', arrival: 'May\u2013June 2027', minimum: '1 bag',
              estimatedLbs: null, indicativePrice: '', deadline: '', deposit: '', notes: '', confirmed: false
            }
          }
        }
      ]
    },

    {
      id: 'mysore',
      name: 'Mysore Plantations',
      location: 'Karnataka, India',
      image: 'assets/mysore-cherries-farm.jpg',
      imageAlt: 'A Robusta coffee bush heavy with ripening cherries growing in the field at Mysore Plantations',
      roasterImage: 'assets/mysore-picking.jpg',
      roasterImageAlt: 'Hands picking a cluster of ripe red coffee cherries at Mysore Plantations',
      summary: 'Women-owned, and treating Robusta as a specialty coffee in its own right rather than a commodity to be blended away.',
      description: 'A family plantation since 1942, now run by its third generation. Mysore grows shade-grown specialty Robusta with the care usually given to fine Arabica, with about 90 percent of the workforce women.',
      pageUrl: 'mysore.html',
      coffees: [
        {
          id: 'mysore-washed-robusta',
          name: 'Washed Robusta',
          process: 'Washed', variety: 'Robusta', region: 'Karnataka',
          notes: ['Brown sugar', 'Red apple', 'Walnut', 'Cinnamon'],
          story: 'A clean, sweet, medium-length Robusta that cups at 84.5. Selective harvesting and careful handling after picking give it a structure most people don’t expect from the species.',
          status: 'soon',
          formats: {
            roasted: { status: 'soon', sizes: [{ label: '12 oz', price: null }] },
            green: { status: 'soon', sizes: [{ label: '5 lb', price: null }, { label: '10 lb', price: null }, { label: '30 lb', price: null }] },
            partners: []
          },
          roaster: {
            status: 'inquire',
            samples: { available: true, note: '' },
            forward: { available: false }
          }
        },
        {
          id: 'mysore-honey-robusta',
          name: 'Honey Sun-Dried Robusta',
          process: 'Honey, sun-dried', variety: 'Robusta', region: 'Karnataka',
          notes: ['Honey', 'Yellow stone fruit', 'Brown sugar'],
          story: 'Dried in the sun with some of the fruit left on, this Robusta cups at 84 with a rounded sweetness. Another argument for taking Robusta seriously on its own terms.',
          status: 'soon',
          formats: {
            roasted: { status: 'soon', sizes: [{ label: '12 oz', price: null }] },
            green: { status: 'soon', sizes: [{ label: '5 lb', price: null }, { label: '10 lb', price: null }, { label: '30 lb', price: null }] },
            partners: []
          },
          roaster: {
            status: 'inquire',
            samples: { available: true, note: '' },
            forward: { available: false }
          }
        }
      ]
    },

    {
      id: 'harley',
      name: 'Harley Estate',
      location: 'Sakleshpur, Karnataka, India',
      image: 'assets/harley-estate-path.jpg',
      imageAlt: 'A shaded path through palms and coffee at Harley Estate',
      roasterImage: 'assets/harley-cherries.jpg',
      roasterImageAlt: 'Ripe coffee cherries being picked by hand at Harley Estate',
      summary: 'Women-led, with conservation shaping how the land is managed and a clear estate identity behind the coffee we selected.',
      description: 'About 500 acres in the Malnad hills, surrounded by forest and waterfalls, with coffee grown under silver oak, fig and jackfruit and processed with spring water from the estate itself.',
      pageUrl: 'harley.html',
      coffees: [
        {
          id: 'harley-banana-black-honey',
          name: 'Banana Black Honey',
          process: 'Black honey', variety: '', region: 'Sakleshpur, Karnataka',
          notes: [],
          story: 'A honey-processed lot associated with banana leaf during drying. It sparks curiosity straight away, but we ask it to be judged first by the cup and by how clearly the process is documented.',
          status: 'available',
          formats: {
            roasted: null,
            green: {
              status: 'available',
              blurb: 'Unroasted coffee for home roasters and coffee enthusiasts who want to roast the coffee themselves.',
              sizes: [
                { label: '5 lb', price: null },
                { label: '10 lb', price: null },
                { label: '30 lb', price: null }
              ]
            },
            partners: [
              {
                roaster: 'Kin Coffee',
                logo: '',
                description: 'The same Kuyil-origin coffee, roasted through the perspective of one of our roasting partners.',
                product: 'Banana Black Honey — Harley Estate',
                url: '',            /* TODO: paste Kin’s product page URL */
                roast: '',
                available: true
              }
            ]
          },
          roaster: {
            status: 'inquire',
            samples: { available: true, note: '' },
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
      description: 'A historic estate group in the Koppa and Chikmagalur belt, with its own wet mill and curing works, Rainforest Alliance certified Arabica and a certified organic block.',
      pageUrl: 'balanoor.html',
      coffees: []
    }
  ]
};
