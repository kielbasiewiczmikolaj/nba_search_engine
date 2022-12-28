$(document).ready(function () {
    $("input:text:visible:first").focus();

});

const searchButton = $('button');
const searchInput = $('input');

searchButton.click(function () {
    const inputValue = searchInput.value;
    alert(inputValue);
});

$(document).on("keydown", function (event) {
    if (event.which == 13) {
        doSearch();
    }
});


//todo: 


//3. rozne pozycje graczy roznymi kolorami


//6. MAPY DO IMIENIA/NAZWISKA/DRUZYNY
var map1 = new Map();
map1.set("games_played", "Rozegrane mecze");
map1.set("pts", "Punkty na mecz");
map1.set("reb", "Zbiórki na mecz");
map1.set("ast", "Asysty na mecz");
map1.set("stl", "Przechwyty na mecz");
map1.set("blk", "Bloki na mecz");
map1.set("turnover", "Straty na mecz");
map1.set("fg_pct", "Skuteczność rzutów z gry");
map1.set("fg3_pct", "Skuteczność rzutów za trzy punkty");
map1.set("ft_pct", "Skuteczność rzutów osobistych");

var season_averages;

var values_to_display = ["first_name", "last_name", "position", "team"];


function getAverages(id) {
    $.ajax({
        url: "https://www.balldontlie.io/api/v1/season_averages?player_ids[]=" + id,
        method: "GET",
        dataType: "json"
    }).success(function (data) {
            //console.log(data);


            if (data.data.length) {
              $.each(data.data[0], function (key, value) {
                    if (map1.has(key)) {

                        $('#result').append('<br>' + map1.get(key) + ":" + value);


                    }
                }
            )
            $('#result').show();
            $("#try_again").hide();    
            $('#error_result').hide();
            }
            
        }
    )
}
function doSearch() {
    $("#result").hide();
    $("#error_result").hide();
    $('#result').empty();
    var player_name1 = $('#playername').val();

    if (player_name1.length == 0) {
        $("#error_result").show();
        $("#try_again").hide();
        $("#result").hide();
    } else {
        $.ajax({
            url: "https://www.balldontlie.io/api/v1/players?search=" + player_name1,
            method: "GET",
            dataType: "json"
        }).success(function (data) {
            console.log(data);
            if (data.data.length == 0) {
                $("#error_result").show();
                $("#result").hide();
                $("#try_again").hide();
            } else if (data.data.length > 1) {
              $("#try_again").show();
                $("#result").hide();
                

            } else {
                $('#result').empty();
            }
            

            var results = data.data[0];
            $.each(results, function (key, value) {
                if (values_to_display.includes(key)) {
                    if (typeof value === 'object' && value != null) {
                        $('#result').append("<br>" + key + ": " + value.full_name + "<br>");


      
              } else{  

                        $('#result').append('<br>' + key + ': ' + value);
                    }


                }


            });


            getAverages(data.data[0].id);


        });

    }
}

// https://www.balldontlie.io/api/v1/season_averages?seasons[]=2021&player_ids[]= + player1_id, <--- kolejne zapytanie o statsy