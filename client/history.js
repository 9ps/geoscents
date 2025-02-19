const CONSTANTS = require('../resources/constants.js')
class History {
    constructor(socket) {
        this.socket = socket;
        this.myRoomName = CONSTANTS.LOBBY;
        this.myCitysrc = CONSTANTS.LOBBY;
        this.histCount = 0;
    }

    breakHistory(room, winner, score, color, record) {
        const myRoomName = this.myRoomName;
        if (room === myRoomName) {
            var newRecord = "";
            if (record) newRecord = " 🎉 NEW RECORD 🎉";
            var assembled = "<br>******* " + myRoomName + " WINNER: <font color=\"" + color + "\">" + winner + " (" + score + " points)</font>" + newRecord + " *******<br>"
            var final_message = $("<font style=\"font-size:20px;\" />").html(assembled);
            $('#gamehist').prepend(" ");
            $('#gamehist').prepend(final_message);
            this.histcount = this.histcount + 1;
            // if (this.histcount > CONSTANTS.MAX_GAME_HIST) {
            //     $('#gamehist').children().last().remove();
            //     this.histcount = this.histcount - 1;
            // }
        }
    }


    drawPath(history) {
        // TODO: Copy to clipboard button
        //         let js = `<script>
        // var node = document.getElementById('mypath` + histcount + `');
        // var btn = document.getElementById('sharepath` + histcount + `');
        // btn.onclick = function() {
        // node.innerHTML = "I'm an image now."
        //   domtoimage.toBlob(document.getElementById('mypath` + histcount + `'))
        //     .then(function(blob) {
        //       window.saveAs(blob, 'my-node.png');
        //     });
        // }
        // </script>`
        //         history = history + js;

        $('#gamehist').prepend(history);
    }

    drawChart(hist, winner, color, room, max) {
        const width = 540;
        const height = 115;
        const playersHistory = new Map(JSON.parse(hist));
        // based on https://codepen.io/dmmfll/pen/vGbZrK
        var graph = `<br><div class="graph-container">
<font color="${color}">${winner}</font> wins ${room} with ${max} points!
  <div class="chart-box">
    <svg height="${height}" width="${width}">`

        const graph_footer = `  </svg>
    <div class="x-labels" >
      <div>0</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
      <div>7</div>
      <div>8</div>
      <div>9</div>
      <div>10</div>
      <div>11</div>
    </div>
    <div class="y-labels">
      <div class="y-label top">${max}</div>
    </div>
  </div>
</div>`;
        var i = 0;
        playersHistory.forEach((hist, player) => {
            i = i + 1;
            Object.keys(hist).forEach((round) => {
                const x1 = (round) * ((width) / (CONSTANTS.GAME_ROUNDS));
                var y1 = height;
                if ((round - 1) in hist) {
                    y1 = height - height * (hist[round - 1]['total_points'] / (Math.max(max, 1)));
                }
                const x2 = (1 + parseInt(round)) * ((width) / (CONSTANTS.GAME_ROUNDS));
                const y2 = height - height * (hist[round]['total_points'] / (Math.max(max, 1)));
                graph = graph + `
<polyline
    fill="none"
    stroke="${player.color}"
    stroke-width="2"
    points="
   ${x1}, ${y1}
   ${x2}, ${y2}
    "
    />
`
            });
        });


        graph = graph + graph_footer;
        $('#gamehist').prepend(graph);
        this.histcount = this.histcount + 1;
        // if (this.histcount > CONSTANTS.MAX_GAME_HIST) {
        //     $('#gamehist').children().last().remove();
        //     this.histcount = this.histcount - 1;
        // }
    }
    addHistory(room, payload) {
        if (room === this.myRoomName) {
            const assembled = payload;
            const final_message = $("<font style=\"font-size:17px;\" />").html(assembled);
            $('#gamehist').prepend(final_message);
            this.histcount = this.histcount + 1;
            // if (this.histcount > CONSTANTS.MAX_GAME_HIST) {
            //     $('#gamehist').children().last().remove();
            //     this.histcount = this.histcount - 1;
            // }
        }
    }
}

module.exports = History