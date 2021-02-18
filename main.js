Vue.config.devtools = true
Vue.component('Part1', {
    template: `
        <div id="part1-container">
            <h1 class="display-1">Part One</h1>
            <ul>
                <li v-for="story in stories" :key="story.id" class="list-group-item">
                    <h5>{{story.title}}</h5>
                    <a :href="story.url">{{story.url}}</a>
                </li>
            </ul>
        </div>
    `,
    data(){
        return {
            stories: [],
            error: '',         
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

Vue.component('Part2', {
    template: `
    <div id="part2-container">
    <h1 class="display-1">Part Two</h1>
    <form @submit.prevent="onSubmit">
        <div class="form-group">
            <p v-if="firstInputErr"class="text-danger">Error: Input is longer than 20 characters</p>
            <input type="text" id="firstInput" v-model="firstInput" placeholder="First" class="form-control"><br>
        </div>
        <div class="form-group">
            <p v-if="secondInputErrA"class="text-danger">Error: Input is longer than 50 characters</p>
            <p v-if="secondInputErrB"class="text-danger">Error: Input can only contain numbers or spaces</p>
            <textarea id="secondInput" v-model="secondInput" placeholder="Second" class="form-control"></textarea><br>
        </div>
        <div class="form-group">
            <p v-if="thirdInputErrA"class="text-danger">Error: Input must be in format 'MM/DD/YYYY'</p>
            <p v-if="thirdInputErrB"class="text-danger">Error: Invalid Date</p>
            <input id="thirdInput" v-model="thirdInput" placeholder="Third" class="form-control"><br>
        </div>
        <button type="submit" class="btn" v-bind:class="[submitErr ? 'btn-danger' : 'btn-success']">Submit</button>
        
    </form>
    </div>
    `,
    data(){
        return {
            firstInput: '',
            secondInput: '',
            thirdInput: '',
            firstInputErr: false,
            secondInputErrA: false,
            secondInputErrB: false,
            thirdInputErrA: false,
            thirdInputErrB: false,
            submitErr: false,
        }
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
                this.thirdInputErrA = true;
            else 
                this.thirdInputErrA = false
            
            //If date is not a valid date
            if(!this.thirdInputErrA && !moment(input).isValid())
                this.thirdInputErrB = true;
            else
                this.thirdInputErrB = false
        },
        onSubmit() {
            this.firstInputValidation(this.firstInput)
            this.secondInputValidation(this.secondInput)
            this.thirdInputValidation(this.thirdInput)
            console.log(this.firstInputErr)
            console.log(this.secondInputErrA)
            console.log(this.secondInputErrB)
            console.log(this.thirdInputErrA)
            console.log(this.thirdInputErrB)

            if(this.firstInputErr || this.secondInputErrA || this.secondInputErrB || this.thirdInputErrA || this.thirdInputErrB){
                console.log("error")
                this.submitErr = true
                console.log("submitError: " + this.submitErr)
            }
            else {
                this.submitErr = false
                console.log("submit")
            }
            console.log("submitError: " + this.submitErr)
        }
    }
})
var app = new Vue({
    el: '#app',
})