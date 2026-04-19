// ============================================================
// NIGERIA STATES AND CITIES DATA
// All 36 states + FCT with comprehensive city lists
// Used across AddPropertyContent, PropertyListing filters
// ============================================================

export const nigeriaStates: { state: string; cities: string[] }[] = [
  {
    state: "Abia",
    cities: ["Aba", "Umuahia", "Ohafia", "Arochukwu", "Bende", "Isuikwuato", "Obingwa", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umu Nneochi"]
  },
  {
    state: "Adamawa",
    cities: ["Yola", "Mubi", "Ngurore", "Jimeta", "Numan", "Ganye", "Gombi", "Guyuk", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Fufore", "Demsa", "Toungo", "Wurno", "Song"]
  },
  {
    state: "Akwa Ibom",
    cities: ["Uyo", "Eket", "Ikot Ekpene", "Abak", "Itu", "Oron", "Ikot Abasi", "Etinan", "Essien Udim", "Ini", "Mkpat Enin", "Nsit Atai", "Nsit Ibom", "Nsit Ubium", "Obot Akara", "Oruk Anam", "Udung Uko", "Ukanafun", "Uruan", "Urue Offong"]
  },
  {
    state: "Anambra",
    cities: ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Agulu", "Aguata", "Anambra East", "Anambra West", "Anaocha", "Ayamelum", "Dunukofia", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Njikoka", "Idemili North", "Idemili South", "Ihiala"]
  },
  {
    state: "Bauchi",
    cities: ["Bauchi", "Azare", "Misau", "Ningi", "Tafawa Balewa", "Alkaleri", "Bogoro", "Dambam", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas Gadau", "Jama'are", "Katagum", "Kirfi", "Shira", "Toro", "Warji", "Zaki"]
  },
  {
    state: "Bayelsa",
    cities: ["Yenagoa", "Ogbia", "Brass", "Ekeremor", "Kolokuma Opokuma", "Nembe", "Sagbama", "Southern Ijaw", "Epie-Atissa", "Otuan", "Olodiama", "Bassan"]
  },
  {
    state: "Benue",
    cities: ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala", "Adikpo", "Agatu", "Apa", "Buruku", "Gwer East", "Gwer West", "Guma", "Konshisha", "Kwande", "Logo", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Tarka", "Ukum", "Ushongo", "Vandeikya"]
  },
  {
    state: "Borno",
    cities: ["Maiduguri", "Biu", "Bama", "Askira Uba", "Abadam", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"]
  },
  {
    state: "Cross River",
    cities: ["Calabar", "Ogoja", "Ikom", "Obudu", "Akamkpa", "Akpabuyo", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Obanliku", "Obubra", "Odukpani", "Yala"]
  },
  {
    state: "Delta",
    cities: ["Asaba", "Warri", "Sapele", "Agbor", "Abraka", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie"]
  },
  {
    state: "Ebonyi",
    cities: ["Abakaliki", "Afikpo", "Onueke", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"]
  },
  {
    state: "Edo",
    cities: ["Benin City", "Auchi", "Ekpoma", "Uromi", "Igueben", "Akoko-Edo", "Egor", "Esan Central", "Esan North East", "Esan South East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Oredo", "Orhionmwon", "Ovia North East", "Ovia South West", "Owan East", "Owan West", "Uhunmwonde"]
  },
  {
    state: "Ekiti",
    cities: ["Ado Ekiti", "Ikere", "Oye", "Efon", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikole", "Ilejemeje", "Irepodun Ifelodun", "Ise Orun", "Moba", "Ekiti East", "Ekiti South West", "Ekiti West"]
  },
  {
    state: "Enugu",
    cities: ["Enugu", "Nsukka", "Oji River", "Agwu", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Udenu", "Udi", "Uzo Uwani"]
  },
  {
    state: "FCT Abuja",
    cities: ["Abuja Central", "Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa", "Jabi", "Kubwa", "Lugbe", "Gwagwalada", "Kuje", "Bwari", "Abaji", "Kwali", "Dutse", "Nyanya", "Karu", "Zuba", "Karmo", "Dawaki", "Galadimawa", "Lokogoma", "Apo", "Lifecamp", "Katampe"]
  },
  {
    state: "Gombe",
    cities: ["Gombe", "Kaltungo", "Billiri", "Akko", "Balanga", "Dukku", "Funakaye", "Kwami", "Nafada", "Shomgom", "Yamaltu Deba"]
  },
  {
    state: "Imo",
    cities: ["Owerri", "Orlu", "Okigwe", "Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji Egbema", "Onuimo", "Owerri Municipal", "Owerri North", "Owerri West"]
  },
  {
    state: "Jigawa",
    cities: ["Dutse", "Hadejia", "Gumel", "Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Gagarawa", "Garki", "Gwaram", "Gwiwa", "Jahun", "Kafin Hausa", "Kaugama", "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"]
  },
  {
    state: "Kaduna",
    cities: ["Kaduna", "Zaria", "Kafanchan", "Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf"]
  },
  {
    state: "Kano",
    cities: ["Kano", "Wudil", "Bichi", "Albasu", "Bagwai", "Bebeji", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"]
  },
  {
    state: "Katsina",
    cities: ["Katsina", "Daura", "Funtua", "Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dan Musa", "Dandume", "Danja", "Dutsi", "Dutsin Ma", "Emure", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Kurfi", "Kusada", "Mai Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"]
  },
  {
    state: "Kebbi",
    cities: ["Birnin Kebbi", "Argungu", "Yauri", "Aliero", "Arewa Dandi", "Augie", "Bagudo", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko Besse", "Maiyama", "Ngaski", "Shanga", "Suru", "Wasagu Danko", "Zuru"]
  },
  {
    state: "Kogi",
    cities: ["Lokoja", "Okene", "Idah", "Ankpa", "Ajaokuta", "Bassa", "Dekina", "Ibaji", "Igalamela Odolu", "Ijumu", "Kabba Bunu", "Koton Karfe", "Mopa Muro", "Ofu", "Ogori Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"]
  },
  {
    state: "Kwara",
    cities: ["Ilorin", "Offa", "Omu-Aran", "Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Oyun", "Pategi"]
  },
  {
    state: "Lagos",
    cities: ["Ikeja", "Lekki", "Victoria Island", "Surulere", "Yaba", "Ajah", "Badagry", "Ikorodu", "Lagos Island", "Lagos Mainland", "Alimosho", "Ajeromi Ifelodun", "Kosofe", "Mushin", "Oshodi Isolo", "Ojo", "Ibeju Lekki", "Ifako Ijaye", "Somolu", "Amuwo Odofin", "Apapa", "Epe", "Eti Osa", "Shomolu", "Agege", "Orile", "Festac", "Satellite Town", "Gbagada", "Magodo", "Maryland", "Ojota", "Ketu", "Mile 12", "Ogudu", "Ojodu", "Berger", "Sangotedo", "Chevron", "Lekki Phase 1", "Lekki Phase 2", "Banana Island", "Ikoyi", "Oniru"]
  },
  {
    state: "Nasarawa",
    cities: ["Lafia", "Keffi", "Akwanga", "Awe", "Doma", "Karu", "Keana", "Kokona", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"]
  },
  {
    state: "Niger",
    cities: ["Minna", "Suleja", "Bida", "Agaie", "Agwara", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Munya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Tafa", "Wushishi"]
  },
  {
    state: "Ogun",
    cities: ["Abeokuta", "Sagamu", "Ijebu Ode", "Ota", "Ilaro", "Ijebu North", "Ijebu North East", "Ijebu South", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu", "Yewa North", "Yewa South", "Ewekoro", "Abeokuta North", "Abeokuta South"]
  },
  {
    state: "Ondo",
    cities: ["Akure", "Ondo", "Owo", "Akoko North East", "Akoko North West", "Akoko South East", "Akoko South West", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"]
  },
  {
    state: "Osun",
    cities: ["Osogbo", "Ile-Ife", "Ilesa", "Ede", "Iwo", "Ila Orangun", "Aiyedaade", "Aiyedire", "Atakumosa East", "Atakumosa West", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Ejigbo", "Ife Central", "Ife East", "Ife North", "Ife South", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"]
  },
  {
    state: "Oyo",
    cities: ["Ibadan", "Ogbomoso", "Oyo", "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North East", "Ibadan North West", "Ibadan South East", "Ibadan South West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"]
  },
  {
    state: "Plateau",
    cities: ["Jos", "Bukuru", "Shendam", "Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"]
  },
  {
    state: "Rivers",
    cities: ["Port Harcourt", "Obio-Akpor", "Bonny", "Ahoada East", "Ahoada West", "Akuku Toru", "Andoni", "Asari Toru", "Degema", "Eleme", "Emohua", "Etche", "Gokana", "Ikwerre", "Khana", "Obio Akpor", "Ogba Egbema Ndoni", "Ogu Bolo", "Okrika", "Omuma", "Opobo Nkoro", "Oyigbo", "Port Harcourt", "Tai"]
  },
  {
    state: "Sokoto",
    cities: ["Sokoto", "Tambuwal", "Gwadabawa", "Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tureta", "Wamako", "Wurno", "Yabo"]
  },
  {
    state: "Taraba",
    cities: ["Jalingo", "Wukari", "Bali", "Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Karim Lamido", "Kumi", "Lau", "Sardauna", "Takum", "Ussa", "Yorro", "Zing"]
  },
  {
    state: "Yobe",
    cities: ["Damaturu", "Potiskum", "Nguru", "Bade", "Bursari", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Tarmuwa", "Yunusari", "Yusufari"]
  },
  {
    state: "Zamfara",
    cities: ["Gusau", "Kaura Namoda", "Talata Mafara", "Anka", "Bakura", "Birnin Magaji Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Isa", "Kaura Namoda", "Kiyawa", "Maradun", "Maru", "Shinkafi", "Tsafe", "Zurmi"]
  },
];

export const allStates = nigeriaStates.map((s) => s.state);

export const getCitiesByState = (state: string): string[] => {
  const found = nigeriaStates.find((s) => s.state === state);
  return found ? found.cities : [];
};