import { useState, useEffect, useMemo } from 'react';
import Board from './Board';
import TurnDisplay from './TurnDisplay';
import CapturedPiecesComponent from './CapturedPieces';
import PromotionDialog from './PromotionDialog';
import { NavigationControls } from './NavigationControls';
import { INITIAL_POSITION } from '../data/initialPosition';
import type { Position } from '../types/position';
import type { Piece, PieceType } from '../types/piece';
import type { Turn } from '../types/turn';
import type { CapturedPieces } from '../types/capturedPieces';
import type { Selection, PromotionState } from '../types/selection';
import type { GameHistory } from '../types/history';
import { isBoardSelection, isCapturedSelection } from '../types/selection';
import { isValidMove } from '../logic/moveRules';
import { updateBoardAfterMove } from '../logic/boardState';
import { switchTurn } from '../logic/turnControl';
import { createEmptyCapturedPieces } from '../types/capturedPieces';
import {
  getTargetPiece,
  addToCapturedPieces,
  removePieceFromBoard,
  removeFromCapturedPieces,
} from '../logic/captureLogic';
import { canDropPiece, dropPiece } from '../logic/dropLogic';
import { canPromoteMove, mustPromote, isPromotablePieceType } from '../logic/promotionLogic';
import {
  addMove,
  goToPrevious,
  goToNext,
  goToFirst,
  goToLast,
  getCurrentEntry,
  getNavigationState,
} from '../logic/historyManager';
import { saveGameState, loadGameState } from '../logic/persistenceManager';
import { getValidPawnDropSquares } from '../logic/doublePawnValidation';

/**
 * 将棋盤と駒を統合して表示するコンポーネント
 */
