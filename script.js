// class Pair{constructor(first,second){this.first = first; this.second = second}}

// class GameDisplay{
	
// }
// class GameLogic{

// }
// class ComputerOpponent{
//     static SCORING_MAP =  new Map([
//         //Guaranteed win for computer immediately
//             ["OOOOO", 1000000000],
//         //Guaranteed win for player in 1 moves
//             ["XXXX_", -100000000],
//             ["XXX_X", -100000000],
//             ["XX_XX", -100000000],
//             ["X_XXX", -100000000],
//             ["_XXXX", -100000000],
//         //Guaranteed win for computer in 2 moves
//             ["_OOOO_",  20000000],
//         //Possible win for computer in 2 moves
//             ["OOO_O", 10000000],
//             ["OO_OO", 10000000],
//             ["O_OOO", 10000000],
//             ["_OOOO", 10000000],
//         //Possible win for player in 3 moves
//             ["_XXX__",-1000000],
//             ["__XXX_",-1000000],
//             ["_XX_X_",-1000000],
//             ["_X_XX_",-1000000],
//             ["_XXX_",-500000],
//         //Possible win for computer in 4 moves
//             ["_OOO__", 100000],
//             ["__OOO_", 100000],
//             ["_OO_O_", 100000],
//             ["_O_OO_", 100000],
//             ["_OOO_", 50000],
//         //Good moves for computer
//             ["__OO__", 1200],
//             ["_OO__", 1000],
//             ["__OO_", 1000],
//             ["XXO_", 500],
//             ["_OXX", 500],
//         //Barely disatvantageous situations for computer
//             ["__XX_", -1100],
//             ["_XX__", -1100],
//             ["OXO", -100],
//         //Don't go in random places
//             ["OX", 1],
//             ["XO", 1]
//     ]);

//     constructor(logic){
//         this.logic = logic;
//     }
// }