import { useState } from 'react';
import Board from './Board';
import TurnDisplay from './TurnDisplay';
import CapturedPiecesComponent from './CapturedPieces';
import PromotionDialog from './PromotionDialog';
import { INITIAL_POSITION } from '../data/initialPosition';
import type { Position } from '../types/position';
import type { Piece, PieceType } from '../types/piece';
import type { Turn } from '../types/turn';
import type { CapturedPieces } from '../types/capturedPieces';
import type { Selection, PromotionState } from '../types/selection';
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

/**
 * 将棋盤と駒を統合して表示するコンポーネント
 */
const ShogiBoard = () => {
  // 盤面の状態管理
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_POSITION);
  // 選択中の駒の状態（盤面上 or 持ち駒）
  const [selection, setSelection] = useState<Selection | null>(null);
  // 現在のターン
  const [currentTurn, setCurrentTurn] = useState<Turn>('sente');
  // 持ち駒の状態管理
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

  // Board コンポーネント用に Position | null に変換
  const selectedPosition = selection && isBoardSelection(selection) ? selection.position : null;

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
      if (!clickedPiece && canDropPiece(pieces, position)) {
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

        // 選択解除
        setSelection(null);

        // 手番を切り替える
        setCurrentTurn(switchTurn(currentTurn));
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
            setSelection(null);
            setCurrentTurn(switchTurn(currentTurn));
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
            setSelection(null);
            // T020: 駒移動成功後にターンを切り替える
            setCurrentTurn(switchTurn(currentTurn));
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
    setPromotionState(null);
    setPendingState(null);
    setCurrentTurn(switchTurn(currentTurn));
  };

  /**
   * 成らないを選択した時のハンドラー
   */
  const handleDeclinePromotion = () => {
    if (!pendingState) return;

    // 成らずに移動完了
    setPieces(pendingState.pieces);
    setCapturedPieces(pendingState.capturedPieces);
    setPromotionState(null);
    setPendingState(null);
    setCurrentTurn(switchTurn(currentTurn));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full p-4">
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

      <div className="flex justify-center items-center flex-1 w-full relative">
        <div className="relative" style={{ width: 'min(70vmin, 100%)', aspectRatio: '1 / 1' }}>
          <Board
            pieces={pieces}
            selected={selectedPosition}
            onSquareClick={handleSquareClick}
            currentTurn={currentTurn}
            capturedPieces={capturedPieces}
            onInvalidSelection={handleInvalidSelection}
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
    </div>
  );
};

export default ShogiBoard;
