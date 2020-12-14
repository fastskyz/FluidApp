// Define a new component called todo-item
Vue.component('floating-bubble', {
    props: [
        'size',
        'speed',
        'x',
    ],
    template: `
    <div :class="'fx-rise fx-rise--' + Math.round(size / 2) + ' fx-circle size-w-' + size + ' size-h-' + size "></div>`
})

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello World',
        bubbles: [
            { size: 2 },
        ]
    },
    methods: {
        startRise(node) {
            let h = node.offsetHeight;
            let w = node.offsetWidth;
            let top = window.innerHeight + h;
            
            // Set left to max 20% from sides
            let sideOffset = window.innerWidth * Math.random();
            /*
            if (Math.random() > 0.5 ) { // random true or false 50/50
                sideOffset = window.innerWidth - sideOffset;
            }
            */

            node.style.left = `${sideOffset}px`;
            node.style.bottom = `-${h}px`;
            
            window.setTimeout(() => {
                node.style.bottom = `${top*2}px`;
                node.style.opacity = 0;
            }, 200);
        },

    },
    mounted() {
        let learnMore = document.getElementById('learnMore');
        learnMore.addEventListener('click', () => {
            let top = document.getElementById('about').offsetTop;
            window.scrollTo({
                top: top,
                left: 0,
                behavior: 'smooth',
            });
        });

        document.addEventListener('scroll', (event) => {
            //console.log(event);
        });

        var riseEl = document.getElementsByClassName('fx-rise');
        for (let i = 0; i < riseEl.length; i++) {
            this.startRise(riseEl.item(i));
        }

        let bubbleDelay = Math.round(window.innerWidth * 2) / 2; // increase to do more
        bubbleDelay = 750;

        console.log(bubbleDelay);

        window.setInterval(() => {
            this.bubbles.push({
                size: Math.floor(Math.random() * 6) + 1,
                //speed: Math.ceil(Math.random() * 6),
            });

            window.setTimeout(() => {
                let addedBubble = document.querySelector('.fx-rise:last-child');
                this.startRise(addedBubble);
            }, 10);
        }, bubbleDelay); // add bubbles based on size of screen
    },
});


// Chart

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