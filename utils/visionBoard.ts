import AsyncStorage from "@react-native-async-storage/async-storage";

const VISION_BOARD_KEY = "@yo_twin_vision_boards";
const CURRENT_VISION_BOARD_KEY = "@yo_twin_current_vision_board";

export interface VisionBoard {
  id: string;
  imageUri: string;
  createdAt: string; // ISO date string
  completedSessions: number; // Number of sessions completed for this board
  totalSessions: number; // Total sessions needed to fully color (e.g., 7 for a week)
  isCompleted: boolean;
  weekStartDate: string; // ISO date string for the week this board belongs to
}

/**
 * Get all vision boards from storage
 */
export async function getAllVisionBoards(): Promise<VisionBoard[]> {
  try {
    const boardsJson = await AsyncStorage.getItem(VISION_BOARD_KEY);
    if (!boardsJson) {
      return [];
    }
    return JSON.parse(boardsJson);
  } catch (error) {
    return [];
  }
}

/**
 * Save a vision board
 */
export async function saveVisionBoard(board: VisionBoard): Promise<void> {
  try {
    const boards = await getAllVisionBoards();
    const existingIndex = boards.findIndex((b) => b.id === board.id);
    
    if (existingIndex >= 0) {
      boards[existingIndex] = board;
    } else {
      boards.push(board);
    }
    
    await AsyncStorage.setItem(VISION_BOARD_KEY, JSON.stringify(boards));
  } catch (error) {
    throw error;
  }
}

/**
 * Get the current active vision board
 */
export async function getCurrentVisionBoard(): Promise<VisionBoard | null> {
  try {
    const boardJson = await AsyncStorage.getItem(CURRENT_VISION_BOARD_KEY);
    if (!boardJson) {
      return null;
    }
    return JSON.parse(boardJson);
  } catch (error) {
    return null;
  }
}

/**
 * Set the current active vision board
 */
export async function setCurrentVisionBoard(board: VisionBoard | null): Promise<void> {
  try {
    if (board) {
      await AsyncStorage.setItem(CURRENT_VISION_BOARD_KEY, JSON.stringify(board));
    } else {
      await AsyncStorage.removeItem(CURRENT_VISION_BOARD_KEY);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Increment completed sessions for current vision board
 * This is called when a session is completed
 */
export async function incrementVisionBoardProgress(): Promise<void> {
  try {
    const currentBoard = await getCurrentVisionBoard();
    if (!currentBoard) {
      return;
    }

    // Don't increment if already completed
    if (currentBoard.isCompleted) {
      return;
    }

    const newCompletedSessions = currentBoard.completedSessions + 1;
    const updatedBoard: VisionBoard = {
      ...currentBoard,
      completedSessions: newCompletedSessions,
      isCompleted: newCompletedSessions >= currentBoard.totalSessions,
    };

    await saveVisionBoard(updatedBoard);
    await setCurrentVisionBoard(updatedBoard);
  } catch (error) {
    // Error incrementing vision board progress
  }
}

/**
 * Calculate color progress percentage (0-100)
 */
export function getColorProgress(board: VisionBoard): number {
  return Math.min(100, (board.completedSessions / board.totalSessions) * 100);
}

