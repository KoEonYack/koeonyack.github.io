let vueTerminal = new Vue({
    el: "#vue-terminal",
    template: `
    <div id="vue-terminal" class="vue-terminal" @click="focus">
        <ul class="vue-terminal-output-container">
            <li v-for="entry in output">
                <pre v-for="line in entry.split('\\n')"><span>{{line}}</span></pre>
            </li>
        </ul>
        <div class="vue-terminal-input-container">
            <div class="vue-terminal-prefix">{{prefix}}</div>
            <span :id="inputId" :class="{ focused : isFocused }" @keyup="keyUp" class="vue-terminal-input" contenteditable="true"></span>
        </div>
    </div>
    `,
    data: {
        user: "root@Covenant",
        directory: "/~",
        suffix: "$",
        history: new Array(),
        historyIndex: 0,
        input: "",
        output: new Array(),
        inputId: Math.floor(Math.random() * 1000),
        commands: {
            "help": `$ help
                    $ clear
                    $ ls
                    $ cat`,
            "clear": "exec clear",
            "ls": "announce.txt fish.txt cat.txt \n",
            "cat": "Specify the file you want to open... \n",
            "cat announce.txt": `\n
            집에만 있어서 많이 답답하고 🙄 \n
            처음 공부하는 파이썬이 어렵겠지만 😫
            파이팅~ 😆 \n
           \n`,
            "cat cat.txt": `
　 ／l、     Meow ~~
ﾞ（ﾟ､ ｡ ７
　 l、ﾞ ~ヽ
　 じしf_, )ノ
\n 고양이는 귀엽다.
`,
            "cat fish.txt": `
     <>< 물고기가 아닌 익투스 ΙΧΘΥΣ라고 읽는다.)\n
     Ιησους　Χριστος　Θεου　Υιος　Σωτηρ 이에수스 크리스토스 테우 휘오스 소테르,이이소이스 크리스토스 테오이 이이오스 소티르
     \n
     '하나님의 아들 구원자(구세주) 예수 그리스도' 또는 '주님은 저의 그리스도, 하나님의 아들(마16:16)'
`
        }
    },
    computed: {
        prefix: function () {
            return `${this.user}${this.directory} ${this.suffix}`;
        }
    },
    methods: {
        isFocused: function () {
            return document.activeElement.id == this.inputId;
        },
        focus: function () {
            while (document.activeElement.id != this.inputId) {
                document.getElementById(this.inputId).focus();
            }
        },
        keyUp: function (e) {

            switch (e.keyCode) {
                case 13:
                    e.preventDefault();
                    this.execute();
                    break;

                case 38:
                    e.preventDefault();
                    this.previousHistory();
                    break;
                case 40:
                    e.preventDefault();
                    this.nextHistory();
                    break;
            }

            this.updateInputValue();
        },
        updateInputValue: function () {
            this.input = document.getElementById(this.inputId).innerHTML;
        },
        updateFieldValue: function () {
            document.getElementById(this.inputId).innerHTML = this.input;
        },
        execute() {
            let tempInput = this.input.replace("<br>", "");
            tempInput = tempInput.replace("<div>", "");
            tempInput = tempInput.replace("</div>", "");
            this.historyIndex = 0;
            this.history.unshift(tempInput);

            let tempOutput = this.commands[tempInput];

            if (typeof tempOutput == "undefined") tempOutput = `Couldn't find command: ${tempInput}\nType 'help' for more information.`;

            switch (tempOutput) {
                case "exec clear":
                    this.clear();
                    return;
                    break;
            }

            this.output.push(`${this.prefix} ${tempInput}`);
            this.output.push(tempOutput);

            document.getElementById(this.inputId).innerHTML = "";
            this.input = "";

            Vue.nextTick(function () {
                document.getElementById("vue-terminal").scrollBy(0, 10000);
                document.getElementsByClassName("vue-terminal-input")[0].focus();
            });
        },
        previousHistory: function () {
            if (this.historyIndex + 1 > this.history.length) return;
            this.input = this.history[this.historyIndex++];
            this.updateFieldValue();
        },
        nextHistory: function () {
            if (this.historyIndex - 1 < 0) return;
            this.input = this.history[this.historyIndex--];
            this.updateFieldValue();
        },
        clearInput: function () {
            document.getElementById(this.inputId).innerHTML = "";
            this.input = "";
        },
        clear: function () {
            this.output = new Array();
            this.clearInput();
        },
    }

});