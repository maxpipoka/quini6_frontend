// Visual test matrix - exports component states and viewports for visual regression tests
// This file is imported by visual.spec.ts and used to generate the 46 test cases

export interface Viewport {
  name: string;
  width: number;
  height: number;
}

export interface ComponentState {
  name: string;
  states: string[];
}

export const viewports: Viewport[] = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'mobile', width: 375, height: 667 },
];

export const components: ComponentState[] = [
  { name: 'FileDropzone', states: ['default', 'hover', 'focus', 'error', 'loading', 'disabled'] },
  { name: 'ImportPreviewTable', states: ['default', 'empty', 'error', 'loading'] },
  { name: 'ImportHistoryTable', states: ['default', 'empty', 'loading', 'pagination'] },
  { name: 'ImportProgress', states: ['default', 'inProgress', 'success', 'error'] },
  { name: 'Progress', states: ['default', 'partial', 'complete', 'indeterminate', 'error'] },
];

// Total test cases: (6 + 4 + 4 + 4 + 5) * 2 = 23 * 2 = 46
export const totalTestCases =
  components.reduce((sum, c) => sum + c.states.length, 0) * viewports.length;
