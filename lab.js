$(document).ready(function() {
    $('#tajmerdiv').hide();
    let rezim = localStorage.getItem('rezim');
    let tezina = localStorage.getItem('tezina');
    if(!rezim || !tezina)return;
    $('#tezina').text(tezina);
    let score = 0;
    let sekunde = 0;
    let tajmerInterval;
    let scoreboard = [];

    function refTabela(){
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
    }

    let muzika = document.getElementById("muzika");
    $("#dugmeMuzika").click(function() {
        if (muzika.paused) {
            muzika.play();
        } else {
            muzika.pause();
        }
    });
    $('#dugmeNazad').click(function(){
        window.location.href = "pocetna.html"
        // zaustaviIgru();
    })

    function promesaj(niz) {
        let indeks = niz.length - 1;
        while(indeks > 0) {
            let nasumicnaPozicija = Math.floor(Math.random() * indeks);
            let tmp = niz[indeks];
            niz[indeks] = niz[nasumicnaPozicija];
            niz[nasumicnaPozicija] = tmp;
            indeks--;
        }
        return niz;
    }

    let granica = 1;
    let red = 1;
    let kol = 1;
    if (tezina=='lako'){
        granica = 3;
        red = 2;
        kol = 3;
    }else if (tezina=='srednje'){
        granica = 8;
        red = 4;
        kol = 4;
    }else if (tezina=='tesko'){
        granica = 15;
        red = 5;
        kol = 6;
    }
    function popuniSlike() {
        let slike = [];
        for(let i = 1; i <= granica; i++) {
            slike.push("slike/" + i + ".png");
            slike.push("slike/" + i + ".png");
        }
        slike = promesaj(slike);

        for(let i = 0; i < red; i++) {
            let red = $("<tr></tr>");
            for(let j = 0; j < kol; j++) {
                let celija = $("<td></td>").append(
                    $("<img>").attr("src", slike[i*kol + j])
                              .attr("class", "otvorena")
                              .addClass("slika")
                              .css({
                                  "width" : "125px",
                                  "height" : "125px"
                              })
                              .attr("name", slike[i*kol + j])
                              .hide()
                ).append(
                    $("<img>").attr("src", "slike/0.png")
                              .attr("class", "zatvorena")
                              .addClass("slika")
                              .css({
                                  "width" : "125px",
                                  "height" : "125px"
                              })
                              .show()
                );
                red.append(celija);
            }
            $("#tabela").append(red);
        }
    }

    function refreshScore(){
        if(rezim=="vremenski"){
            if(sekunde>9 && sekunde%10==0)score-=2;
        }
        $('#score').text(score);
    }

    function format(sekunde){
        let min = Math.floor(sekunde/60);
        let sek = sekunde%60;
        if (min<10) min = "0" + min;
        if (sek<10) sek = "0" + sek;
        return min + ":" + sek;
    }
    function meriVreme(){
        sekunde++;
        $('#tajmer').text(format(sekunde));
        refreshScore();
    }

    function zaustaviIgru(){
        refTabela();
        if(rezim=='vremenski')clearInterval(tajmerInterval);
        if(confirm("zelite li da se upisete u tabelu?")){
            let ime = prompt("unesite ime");
            if (ime == null || ime == "") {
                // window.location.href = 'pocetna.html';
                // return;
            } else {
                let pod = {
                    "ime" : ime,
                    "score" : score,
                    "tezina" : tezina
                }
                scoreboard.push(pod);
                localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
                refTabela();
                // window.location.href = 'pocetna.html';
            }
        }
        $('#rez').removeClass('d-none');
    }

    refreshScore();
    popuniSlike();

    if(rezim=="vremenski"){
        $('#tajmerdiv').show();
        tajmerInterval = setInterval(meriVreme, 1000);
    }

    let potezi = 0;
    let parovi = 0;

    let otvorena = false;
    let prva = null;
    let zatvorenaPrva = null;
    let blokada = false;
    $("td").click(function() {
        if(blokada) return;
        if($(this).find("img").filter(".otvorena").css("display") != "none")
            return;
        if(!otvorena) {
            prva = $(this).find("img").filter(".otvorena").show();
            zatvorenaPrva = $(this).find("img").filter(".zatvorena").hide();
            otvorena = true;
        } else {
            let druga = $(this).find("img").filter(".otvorena").show();
            let zatvorenaDruga = $(this).find("img").filter(".zatvorena").hide();

            potezi++;
            if(potezi>granica) score-=1;

            if (prva.attr("name") != druga.attr("name")) {
                blokada = true;
                setTimeout(function() {
                    prva.hide();
                    druga.hide();
                    zatvorenaPrva.show();
                    zatvorenaDruga.show();
                    otvorena = false;
                    prva = null;
                    zatvorenaPrva = null;
                    blokada = false;
                    refreshScore();
                }, 1500)
            } else {
                prva = zatvorenaPrva = null;
                otvorena = false;

                score+=10
                refreshScore();
                parovi++;
                if(parovi==granica){
                    setTimeout(function() {
                        zaustaviIgru();
                    }, 1000);
                }
            }
        }
    })

});