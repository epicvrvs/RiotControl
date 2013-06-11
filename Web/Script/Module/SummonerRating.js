function getRatingTable(region, summoner, statistics) 
{
    var ratings = statistics.Ratings;
    var columnTitles = 
    [
        'Map',
        'Mode',
        'Games',
        'W',
        'L',
        'W - L',
        'WR',
        'Left',
        'Rating',
        'Top rating',
    ];
    var output = table();
    output.id = 'ratingTable';
    var tableCaption = caption('General Statistics');
    tableCaption.className = 'profile';
    output.add(tableCaption);
    output.add(getTableHeadRow(columnTitles));
    var rowCount = 0;
    ratings.forEach(function(rating) {
        var gamesPlayed = rating.Wins + rating.Losses;
        if (gamesPlayed == 0)
            return;
        var map;
        if (rating.Map == 1 && rating.GameMode == 2) 
        {
            map = "Summoner's Rift/Twisted Treeline";
        } 
        else
            map = getMapString(rating.Map);
        var mapLink = anchor(map, function() {
            system.graphHandler.open(region, summoner.AccountId, rating.Map, rating.GameMode);
        });
        var fields = 
        [
            [mapLink, false], 
            [getGameModeString(rating.GameMode), false], 
            [gamesPlayed, true], 
            [rating.Wins, true]
        ];

        for(var i = 0; i < 3; i++)
            fields.push(['-', true]);
        
        fields = fields.concat([
            [rating.Leaves, true],
            [getCurrentRating(rating), true],
            [getTopRating(rating), true],
        ]);
        var row = tableRow();
        fields.forEach(function(field) {
            var content = field[0];
            var isNumeric = field[1];
            var cell = tableCell(content);
            if (isNumeric)
                cell.className = 'numeric';
            row.add(cell);
        });
        output.add(row);
        rowCount++;
    });
    if (rowCount > 0)
        return output;
    else
        return '';
}