const ShogiBoard = () => {
  // T021: 履歴の初期状態（初期配置を記録）
  const [history, setHistory] = useState<GameHistory>({
    entries: [
      {
        pieces: INITIAL_POSITION,
        capturedPieces: createEmptyCapturedPieces(),
        currentTurn: 'sente',
        moveNumber: 0,
      },
    ],
    currentIndex: 0,
  });

  // 盤面の状態管理（履歴から復元）
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_POSITION);
  // 選択中の駒の状態（盤面上 or 持ち駒）
  const [selection, setSelection] = useState<Selection | null>(null);
  // 現在のターン（履歴から復元）
  const [currentTurn, setCurrentTurn] = useState<Turn>('sente');
  // 持ち駒の状態管理（履歴から復元）
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>(createEmptyCapturedPieces());
  // T032: 無効操作時のisHighlightedフラグ管理
  const [isHighlighted, setIsHighlighted] = useState(false);
  // 成り選択の状態管理
  const [promotionState, setPromotionState] = useState<PromotionState>(null);
  // 成り選択時の一時的な盤面・持ち駒状態
  const [pendingState, setPendingState] = useState<{
    pieces: Piece[];
    capturedPieces: CapturedPieces;
  } | null>(null);
  // T018: エラーメッセージの状態管理
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Board コンポーネント用に Position | null に変換
  const selectedPosition = selection && isBoardSelection(selection) ? selection.position : null;

  // T025: 打てる候補マスを計算（useMemoで最適化）
  const validDropSquares = useMemo(() => {
    if (!selection || !isCapturedSelection(selection)) {
      return [];
    }

    // 歩を選択している場合のみ、二歩を考慮した候補マスを計算
    if (selection.pieceType === '歩') {
      return getValidPawnDropSquares(pieces, selection.player);
    }

    // 歩以外の駒の場合は、全ての空きマスを候補として返す
    const emptySquares: Position[] = [];
    for (let file = 1; file <= 9; file++) {
      for (let rank = 1; rank <= 9; rank++) {
        const position = { file, rank };
        const isOccupied = pieces.some(
          (piece) => piece.file === position.file && piece.rank === position.rank
        );
        if (!isOccupied) {
          emptySquares.push(position);
        }
      }
    }
    return emptySquares;
  }, [selection, pieces]);

  /**
   * 初回マウント時に保存された状態を復元
   *
   * ブラウザを閉じて再度開いた際に、前回のセッションで
   * 保存されていた盤面、持ち駒、手番、履歴を復元します。
   * データがない場合は何もせず、初期配置のまま開始します。
   */
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      // 保存された状態を復元
      setPieces(savedState.pieces);
      setCapturedPieces(savedState.capturedPieces);
      setCurrentTurn(savedState.currentTurn);
      setHistory({
        entries: savedState.history,
        currentIndex: savedState.currentIndex,
      });
    }
    // 依存配列が空 = マウント時のみ実行
  }, []);

  /**
   * 状態変更時に自動保存
   *
   * 駒を動かす、持ち駒を打つ、履歴をナビゲートするなど、
   * ゲーム状態が変化するたびに自動的にlocalStorageに保存します。
   * ユーザーは保存操作を意識する必要はありません。
   */
  useEffect(() => {
    // 初回マウント時の保存をスキップ（historyが初期状態の場合）
    if (history.entries.length === 1 && history.currentIndex === 0) {
      // 初期配置のままで、まだ手が進んでいない場合は保存しない
      return;
    }

    // ゲーム状態を保存
    saveGameState({
      pieces,
      capturedPieces,
      currentTurn,
      history: history.entries,
      currentIndex: history.currentIndex,
    });
  }, [pieces, capturedPieces, currentTurn, history]);

  /**
   * T024: 履歴から盤面を復元するヘルパー関数
   */
  const restoreFromHistory = (newHistory: GameHistory) => {
    const currentEntry = getCurrentEntry(newHistory);
    setPieces(currentEntry.pieces);
    setCapturedPieces(currentEntry.capturedPieces);
    setCurrentTurn(currentEntry.currentTurn);
    setHistory(newHistory);
    setSelection(null); // 選択状態もクリア
  };

  /**
   * T023: 一手戻るハンドラー
   */
  const handleGoBack = () => {
    const newHistory = goToPrevious(history);
    restoreFromHistory(newHistory);
  };

  /**
   * 一手進むハンドラー
   */
  const handleGoForward = () => {
    const newHistory = goToNext(history);
    restoreFromHistory(newHistory);
  };

  /**
   * 初手に戻るハンドラー
   */
  const handleGoFirst = () => {
    const newHistory = goToFirst(history);
    restoreFromHistory(newHistory);
  };

  /**
   * 最終手に進むハンドラー
   */
  const handleGoLast = () => {
    const newHistory = goToLast(history);
    restoreFromHistory(newHistory);
  };

  /**
   * 持ち駒がクリックされた時のハンドラー
   */
  const handleCapturedPieceClick = (pieceType: PieceType, player: 'sente' | 'gote') => {
    // 自分の手番でのみ選択可能
    if (player !== currentTurn) {
      return;
    }

    // 同じ持ち駒を再クリックした場合は選択解除
    if (
      selection &&
      isCapturedSelection(selection) &&
      selection.pieceType === pieceType &&
      selection.player === player
    ) {
      setSelection(null);
      return;
    }

    // 持ち駒を選択
    setSelection({
      type: 'captured',
      pieceType,
      player,
    });
  };

  /**
   * マス目がクリックされた時のハンドラー
   */
  const handleSquareClick = (position: Position) => {
    // クリックされた位置に駒があるか確認
    const clickedPiece = pieces.find((p) => p.file === position.file && p.rank === position.rank);

    // 持ち駒を選択中の場合
    if (selection && isCapturedSelection(selection)) {
      // 空きマスをクリックした場合は駒を打つ
      if (!clickedPiece && canDropPiece(pieces, position, selection.pieceType, selection.player)) {
        // 持ち駒を盤面に打つ
        const newPieces = dropPiece(pieces, position, selection.pieceType, selection.player);
        setPieces(newPieces);

        // 持ち駒を減らす
        const newCapturedPieces = removeFromCapturedPieces(
          capturedPieces,
          selection.player,
          selection.pieceType
        );
        setCapturedPieces(newCapturedPieces);

        // 手番を切り替える
        const newTurn = switchTurn(currentTurn);
        setCurrentTurn(newTurn);

        // 履歴に追加
        const newHistory = addMove(history, {
          pieces: newPieces,
          capturedPieces: newCapturedPieces,
          currentTurn: newTurn,
          moveNumber: history.currentIndex + 1,
        });
        setHistory(newHistory);

        // 選択解除
        setSelection(null);
        // エラーメッセージをクリア
        setErrorMessage(null);
        return;
      }

      // T020: 駒を打てない場合はエラーメッセージを表示
      if (!clickedPiece && !canDropPiece(pieces, position, selection.pieceType, selection.player)) {
        setErrorMessage('二歩は反則です');
        return;
      }

      // 自分の駒をクリックした場合は盤面上の駒を選択状態に切り替え
      if (clickedPiece && clickedPiece.player === currentTurn) {
        setSelection({
          type: 'board',
          position,
          player: clickedPiece.player,
        });
        return;
      }

      // 相手の駒をクリックした場合は何もしない
      return;
    }

    // 盤面上の駒を選択中の場合 or 何も選択していない場合
    if (clickedPiece && clickedPiece.player === currentTurn) {
      // 自分の駒がある場合
      if (
        selection &&
        isBoardSelection(selection) &&
        selection.position.file === position.file &&
        selection.position.rank === position.rank
      ) {
        // 同じ駒をクリック → 選択解除
        setSelection(null);
      } else {
        // 別の自分の駒をクリック → 選択を切り替え
        setSelection({
          type: 'board',
          position,
          player: clickedPiece.player,
        });
      }
    } else {
      // 駒がない場合、または相手の駒がある場合
      if (selection && isBoardSelection(selection)) {
        // T022: 選択中の駒を移動 (ルール検証あり)
        const selectedPiece = pieces.find(
          (p) => p.file === selection.position.file && p.rank === selection.position.rank
        );

        if (selectedPiece && isValidMove(selection.position, position, selectedPiece, pieces)) {
          // 駒の捕獲チェック
          const targetPiece = getTargetPiece(pieces, position, selectedPiece.player);

          let updatedPieces = pieces;
          let updatedCapturedPieces = capturedPieces;

          // 相手の駒がある場合は捕獲処理
          if (targetPiece) {
            // 持ち駒に追加（成り駒は元の駒種に戻す）
            updatedCapturedPieces = addToCapturedPieces(
              capturedPieces,
              targetPiece,
              selectedPiece.player
            );
            // 盤面から駒を削除
            updatedPieces = removePieceFromBoard(pieces, targetPiece);
          }

          // T029: updateBoardAfterMoveを使用してイミュータブルに更新
          const movedPieces = updateBoardAfterMove(updatedPieces, selection.position, position);

          // 成り判定
          const canPromote =
            isPromotablePieceType(selectedPiece.type) &&
            !selectedPiece.promoted &&
            canPromoteMove(selectedPiece, selection.position, position);

          const forcePromote = mustPromote(selectedPiece, position.rank);

          if (forcePromote) {
            // 強制成り: 自動的に成りを適用
            const promotedPieces = movedPieces.map((p) =>
              p.file === position.file && p.rank === position.rank ? { ...p, promoted: true } : p
            );
            setPieces(promotedPieces);
            setCapturedPieces(updatedCapturedPieces);

            // 手番を切り替える
            const newTurn = switchTurn(currentTurn);
            setCurrentTurn(newTurn);

            // 履歴に追加
            const newHistory = addMove(history, {
              pieces: promotedPieces,
              capturedPieces: updatedCapturedPieces,
              currentTurn: newTurn,
              moveNumber: history.currentIndex + 1,
            });
            setHistory(newHistory);

            setSelection(null);
          } else if (canPromote) {
            // 成り選択が必要: 成り選択ダイアログを表示
            setPendingState({ pieces: movedPieces, capturedPieces: updatedCapturedPieces });
            setPromotionState({
              piece: selectedPiece,
              from: selection.position,
              to: position,
            });
            setSelection(null);
          } else {
            // 成りなし: 通常の移動
            setPieces(movedPieces);
            setCapturedPieces(updatedCapturedPieces);

            // T020: 駒移動成功後にターンを切り替える
            const newTurn = switchTurn(currentTurn);
            setCurrentTurn(newTurn);

            // 履歴に追加
            const newHistory = addMove(history, {
              pieces: movedPieces,
              capturedPieces: updatedCapturedPieces,
              currentTurn: newTurn,
              moveNumber: history.currentIndex + 1,
            });
            setHistory(newHistory);

            setSelection(null);
          }
        }
        // 移動不可能な場合は何もしない(選択状態を維持)
      }
    }
  };

  // T032: Board から無効操作の通知を受け取るコールバック
  const handleInvalidSelection = () => {
    setIsHighlighted(true);

    // フィードバックを短時間表示して自動的に消す
    setTimeout(() => {
      setIsHighlighted(false);
    }, 500);
  };

  /**
   * 成りを選択した時のハンドラー
   */
  const handlePromote = () => {
    if (!promotionState || !pendingState) return;

    // 移動先の駒を成り駒に変更
    const promotedPieces = pendingState.pieces.map((p) =>
      p.file === promotionState.to.file && p.rank === promotionState.to.rank
        ? { ...p, promoted: true }
        : p
    );

    setPieces(promotedPieces);
    setCapturedPieces(pendingState.capturedPieces);

    // 手番を切り替える
    const newTurn = switchTurn(currentTurn);
    setCurrentTurn(newTurn);

    // 履歴に追加
    const newHistory = addMove(history, {
      pieces: promotedPieces,
      capturedPieces: pendingState.capturedPieces,
      currentTurn: newTurn,
      moveNumber: history.currentIndex + 1,
    });
    setHistory(newHistory);

    setPromotionState(null);
    setPendingState(null);
  };

  /**
   * 成らないを選択した時のハンドラー
   */
  const handleDeclinePromotion = () => {
    if (!pendingState) return;

    // 成らずに移動完了
    setPieces(pendingState.pieces);
    setCapturedPieces(pendingState.capturedPieces);

    // 手番を切り替える
    const newTurn = switchTurn(currentTurn);
    setCurrentTurn(newTurn);

    // 履歴に追加
    const newHistory = addMove(history, {
      pieces: pendingState.pieces,
      capturedPieces: pendingState.capturedPieces,
      currentTurn: newTurn,
      moveNumber: history.currentIndex + 1,
    });
    setHistory(newHistory);

    setPromotionState(null);
    setPendingState(null);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full h-full p-4">
      {/* T019: エラーメッセージ表示 */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center justify-between max-w-md">
          <span className="block sm:inline">{errorMessage}</span>
          <button
            className="ml-4 font-bold text-red-700 hover:text-red-900"
            onClick={() => setErrorMessage(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* 後手の持ち駒を盤面上部に配置 */}
      <CapturedPiecesComponent
        capturedPieces={capturedPieces.gote}
        player="gote"
        onPieceClick={(pieceType) => handleCapturedPieceClick(pieceType, 'gote')}
        selectedPieceType={
          selection && isCapturedSelection(selection) && selection.player === 'gote'
            ? selection.pieceType
            : undefined
        }
        isSelectable={currentTurn === 'gote'}
      />

      {/* T031: ターン表示を盤面上部に配置 */}
      <TurnDisplay currentTurn={currentTurn} isHighlighted={isHighlighted} />

      <div className="flex justify-center items-center w-full relative">
        <div className="relative" style={{ width: 'min(70vmin, 100%)', aspectRatio: '1 / 1' }}>
          <Board
            pieces={pieces}
            selected={selectedPosition}
            onSquareClick={handleSquareClick}
            currentTurn={currentTurn}
            capturedPieces={capturedPieces}
            onInvalidSelection={handleInvalidSelection}
            validDropSquares={validDropSquares}
          />
          {/* 成り選択ダイアログ */}
          {promotionState && (
            <PromotionDialog
              position={promotionState.to}
              onPromote={handlePromote}
              onDecline={handleDeclinePromotion}
            />
          )}
        </div>
      </div>

      {/* 先手の持ち駒を盤面下部に配置 */}
      <CapturedPiecesComponent
        capturedPieces={capturedPieces.sente}
        player="sente"
        onPieceClick={(pieceType) => handleCapturedPieceClick(pieceType, 'sente')}
        selectedPieceType={
          selection && isCapturedSelection(selection) && selection.player === 'sente'
            ? selection.pieceType
            : undefined
        }
        isSelectable={currentTurn === 'sente'}
      />

      {/* T025: ナビゲーションコントロールを追加 */}
      <NavigationControls
        navigationState={getNavigationState(history)}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onGoFirst={handleGoFirst}
        onGoLast={handleGoLast}
      />
    </div>
  );
};

export default ShogiBoard;
