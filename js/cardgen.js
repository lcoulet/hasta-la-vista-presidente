
function removeAccents(str) {
  var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
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


function textToHtml(text) {
  return $('<div>').text(text).html();
}

var scope = {
  currentCardId: 0,
  cards: [],
  bills: [],
  addCards: function (moreCards) {
    this.cards.concat(moreCards);
    this.renderCards(moreCards);
  },
  addBills: function (moreBills) {
    this.bills.concat(moreBills);
    this.renderBills(moreBills);
  },
  renderCards: function (cards) {
    cards
      .filter(element => element.Type !== undefined && element.Type.length > 0)
      .forEach(element => {
        var cardId = this.currentCardId++;
        var cardTextHtml = "Carte de type <i>" + textToHtml(element.Type) + "</i>";

        if (element.Effets !== undefined && element.Effets !== '') {
          cardTextHtml = textToHtml(element.Effets);
        }
        if (element.Conditions !== undefined && element.Conditions !== '') {
          cardTextHtml = cardTextHtml + "<br /><br /><b>Conditions : </b>" + textToHtml(element.Conditions);
        }
        if (element.Cout !== undefined && element.Cout !== '') {
          cardTextHtml = cardTextHtml + "<br /><br /><b>Payez : </b>" + textToHtml(element.Cout) + " M&#8369;";
        }

        $('#cards').append(
          $('<li id="card' + cardId + '">')
            .html('<div class="insideCard"><div class="cardTitle"><h2>' + textToHtml(element.Nom) + '</h2><h3>' + textToHtml(element.Type) +
              '</h3></div><div class="cardImage"><img src="svg/' + element.Image + '"  onerror="this.src=\'svg/default.svg\'" class="cardImage"></div><div class="cardBottomContainer"><div id="cardTexts' + cardId + '" class="cardTexts"><div class="cardText">' + cardTextHtml + '</div></div></div></div>')
            .addClass("card")
            .addClass(removeAccents(element.Couleur)));
        if (element.Voix !== undefined && element.Voix.length > 0) {
          $('#card' + cardId).append($('<div>').text(element.Voix).addClass("circle").addClass("vote"));
        }
        if (element.Force !== undefined && element.Force.length > 0) {
          $('#card' + cardId).append($('<div>').text(element.Force).addClass("circle").addClass("forceValue"));
        }
        if (element.Cout !== undefined && element.Cout.length > 0) {
          $('#card' + cardId).append($('<div>').text(element.Cout).addClass("circle").addClass("cost"));
        }

      });
  },
  renderBills: function (bills) {
    bills
      .filter(element => element.Quantite !== undefined && element.Quantite > 0)
      .forEach(element => {
        for (i = 0; i < element.Quantite; i++) {
          $('#bills').append(
            $('<li id="bill' + element.Nom + i + '">')
              .html('<div class="bill"><img src="svg/' + element.Image + '" class="billImage"></div>')
              .addClass("bill"));            
        } 
      });
  }
};

var processCSVCards = function (csvContents) {
  var csvData = Papa.parse(csvContents, { header: true });
  scope.addCards(csvData.data);
}

var processCSVBills = function (csvContents) {
  var csvData = Papa.parse(csvContents, { header: true });
  scope.addBills(csvData.data);
}


$.ajax({
  type: "GET",
  url: "anciennes_cartes.csv",
  dataType: "text",
  success: processCSVCards
})


$.ajax({
  type: "GET",
  url: "nouvelles_cartes.csv",
  dataType: "text",
  success: processCSVCards
})

