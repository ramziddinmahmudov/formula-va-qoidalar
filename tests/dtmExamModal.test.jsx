import { describe, it, expect } from 'vitest';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import DTMExamModal from '../src/modules/exam/DTMExamModal';

describe('DTMExamModal test', () => {
  it('should render without crashing when isOpen is true', () => {
    expect(() => {
      const html = ReactDOMServer.renderToString(
        React.createElement(DTMExamModal, { isOpen: true, onClose: () => {} })
      );
      expect(html).toBeDefined();
    }).not.toThrow();
  });
});
