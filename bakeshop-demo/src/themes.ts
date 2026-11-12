import type { Theme } from '@pinkpixel/marzipan'

// Custom theme presets, carried over from the old Themes page.
// Each one is a full palette passed as Marzipan's `theme` option.

export interface ThemeChoice {
  id: string
  label: string
  /** A built-in theme name, or a full custom theme */
  theme: string | Theme
  /** The demo shell follows the editor: light or dark */
  tone: 'light' | 'dark'
}

const purpleDream: Theme = {
  name: 'purple-dream',
  colors: {
    bgPrimary: '#1e1130',
    bgSecondary: '#2d1b69',
    text: '#e1d5f7',
    h1: '#c084fc',
    h2: '#a78bfa',
    h3: '#818cf8',
    strong: '#f0abfc',
    em: '#c084fc',
    link: '#a78bfa',
    code: '#e1d5f7',
    codeBg: '#3b2a6e',
    blockquote: '#c084fc',
    hr: '#4d3d79',
    syntaxMarker: 'rgba(167, 139, 250, 0.5)',
    listMarker: '#a78bfa',
    cursor: '#ec4899',
    selection: 'rgba(139, 92, 246, 0.3)',
    toolbarBg: '#2d1b69',
    toolbarBorder: 'rgba(167, 139, 250, 0.2)',
    toolbarIcon: '#c4b5fd',
    toolbarHover: '#3d2880',
    toolbarActive: '#4c3494',
  }
}

const oceanDeep: Theme = {
      name: 'ocean-deep',
      colors: {
        bgPrimary: '#0a1628',
        bgSecondary: '#0d2137',
        text: '#a8d8ea',
        h1: '#7ecfde',
        h2: '#5bbdd1',
        h3: '#3daac4',
        strong: '#f0c57e',
        em: '#7ecfde',
        link: '#7ecfde',
        code: '#a8d8ea',
        codeBg: '#071020',
        blockquote: '#5bbdd1',
        hr: '#1a3550',
        syntaxMarker: 'rgba(94, 189, 209, 0.5)',
        listMarker: '#f0c57e',
        cursor: '#f0c57e',
        selection: 'rgba(94, 189, 209, 0.25)',
        toolbarBg: '#0d2137',
        toolbarBorder: 'rgba(94, 189, 209, 0.15)',
        toolbarIcon: '#a8d8ea',
        toolbarHover: '#122840',
        toolbarActive: '#173354',
      }
    }

const forestMist: Theme = {
      name: 'forest-mist',
      colors: {
        bgPrimary: '#0d1f0d',
        bgSecondary: '#162316',
        text: '#c8e6c9',
        h1: '#81c784',
        h2: '#a5d6a7',
        h3: '#c8e6c9',
        strong: '#ffcc80',
        em: '#80cbc4',
        link: '#80cbc4',
        code: '#c8e6c9',
        codeBg: '#071407',
        blockquote: '#80cbc4',
        hr: '#2a3d2a',
        syntaxMarker: 'rgba(129, 199, 132, 0.5)',
        listMarker: '#ffcc80',
        cursor: '#ff8a65',
        selection: 'rgba(129, 199, 132, 0.25)',
        toolbarBg: '#162316',
        toolbarBorder: 'rgba(129, 199, 132, 0.15)',
        toolbarIcon: '#c8e6c9',
        toolbarHover: '#1e2e1e',
        toolbarActive: '#243824',
      }
    }

export const THEMES: ThemeChoice[] = [
  { id: 'cave', label: 'Cave', theme: 'cave', tone: 'dark' },
  { id: 'solar', label: 'Solar', theme: 'solar', tone: 'light' },
  { id: 'purple', label: 'Purple Dream', theme: purpleDream, tone: 'dark' },
  { id: 'ocean', label: 'Ocean Deep', theme: oceanDeep, tone: 'dark' },
  { id: 'forest', label: 'Forest Mist', theme: forestMist, tone: 'dark' },
]
