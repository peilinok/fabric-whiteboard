import * as React from 'react'

declare type modes =
  | 'select'
  | 'pen'
  | 'line'
  | 'dotline'
  | 'arrow'
  | 'text'
  | 'rectangle'
  | 'triangle'
  | 'circle'
  | 'ellipse'
  | 'eraser'

export interface WhiteBoardProps {
  visible?: boolean
  className?: string
  width?: string | number
  height?: string | number
  showToolbar?: boolean
  enableToolbar?: boolean
  showBoard?: boolean
  enableBoard?: boolean
  mode: modes
  fontSize?: number
  brushColor?: string
  brushColors?: string[]
  brushThickness?: number
  brushThicknessRange?: number[]
  onModeClick?: (mode: string) => void
  onBrushColorChange?: (color: string) => void
  onBrushThicknessChange?: (thinkness: number) => void
  onObjectAdded?: (object: string) => void
  onObjectsModified?: (object: string) => void
  onObjectsRemoved?: (object: string) => void
  onSelectionCreated?: (object: string) => void
  onSelectionUpdated?: (object: string) => void
  onSelectionCleared?: (object: string) => void
}

export default class WhiteBoard extends React.Component<WhiteBoardProps, any> {}

/**
 * return whiteboard data in json
 * @param {object} ref
 */
export const getWhiteBoardData: (ref: any) => string

/**
 * load data with specified fabric canvas in ref
 * @param {object} ref
 * @param {string} data
 * @param {function} cb
 */
export const loadWhiteBoardData: (ref: any, data: string, cb: () => any) => void

/**
 * add objects defined in json to specified fabric canvas
 * @param {object} ref
 * @param {string} json
 */
export const addWhiteBoardObject: (ref: any, data: string) => void

/**
 * apply modify by specified selection or object,if specified a selection will auto add one
 * @param {object} ref
 * @param {string} json
 */
export const modifyWhiteBoardObjects: (
  ref: any,
  data: string,
  useAnimation: boolean = false
) => void

/**
 * remove objects by ids in specified fabric canvas in ref
 * @param {object} ref
 * @param {string} data
 */
export const removeWhiteBoardObjects: (ref: any, data: string) => void

/**
 * clear all context in specified fabric canvas in ref
 * @param {object} ref
 */
export const clearWhiteBoardContext: (ref: any) => void

/**
 * create selection
 * @param {object} ref
 * @param {string} selectionJson
 */
export const createWhiteBoardSelection: (
  ref: any,
  selectionJson: string
) => void

/**
 * update specified selection,include add and remove
 * @param {object} ref
 * @param {string} selectionJson
 */
export const updateWhiteBoardSelection: (
  ref: any,
  selectionJson: string
) => void

/**
 * clear selection
 * @param {object} ref
 * @param {string} selectionJson
 */
export const clearWhiteBoardSelection: (ref: any, selectionJson: string) => void
