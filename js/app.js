// Define a new component called todo-item
Vue.component('floating-bubble', {
    props: [
        'size',
        'speed',
        'x',
    ],
    template: `
    <div :class="'fx-rise fx-rise--' + Math.round(size / 2) + ' fx-circle size-w-' + size + ' size-h-' + size "></div>`
});

var app = new Vue({
    el: '#app',
    data: {
        bubbles: [
            { size: 2 },
        ],
        currencyOptions: [
        ],
        currencies: [
        ],
        baseCurrency: 'EUR',
        searchString: '',
        searchResults: null,
        
        times: {
            start: {
                day: 1,
                month: 1,
                year: 2020,
            },
            end: {
                day: 10,
                month: 1,
                year: 2020,
            },
        },

        // API
        api: axios.create({
            baseURL: 'http://data.fixer.io/api/',
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
            },
        }),
        apiKey: '73efda1fbe5e9eafe4b8878d0cc87bce',
    },
    methods: {
        startRise(node) {
            let h = node.offsetHeight;
            let w = node.offsetWidth;
            let top = window.innerHeight + h;
            let sideOffset = window.innerWidth * Math.random();

            node.style.left = `${sideOffset}px`;
            node.style.bottom = `-${h}px`;
            
            window.setTimeout(() => {
                node.style.bottom = `${top*2}px`;
                node.style.opacity = 0;
            }, 200);
        },
        initRise() {
            var riseEl = document.getElementsByClassName('fx-rise');
            for (let i = 0; i < riseEl.length; i++) {
                this.startRise(riseEl.item(i));
            }
        },
        addBubbles() {
            let bubbleDelay = 750;

            window.setInterval(() => {
                this.bubbles.push({
                    size: Math.floor(Math.random() * 6) + 1,
                });
    
                window.setTimeout(() => {
                    let addedBubble = document.querySelector('.fx-rise:last-child');
                    this.startRise(addedBubble);
                }, 10);
            }, bubbleDelay); // add bubbles based on size of screen
        },
        addRefreshListener() {
            if(!this.baseCurrencyValid) {
                return;
            }

            let refreshBtn = document.getElementById('refresh-btn').addEventListener('click', (e) => {
                let image = document.getElementById('refresh-btn-image');
                image.dataset.rotation = parseInt(image.dataset.rotation) + 360;
                image.style.transform = `rotate(${image.dataset.rotation}deg)`;
            });

            this.getLatest();
        },
        openMenu(name) {
            console.log('clicked menu for ' + name);
        },

        updateCurrencies(results) {
            console.log(results);
            for (const [key, val] of Object.entries(results.rates)) {
                let curr = this.currencies.find(el => el.name == key);
                if (curr) {
                    curr.value = val;
                } else {
                    this.currencies.push({ name: key, value: val });
                }
            }
        },

        // API Calls
        getLatest(curr = this.baseCurrency, symbols = this.currencyOptions) {
            this.api.get('/latest', {
                params: {
                    'access_key': this.apiKey,
                    'symbols': symbols.join(),
                    'base': this.baseCurrency,
                    'format': 1,
                }
            }).then(response => {
                console.log(response);
                this.updateCurrencies(response.data);
            }).catch(err => {
                console.error(err);
            });
        },
        getSymbols() {
            this.api.get('/symbols', {
                params: {
                    'access_key': this.apiKey,
                }
            }).then(response => {
                for (const [key, val] of Object.entries(response.data.symbols)) {
                    this.currencyOptions.push(key);
                }
            }).catch(err => {
                console.error(err);
            });
        },
        getTimeSeries(symbols) { // Only premium
            this.api.get('/timeseries', {
                params: {
                    'access_key': this.apiKey,
                    'start_date': `${this.times.start.year}-${this.times.start.month}-${this.times.start.day}`,
                    'end_date': `${this.times.end.year}-${this.times.end.month}-${this.times.end.day}`,
                    'symbols': symbols.join(),
                    'base': 'EUR',
                }
            }).then(response => {
                console.log(response.data);
            }).catch(err => {
                console.error(err);
            });
        },
        convertCurrency(from, to, amount) { // Only premium
            this.api.get('/convert', {
                params: {
                    'access_key': this.apiKey,
                    'from': from,
                    'to': to,
                    'amount': amount,
                }
            }).then(response => {
                console.log(response.data);
            }).catch(err => {
                console.error(err);
            });
        },
    },
    mounted() {
        this.initRise();
        this.addBubbles();
        this.addRefreshListener();
        
        this.getSymbols();
        this.convertCurrency('EUR', 'USD', 5);
    },
    computed: {
        currencyResults: function () {
            if (this.searchString) {
                return this.currencies.filter(el => el.name.includes(this.searchString.toUpperCase()));
            }
            return this.currencies;
        },
        searchValid: function () {
            if (this.searchString && this.currencyResults.length == 0) {
                return false; // if the search field is valid but does not return any results
            }
            return true;
        },
        baseCurrencyValid: function () {
            if (this.baseCurrency == 'EUR') {
                return true; // API only allows EUR as base currency for free users :(
            }
            return false;
        },
    }
});


// Charts
/*
var ctx = document.getElementById('exampleChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
        datasets: [{
            label: 'Euro',
            data: [1.033, 1.046, 1.034, 1.01, 1.03, 1.034, 1.044],
            borderColor: 'rgba(237, 53, 114, 1)',
            fill: false,
            borderWidth: 1
        },
        {
            label: 'Dollar',
            data: [0.993, 0.995, 0.991, 0.982, 0.988, 0.994, 0.992],
            borderColor: 'rgba(119, 197, 147, 1)',
            borderWidth: 1,
            fill: false,
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false
                },
            }]
        },
    }
});

*/