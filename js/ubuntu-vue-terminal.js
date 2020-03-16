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
        user: "visitor@koeonyack.github.io",
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
            "ls": "artus.txt skills.txt cat.txt \n",
            "cat": "Specify the file you want to open... \n",
            "cat artus.txt": `\nMy name is Artus Vranken, and I am an avid software developer.
I'm always open to new challenges and aim to improve my skills each day.\n`,
            "cat cat.txt": `
　 ／l、     Meow :3
ﾞ（ﾟ､ ｡ ７
　 l、ﾞ ~ヽ
　 じしf_, )ノ
`,
            "cat skills.txt": `
-
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