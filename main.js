Vue.config.devtools = true
Vue.component('Part1', {
    template: `
        <ul>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
        </ul>
    `
})
var app = new Vue({
    el: '#app',
    data: {
        stories: [],
        error: '',
        firstInput: '',
        secondInput: '',
        thirdInput: '',
        firstInputErr: false,
        secondInputErrA: false,
        secondInputErrB: false,
        thirdInputErr: false,
        submitErr: false,
    },
    methods: {
        firstInputValidation(input){
            //Check if input length is longer than 20 characters 
            if(input.length > 20)
                this.firstInputErr = true
            else 
                this.firstInputErr = false
        },
        secondInputValidation(input){
            let index = 0;
            let invalidChar = false;
            
            //Check if input length is longer than 50 characters
            if(input.length > 50)
                this.secondInputErrA = true
            else 
                this.secondInputErrA = false

            //Check if input contains invalid characters (anything that is not numbers or spaces)
            while(index < input.length && !invalidChar){
                if((input[index] >= '0' && input[index] <= '9') || input[index] == ' ')
                    index++
                else
                    invalidChar = true
            }
            if(invalidChar)
                this.secondInputErrB = true
            else 
                this.secondInputErrB = false
        },
        thirdInputValidation(input){
            //Check if input is in pattern DD/MM/YYYY
            if(!/^\d{2}\/\d{2}\/\d{4}$/.test(input))
                this.thirdInputErr = true;
            else 
                this.thirdInputErr = false
        },
        onSubmit() {
            this.firstInputValidation(this.firstInput)
            this.secondInputValidation(this.secondInput)
            this.thirdInputValidation(this.thirdInput)
            if(this.firstInputErr || this.secondInputErrA || this.secondInputErrB || this.thirdInputErr){
                console.log("error")
                submitErr = true
            }
            else {
                submitErr = false
                console.log("submit")
            }
        }
    },
    created: function (){
        fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
            .then(response => response.json())
            .catch (err => {
                this.error = err
            })
            .then(data => {
                let results = data.slice(0, 10)
                results.forEach(id => {
                    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
                    .then(response => response.json())
                    .catch (err => {
                        this.error = err
                    })
                    .then(data => {
                        this.stories.push({
                            id: data.id,
                            title: data.title,
                            url: data.url
                        })
                    })
                    .catch (err => {
                        this.error = err
                    })
                })
            })
            .catch(err => {
                this.error = err
            })
    }
})