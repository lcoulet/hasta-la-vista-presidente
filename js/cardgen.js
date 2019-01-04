
function removeAccents(str) {
  var accents    = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
  var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
  str = str.split('');
  var strLen = str.length;
  var i, x;
  for (i = 0; i < strLen; i++) {
    if ((x = accents.indexOf(str[i])) != -1) {
      str[i] = accentsOut[x];
    }
  }
  return str.join('').toLowerCase();
}


function textToHtml(text){
  return $('<div>').text(text).html();
}

var scope = {
  currentCardId : 0,
  cards:[],
  addCards: function(moreCards){
    this.cards.concat(moreCards);
    this.renderCards(moreCards);
  },
  renderCards : function(cards){
    cards
    .filter(element => element.Type !== undefined && element.Type.length > 0 )
    .forEach(element => {
        var cardId = this.currentCardId++;
        $('#cards').append(
            $('<li id="card'+cardId+'">')
            .html('<div class="insideCard"><div class="cardTitle"><h2>'+textToHtml(element.Nom)+'</h2><h3>'+textToHtml(element.Type)+
              '</h3></div><div class="cardImage"><img src="svg/'+element.Image+'"  onerror="this.src=\'svg/default.svg\'" class="cardImage"></div><div class="cardText">'+textToHtml(element.Effets)+'</div></div>')
            .addClass("card")
            .addClass(removeAccents(element.Couleur)));
        if( element.Voix !== undefined && element.Voix.length > 0 ){
          $('#card'+cardId).append($('<div>').text(element.Voix).addClass("circle").addClass("vote"));
        }
        if( element.Cout !== undefined && element.Cout.length > 0 ){
          $('#card'+cardId).append($('<div>').text(element.Cout).addClass("circle").addClass("cost"));
        }
    })
  }
};

var processCSV = function ( csvContents ){
  var csvData = Papa.parse(csvContents,{header: true});
  scope.addCards(csvData.data);
}

$.ajax({
    type: "GET",
    url: "anciennes_cartes.csv",
    dataType: "text",
    success: processCSV        
})


$.ajax({
  type: "GET",
  url: "nouvelles_cartes.csv",
  dataType: "text",
  success: processCSV        
})

