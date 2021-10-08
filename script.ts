class Pair<T1,T2>{public first:T1; public second:T2; constructor(first:T1,second:T2){this.first = first; this.second = second}}

class GameDisplay{
	
}


enum BOARD_CELL{EMPTY,PLAYER,OPPONENT}
class GameLogic{
    private display:GameDisplay ;

    public static get BOARD_SIZE():number{return 13};

    private board:BOARD_CELL[][] = new Array(GameLogic.BOARD_SIZE).fill(0).map(i=>new Array(GameLogic.BOARD_SIZE).fill(BOARD_CELL.EMPTY));

    private final ComputerOpponent opponent;

    public GameLogic(GameDisplay disp){
        opponent = new ComputerOpponent(this);
        display = disp;
        resetBoard();
    }


    public void onKey(int keycode){
        if(keycode == KeyEvent.VK_R){
            resetBoard();
            display.repaint();
        }
    }

    public void click(int x, int y) {
        if(x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE || board[x][y] != BOARD_CELL.EMPTY) return;
        playerMove(x, y);
    }

    private void playerMove(int x, int y) {
        board[x][y] = BOARD_CELL.PLAYER;
        if(gameWon() == 1){
            display.alertWin();
            resetBoard();
        }
        display.repaint();
        opponentMove();
    }

    private void opponentMove(){
        opponent.move();
        if(gameWon() == 2){
            display.alertLose();
            resetBoard();
        }
        display.repaint();
    }

    private void resetBoard() {
        for(var i : board) java.util.Arrays.fill(i,BOARD_CELL.EMPTY);
    }

    public int gameWon(){
        return getRows().matches(".*XXXXX.*")
            || getCols().matches(".*XXXXX.*")
            || getDiagonals(false).matches(".*XXXXX.*")
            || getDiagonals(true ).matches(".*XXXXX.*")
        ? 1 :  getRows().matches(".*OOOOO.*")
            || getCols().matches(".*OOOOO.*")
            || getDiagonals(false).matches(".*OOOOO.*")
            || getDiagonals(true ).matches(".*OOOOO.*")
        ? 2: 0;
    }

    public BOARD_CELL getPieceAt(int x, int y){return board[x][y];}
    public boolean hasPieceAt(int x, int y){return board[x][y] != BOARD_CELL.EMPTY;}
    public void setPieceAt(ComputerOpponent o,int x, int y, BOARD_CELL val){if(o == opponent) board[x][y] = val;}
    public boolean isEmpty(){
        for(var i : board) for(var j : i) if(j !=  BOARD_CELL.EMPTY) return false;
        return true;
    }

    private static final Map<BOARD_CELL,Character> m = Util.toMap(new Object[][] {{BOARD_CELL.EMPTY,"_"},{BOARD_CELL.PLAYER,"X"},{BOARD_CELL.OPPONENT,"O"},});
	public String getDiagonals(boolean direction){
		StringBuilder res = new StringBuilder();
		int i,j,x,y,l = BOARD_SIZE;
		for (i = l - 1; i > 0; i--) {
			for (j = 0, x = i; x < l; j++, x++)
				res.append(m.get(board[direction ? l - x - 1 : x][j]));
			res.append('|');
		}
		for (i = 0; i < l; i++) {
			for (j = 0, y = i; y < l; j++, y++)
				res.append(m.get(board[direction ? l - j - 1 : j][y]));
			res.append('|');
		}
		return res.toString();
	}
	public String getRows(){
		var res = new StringBuilder();
		int i,j,l = BOARD_SIZE;
		for(i = 0; i < l; i++){
			for(j = 0; j < l; j++) res.append(m.get(board[i][j]));
			res.append('|');
		}
		return res.toString();
	}
	public String getCols(){
		var res = new StringBuilder();
		int i,j,l = BOARD_SIZE;
		for(i = 0; i < l; i++){
			for(j = 0; j < l; j++) res.append(m.get(board[j][i]));
			res.append('|');
		}
		return res.toString();
	}
}
class ComputerOpponent{
    private logic:GameLogic;

