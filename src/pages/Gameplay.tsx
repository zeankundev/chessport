import React from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Move } from 'chess.ts';
import ActionButton from '../components/ActionButton';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import OnFlexButton from '../components/OnFlexButton';

enum WinningType {
  Checkmate,
  Draw,
  NoLegalMoves,
  Neither
}

interface GameState {
  game: Chess;
  boardSize: number;
  isReversed: boolean;
  isComputingMove: boolean;
  isInvalidLog: boolean;
  winStatus: WinningType;
  moveLog: string[],
  lastRecentMove: string
}

class Gameplay extends React.Component<{}, GameState> {
  openings = [
    {
      name: "King's Pawn Opening",
      moveCue: ['e4'],
      variants: [
        {
          name: "Wayward Queen Attack",
          moveCue: ['e5', 'Qh5']
        }
      ]
    },
    {
      name: "Spanish Opening",
      moveCue: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5']
    }
  ]
  private timeoutId: NodeJS.Timeout | null = null;
  private historyIntervalId: NodeJS.Timeout | null = null;
  private previousHistory: string[] = [];

  constructor(props: {}) {
    super(props);
    this.state = {
      game: new Chess(),
      boardSize: this.calculateBoardSize(),
      isReversed: false,
      isInvalidLog: false,
      isComputingMove: false,
      winStatus: WinningType.Neither,
      moveLog: [],
      lastRecentMove : ''
    };

    this.handleResize = this.handleResize.bind(this);
    this.safeGameMutate = this.safeGameMutate.bind(this);
    this.makeComputerMove = this.makeComputerMove.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.handleToggleOrientation = this.handleToggleOrientation.bind(this);
    this.updateMoveLog = this.updateMoveLog.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.makeComputerMoveIfNeeded();
    this.historyIntervalId = setInterval(() => {
      this.updateMoveLog();
    }, 250); 
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.clearTimeout();
    this.setState({
      moveLog: []
    })
  }

  componentDidUpdate(prevProps: {}, prevState: GameState) {
    if (prevState.game.turn() !== this.state.game.turn()) {
      this.makeComputerMoveIfNeeded();
    }
  }

  updateMoveLog() {
    const currentHistory = this.state.game.history();
  
    if (currentHistory.length > 0) {
      if (JSON.stringify(currentHistory) !== JSON.stringify(this.previousHistory)) {
        this.setState((prevState) => ({
          moveLog: [...prevState.moveLog, currentHistory[0]],
          lastRecentMove: currentHistory[0]
        }));
        this.previousHistory = currentHistory;
      }
    }
  }
  

  handleResize() {
    this.setState({
      boardSize: this.calculateBoardSize(),
    });
  }

  calculateBoardSize() {
    const padding = 0.1; // 10% padding
    return Math.min(window.innerHeight, window.innerWidth) * (1 - 2 * padding);
  }

  safeGameMutate(modify: (game: Chess) => void) {
    this.setState((prevState) => {
      const update = new Chess(prevState.game.fen());
      modify(update);
      return { game: update };
    });
  }

  makeComputerMoveIfNeeded() {
    const { game, isReversed } = this.state;
    if (game.turn() === (isReversed ? 'w' : 'b')) {
      // Make computer move if it's the computer's turn
      this.setState({ isComputingMove: true }, () => {
        this.makeComputerMove();
      });
    }
  }
  convertAndSaveToPGNFile = (moves: string[]) => {
    const convertToPGN = (moves: string[]): string => {
      const pgnHeader = `
      [Event "ChessportGameplay"]
      [Site "?"]
      [Round "1"]
      [White "User"]
      [Black "Robot"]
      [Result "1-0"]
      `;
  
      const pgnMoves = moves.map((move, index) => `${index / 2 + 1}. ${move}`).join(' ');
  
      return pgnHeader + pgnMoves.trim();
    };
  
    const pgn = convertToPGN(moves);
  
    // Create Blob and download link
    const blob = new Blob([pgn], { type: 'text/plain' });
    const link = document.createElement('a');
  
    link.href = window.URL.createObjectURL(blob);
    link.download = 'game.pgn';
    link.click();
  
    // Cleanup
    window.URL.revokeObjectURL(link.href);
  };

  makeComputerMove() {
    const { game } = this.state;
    const possibleMoves = game.moves();

    if (game.inCheckmate()) this.setState({winStatus: WinningType.Checkmate});

    // Simulate a short delay before making the computer move
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);

      this.safeGameMutate((game) => {
        game.move(possibleMoves[randomIndex]);
      });

      this.clearTimeout();
      this.setState({ isComputingMove: false });
    }, Math.random() * (3000 - 500) + 500); // Adjust the duration of the timeout (in milliseconds) as needed
  }

  clearTimeout() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  onDrop(sourceSquare: string, targetSquare: string) {
    let move: Move | null = null;

    this.safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });
    });

    if (move === null) return false;

    // Make computer move immediately after the user's move
    this.makeComputerMove();
    this.setState({isInvalidLog: false})

    return true;
  }

  handleToggleOrientation() {
    this.setState((prevState) => ({
      isReversed: !prevState.isReversed,
    }));
  }

  render() {
    const { game, boardSize, isReversed, isComputingMove, winStatus } = this.state;

    return (
      <div className='gameplay-container'>
        <div className='gameplay-area'>
          <Chessboard
            position={game.fen()}
            onPieceDrop={this.onDrop}
            boardWidth={boardSize}
            boardOrientation={isReversed ? 'black' : 'white'}
          />
        </div>
        <div className='control-pane'>
          {isComputingMove ? <div className="thinking"><Loader /> &nbsp;<b>Computer is thinking...</b></div> : <div className='thinking'><b>&nbsp;&nbsp;Waiting for your move...&nbsp;&nbsp;</b></div>}
          {winStatus === WinningType.Checkmate && (
            <Modal onClose={() => this.setState({ winStatus: WinningType.Neither, isComputingMove: false })} title='You Win!'>
              You won by Checkmate!
            </Modal>
          )}
          {winStatus === WinningType.Draw && (
            <Modal onClose={() => this.setState({ winStatus: WinningType.Neither, isComputingMove: false })} title="No one's winning today">
              You and your opponent had a good time, and you both <br></br> have equal strength.
            </Modal>
          )}
          {winStatus === WinningType.NoLegalMoves && (
            <Modal onClose={() => this.setState({ winStatus: WinningType.Neither, isComputingMove: false })} title="No legal moves">
              Looks like you don't have any option. Well, stick on what it is!
            </Modal>
          )}
          <div className='move-log'>
            {this.state.moveLog.map((move, index) => (
              <div className='component-move' key={index}><div className='move-counter'>{Math.floor(index / 2) + 1}</div>{move}</div>
            ))}
            {this.state.isInvalidLog === true && (
              <Modal title='Failed to save'>You have nothing to move!</Modal>
            )}
          </div>
          <div className='move-log' style={{height: 'min-content', textAlign: 'center', backgroundColor: 'var(--tertiary-color)'}}>
            <b style={{marginBottom: '15px'}}>Most Recent Move</b>
            <div className='component-move'><div className='move-counter'>R</div>{this.state.lastRecentMove}</div>
          </div>
          <OnFlexButton 
            action={() => {
              if (this.state.moveLog.length != 0) {
                this.convertAndSaveToPGNFile(this.state.moveLog)
              } else {
                this.setState({isInvalidLog: true})
              }
            }} 
            icon='download'>
            Export as PGN
          </OnFlexButton>
        </div>
      </div>
    );
  }
}

export default Gameplay;
