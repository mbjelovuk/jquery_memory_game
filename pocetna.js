$(document).ready(function() {
    localStorage.setItem('tezina',"")
    localStorage.setItem('rezim',"")
    $('#pokreniIgru').click(function(){
        let tezina = $('input[name="tezina"]:checked').val()
        let rezim = $('input[name="rezim"]:checked').val()
        localStorage.setItem('tezina',tezina)
        localStorage.setItem('rezim',rezim)
        window.location.href = "lab.html"
    })
    let scoreboard = [];
    let sc = localStorage.getItem('scoreboard');
    if (sc) {
        scoreboard = JSON.parse(sc);
    } else {
        scoreboard = [{ime: "kum ruzvelt", score: 1000000, tezina: "tesko"}];
        localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
    }

    scoreboard.sort(function(a, b) {
        if (a.tezina < b.tezina) {
            return 1;
        }
        if (a.tezina > b.tezina) {
            return -1;
        }
        return b.score - a.score;
    });

    $('#scoreboard').empty();
    scoreboard.forEach(igrac=>{
        let red = `<tr><td>${igrac.ime}</td>
                        <td>${igrac.score}</td>
                        <td>${igrac.tezina}</td></tr>`;
        $('#scoreboard').append(red);
    });
})