    static SCORING_MAP = new Map<RegExp,number>([
        //Guaranteed win for computer immediately
            [/OOOOO/, 1000000000],
        //Guaranteed win for player in 1 moves
            [/XXXX_/, -100000000],
            [/XXX_X/, -100000000],
            [/XX_XX/, -100000000],
            [/X_XXX/, -100000000],
            [/_XXXX/, -100000000],
        //Guaranteed win for computer in 2 moves
            [/_OOOO_/,  20000000],
        //Possible win for computer in 2 moves
            [/OOO_O/, 10000000],
            [/OO_OO/, 10000000],
            [/O_OOO/, 10000000],
            [/_OOOO/, 10000000],
        //Possible win for player in 3 moves
            [/_XXX__/,-1000000],
            [/__XXX_/,-1000000],
            [/_XX_X_/,-1000000],
            [/_X_XX_/,-1000000],
            [/_XXX_/,-500000],
        //Possible win for computer in 4 moves
            [/_OOO__/, 100000],
            [/__OOO_/, 100000],
            [/_OO_O_/, 100000],
            [/_O_OO_/, 100000],
            [/_OOO_/, 50000],
        //Good moves for computer
            [/__OO__/, 1200],
            [/_OO__/, 1000],
            [/__OO_/, 1000],
            [/XXO_/, 500],
            [/_OXX/, 500],
        //Barely disatvantageous situations for computer
            [/__XX_/, -1100],
            [/_XX__/, -1100],
            [/OXO/, -100],
        //Don't go in random places
            [/OX/, 1],
            [/XO/, 1]
    ]);
    
    constructor(logic:GameLogic){this.logic = logic}

    move():void{
        const l = GameLogic.BOARD_SIZE;

		//If board is empty, go in middle space
		if(this.logic.isEmpty()){
			this.logic.setPieceAt(this, l / 2, l / 2, GameLogic.BOARD_CELL.OPPONENT); return;
		}

		//Store best moves & score so far
		List<Util.Pair<Integer,Integer>> bestMoves = new ArrayList<>();
		int bestScore = Integer.MIN_VALUE;

		//For every empty space on the board
		for(int i = 0; i < l; i++) for(int j = 0; j < l; j++){
			if(logic.hasPieceAt(i, j)) continue;

			//Set the space to 2 for now
			logic.setPieceAt(this, i, j, GameLogic.BOARD_CELL.OPPONENT);

			//See how advantageous the board is
			int score = score();

			//If it is better than the current best board(s), set it to the new best board
			if(score > bestScore){
				bestMoves.clear();
				bestMoves.add(new Util.Pair<>(i, j));
				bestScore = score;
			}
			//Otherwise, if it's just as good as the best board(s), add it the set of best boards
			else if(score == bestScore) bestMoves.add(new Util.Pair<>(i, j));

			//Reset the space to 0
			logic.setPieceAt(this, i, j, GameLogic.BOARD_CELL.EMPTY);
		}

		//Find a random move out of the best moves
		var move = bestMoves.get((int)(Math.random() * bestMoves.size()));

		//Carry out the move
		logic.setPieceAt(this, move.first, move.second, GameLogic.BOARD_CELL.OPPONENT);
	}

	//Find out how advantageous a given board configuration is
    public int score(){
		int score = 0;
		//All rows/columns/diagonals of the board, converted to a string and joined with '|'s
		String s = logic.getRows() + logic.getCols() + logic.getDiagonals(true) + logic.getDiagonals(false);
		//For each regex
		for(Map.Entry<String,Integer> a: SCORING_MAP.entrySet()){
			//Count occurrences of each regex
			int count = 0;
			for(char c: s.replaceAll(a.getKey(), "!").toCharArray()) if(c == '!') count++;
			//Multiply by score per match
			score += count * a.getValue();
		}
		//Return total score
		return score;
    }
}