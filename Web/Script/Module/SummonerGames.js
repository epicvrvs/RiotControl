function getSummonerGamesTable(summoner, games)
{
    var titles =
        [
            ['Champion','champion'],
            ['Map','map'],
            ['Mode','mode'],
            ['Outcome','outcome'],
            ['Date','date'],
            ['Side','side'],
            ['Spells','spells'],
            ['K','kills'],
            ['D','deaths'],
            ['A','assissts'],
            ['MK','minionKills'],
            ['NK','neutralKills'],
            ['Gold','gold'],
            ['Items','items'],
            ['Lvl','level'],
            ['Premade','premade'],
            ['Ping','ping'],
            ['Queue Time','queueTime'],
            ['Game ID','gameID'],
        ];

    var container = diverse();
    container.id = 'summonerGamesContainer';

    var output = table();
    output.id = 'summonerGames';
    output.className = 'statistics';

    container.add(output);

    output.add(caption('Games of ' + summoner.SummonerName));

    var row = tableRow();
    titles.forEach(function(pair) {
        var title = pair[0];
        var className = pair[1];
        var head = tableHead(title);
        head.className = className;
        row.add(head);
    });
    output.add(row);
    games.forEach(function(game) {
        var championName = getChampionName(game.ChampionId);
        var championDescription = [icon('Champion/Small/' + championName + '.png', championName), championName];

        var items = [];
        game.Items.forEach(function(itemId) {
            if(itemId == 0) {
                var itemDiv = diverse();
                itemDiv.className = 'item';
                itemDiv.add(icon('Item/Small/Blank.png', 'Unused'));
                items.push(itemDiv);
            } else {

                var item = getItem(itemId);
                var itemDiv = diverse();
                itemDiv.className = 'item';
                var _icon = icon('Item/Small/' + (item.description == 'Unknown' ? 'Unknown' : itemId) + '.png', item.name);
                itemDiv.add(_icon);
                
                var theList = list();
                theList.className = 'itemDesc';
                theList.add(listElement(text(item.name)));
                theList.add(listElement(text('')));
                item.description.split('\n').forEach(function(line) {
                    theList.add(listElement(text(line)));
                });
                itemDiv.add(theList);
                items.push(itemDiv);
            }
        });

        var blue = span('Blue');
        blue.className = 'blue';

        var purple = span('Purple');
        purple.className = 'purple';

        var spellDescription = [game.SummonerSpell1, game.SummonerSpell2].map(function(id) {
            return icon('Spell/Small/' + id + '.png', getSummonerSpell(id));
        });

        var noValue = '-';

        var levelDescription;
        if(game.ChampionLevel == 18)
            levelDescription = bold(game.ChampionLevel);
        else
            levelDescription = game.ChampionLevel;

        var premadeString;
        if(game.GameMode == 4)
        {
            //Override this value for ranked teams because the data provided by the server is invalid
            game.PremadeSize = game.Map == 0 ? 3 : 5;
        }
        //Check if it's a custom game
        if(game.GameMode == 0)
            premadeString = noValue;
        else
            premadeString = game.PremadeSize > 1 ? 'Yes, ' + game.PremadeSize : 'No';

        var queueTimeString = game.TimeSpentInQueue > 0 ? game.TimeSpentInQueue + ' s' : noValue;

        var regularCell = 0;
        var numericCell = 1;
        var spellCell = 2;
        var itemCell = 3;

        var fields =
            [
                [championDescription, regularCell],
                [getMapString(game.Map), regularCell],
                [getGameModeString(game.GameMode), regularCell],
                [game.Won ? 'Win' : 'Loss', regularCell],
                [getTimestampString(game.GameTime), regularCell],
                [game.IsBlueTeam ? blue : purple, regularCell],
                [spellDescription, spellCell],
                [game.Kills, numericCell],
                [game.Deaths, numericCell],
                [game.Assists, numericCell],
                [game.MinionKills, numericCell],
                [game.NeutralMinionsKilled !== null ? game.NeutralMinionsKilled : noValue, numericCell],
                [game.Gold, numericCell],
                [items, itemCell],
                [levelDescription, numericCell],
                [premadeString, regularCell],
                [game.Ping + ' ms', numericCell],
                [queueTimeString, numericCell],
                [game.InternalGameId, numericCell],
            ];
        var row = tableRow();
        row.className = game.Won ? 'win' : 'loss';
        fields.forEach(function(field) {
            var contents = field[0];
            var cellType = field[1];
            var cell = tableCell(contents)
            switch(cellType)
            {
            case numericCell:
                cell.className = 'numeric';
                break;

            case spellCell:
                cell.className = 'spells';
                break;

            case itemCell:
                cell.className = 'items';
                break;
            }
            row.add(cell);
        });
        output.add(row);
    });
    return container;
}

function renderMatchHistory(summoner, games)
{
    setTitle('Games of ' + summoner.SummonerName);
    var linkContainer = paragraph(anchor('Return to profile', function () { system.summonerHandler.open(getRegion(summoner.Region).abbreviation, summoner.AccountId); } ));
    linkContainer.id = 'returnFromMatchHistory';
    var table = getSummonerGamesTable(summoner, games);
    renderWithoutTemplate(linkContainer, table);
}

function viewMatchHistory(region, accountId)
{
    apiGetSummonerProfile(region, accountId, function (response) { onGetSummonerProfileForMatchHistory(response, region); } );
}